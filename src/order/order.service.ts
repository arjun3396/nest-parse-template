import { Injectable } from '@nestjs/common';
import { OrderDto } from './dto/order.dto';
import { FavouriteService } from '../favourite/favourite.service';
import { CheckoutService } from '../checkout/checkout.service';
import { ProductService } from '../product/product.service';
import { PurchaseHistoryService } from '../purchase-history/purchase-history.service';
import { env } from '../../config';
import rp from 'request-promise';
import _ from 'lodash';
import { CollectionUtil } from '../utils/collection.util';

@Injectable()
export class OrderService {
  constructor(private orderDto: OrderDto,
              private productService: ProductService,
              private checkoutService: CheckoutService,
              private favouriteService: FavouriteService,
              private purchaseHistoryService: PurchaseHistoryService) {}

  async repeatOrder(orderId: string, user: Parse.Object, option: Parse.FullOptions)
    : Promise<any> {
    if (!orderId) {
      return Promise.reject(new Error('Missing required params: orderId'));
    }

    const order = await this.getOrder(orderId, option);
    if (!order) {
      return Promise.reject(new Error(`No order found with orderId: ${orderId}`));
    }

    const lineItems = order.get('checkoutLineItems');
    await this.checkoutService.clearCheckout(user, option);
    const checkout = await this.checkoutService.findOrCreateCheckout(user, option);
    await checkout.save({ lineItems }, option);
    return this.checkoutService.getCheckout(user, option);
  }

  async getOrderHistory(user: Parse.Object, option: Parse.FullOptions): Promise<Array<{ [key: string]: any }>> {
    const allOrders = await this.orderDto.getAllOrders(user, option);
    return allOrders;
  }

  async getOrderDetails(user: Parse.Object, orderId: string, option: Parse.FullOptions)
    : Promise<{ [key: string]: any}> {
    if (!orderId) {
      return Promise.reject(new Error('Missing field orderId'));
    }
    const order = await this.orderDto.getOrder(orderId, option);
    if (!order) {
      return Promise.reject(new Error('Order not found'));
    }

    if (!order.get('trackingURL') || !order.get('delivered')) {
      const result: { [key: string]: any } = await rp({
        method: 'GET',
        uri: `https://${env.SHOPIFY_API_KEY}:${env.SHOPIFY_PASSWORD}@${env.SHOPIFY_SHOPNAME}/admin/api/2020-04/orders/${orderId}.json`,
        json: true,
      });
      if (result.order.fulfillments && result.order.fulfillments.length) {
        order.set('trackingURL', result.order.fulfillments[0].tracking_url);
        order.set('delivered', result.order.fulfillments[0].shipment_status === 'delivered');
        await order.save({}, option);
      }
    }

    const checkout = await this.checkoutService.getCheckout(user, option);
    const favourites = await this.favouriteService.getAllFavourites(user, option);
    let resultJSONL = order.get('lineItems');
    resultJSONL = await this.productService.checkIfAddedToCheckout(resultJSONL, checkout);
    resultJSONL = await this.productService.checkIfAddedToFavorite(resultJSONL, favourites);
    order.set('lineItems', resultJSONL);
    const orderJSON = JSON.parse(JSON.stringify(order));
    return orderJSON;
  }

  async saveOrderWebhookResponse(user: Parse.Object, _orderDetails: {[key: string]: any}, option: Parse.FullOptions): Promise<any> {
    const orderDetails = _orderDetails;
    const lineItems = orderDetails.line_items;
    const lineItemsCopy = [...orderDetails.line_items];
    const purchaseEntries = [];
    for (let i = 0; i < lineItems.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const item = await this.productService.findById(lineItems[i].product_id.toString(), option);
      lineItemsCopy[i].product_id = lineItemsCopy[i].product_id.toString();
      lineItems[i] = item;
      purchaseEntries.push(this.purchaseHistoryService.addPurchaseEntry(user, item));
    }
    await Promise.all(purchaseEntries);
    const lineItemsJSONL: Array<{[key: string]: any }> = lineItems
      .map((product) => product.toJSON());

    lineItemsJSONL.forEach((item: any) => {
      const matchedItem = _.find(lineItemsCopy, { product_id: item.objectId });
      // eslint-disable-next-line no-param-reassign
      item.quantity = matchedItem.quantity;
    });

    const checkoutLineItems = lineItemsJSONL.map((item: any) => {
      const matchedItem = _.find(lineItemsCopy, { product_id: item.objectId });
      const _item = item.variants[0];
      _item.quantity = matchedItem.quantity;
      return _item;
    });

    delete orderDetails.line_items;
    const result = await this.orderDto.saveOrder(user, orderDetails, lineItemsJSONL, checkoutLineItems, option);
    return result;
  }

  async cancelOrderWebhookResponse(_orderDetails: {[key: string]: any}, option: Parse.FullOptions): Promise<any> {
    const order = await this.orderDto.getOrder(_orderDetails.id, option);
    if (!order) { return { status: 'success', message: 'not an app order' }; }
    return order.save({ canceled: true }, option);
  }

  async getOrder(orderId: string, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.orderDto.getOrder(orderId, option);
  }

  async getAllOrders(user: Parse.Object, option: Parse.FullOptions): Promise<Array<Parse.Object>> {
    return this.orderDto.getAllOrders(user, option);
  }
}
