import { Injectable } from '@nestjs/common';
import { CheckoutDto } from './dto/checkout.dto';
import moment from 'moment';
import _ from 'lodash';
import { env } from '../../config';
import rp from 'request-promise';
import { QueryUtil } from '../utils/query.util';
import { ConsultationSessionService } from '../consultation-session/consultation-session.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class CheckoutService {
  constructor(private checkoutDto: CheckoutDto,
              private queryUtil: QueryUtil,
              private consultationSessionService: ConsultationSessionService,
              private productService: ProductService) {}

  async clearCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    const _user = await this.queryUtil.fetchObject(user, 'username', option);
    const checkout = await this.createCheckout(_user);
    await this.consultationSessionService.archiveConsultationsIfAny(_user, option);
    _user.set('checkoutId', checkout.checkoutId);
    _user.set('checkoutToken', atob(checkout.checkoutId).split('/')[4].split('?')[0]);
    _user.set('checkoutUpdatedAt', moment().toDate());
    await _user.save({}, option);
    return checkout;
  }

  async createCheckout(user: Parse.Object, lineItems: Array<any> = []): Promise<{ [key: string]: any }> {
    const query = 'mutation { checkoutCreate(input: {}) { checkout { id webUrl totalPrice } userErrors { field message } } }';
    let result;
    try {
      result = await this.fetchQuery(query, user, { useMasterKey: true });
    } catch (error) {
      await Promise.reject(error);
    }
    const checkout = await this.checkoutDto.findOrCreateCheckout(user, { useMasterKey: true });
    checkout.set('checkoutUrl', result.data.checkoutCreate.checkout.webUrl);
    checkout.set('checkoutId', result.data.checkoutCreate.checkout.id);
    checkout.set('lineItems', lineItems);
    checkout.set('totalPrice', 0);
    await checkout.save({}, { useMasterKey: true });
    return { status: 'success',
      checkoutUrl: checkout.get('checkoutUrl'),
      checkoutId: checkout.get('checkoutId') };
  }

  async addProductToCheckout(variantId: string, user: Parse.Object, option: Parse.FullOptions, quantity?: number)
    : Promise<{ [key: string]: any }> {
    const checkout = await this.checkoutDto.findOrCreateCheckout(user, option);
    const lineItems = checkout.get('lineItems');
    let totalPrice = checkout.get('totalPrice');
    let variant = _.find(lineItems, { storefrontId: variantId });
    if (lineItems.length && variant) {
      variant.quantity += quantity || 1;
    } else {
      const product = await this.productService.findByVariantId(variantId, option);
      variant = _.find(product.get('variants'), { storefrontId: variantId });
      variant.quantity = quantity || 1;
      lineItems.push(variant);
    }
    totalPrice += Number(variant.price) * (quantity || 1);
    await checkout.save({ lineItems, totalPrice }, option);
    return this.getCheckout(user, option);
  }

  async addProductToCart(variantId: string, user: Parse.Object, option: Parse.FullOptions, quantity?: number)
    : Promise<{ [key: string]: any }> {
    const checkout = await this.checkoutDto.findOrCreateCheckout(user, option);
    const lineItems = checkout.get('lineItems');
    let totalPrice = checkout.get('totalPrice');
    let variant = _.find(lineItems, { storefrontId: variantId });
    if (lineItems.length && variant) {
      variant.quantity += quantity || 1;
    } else {
      const product = await this.productService.findByVariantId(variantId, option);
      variant = _.find(product.get('variants'), { storefrontId: variantId });
      variant.quantity = quantity || 1;
      lineItems.push(variant);
    }
    totalPrice += Number(variant.price) * (quantity || 1);
    await checkout.save({ lineItems, totalPrice }, option);
    const updatedCheckout = await this.getCheckout(user, option);
    return {
      updatedProductWithQuantity: [variant],
      updatedCheckout,
    };
  }

  async removeProductsFromCheckout(variantId: string, user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    const checkout = await this.checkoutDto.findOrCreateCheckout(user, option);
    const lineItems = checkout.get('lineItems');
    let totalPrice = checkout.get('totalPrice');
    const variant = _.find(lineItems, { storefrontId: variantId });
    if (lineItems.length && variant) {
      variant.quantity -= 1;
      totalPrice -= variant.price;
      if (!variant.quantity) {
        _.remove(lineItems, (item) => item.storefrontId === variantId);
        if (variant.addedByTree) {
          await this.consultationSessionService.archiveConsultationsIfAny(user, option);
        }
      }
    }
    await checkout.save({ lineItems, totalPrice }, option);
    return this.getCheckout(user, option);
  }

  async removeProductsFromCart(variantId: string, user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    const checkout = await this.checkoutDto.findOrCreateCheckout(user, option);
    const lineItems = checkout.get('lineItems');
    let totalPrice = checkout.get('totalPrice');
    const variant = _.find(lineItems, { storefrontId: variantId });
    if (lineItems.length && variant) {
      variant.quantity -= 1;
      totalPrice -= variant.price;
      if (!variant.quantity) {
        _.remove(lineItems, (item) => item.storefrontId === variantId);
        if (variant.addedByTree) {
          await this.consultationSessionService.archiveConsultationsIfAny(user, option);
        }
      }
    }
    await checkout.save({ lineItems, totalPrice }, option);
    const updatedCheckout = await this.getCheckout(user, option);
    return {
      updatedProductWithQuantity: [variant],
      updatedCheckout,
    };
  }

  async addLineItemsToStorefrontCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    const checkout = await this.getCheckout(user, option);
    const lineItems = this.getLineItemsFromCheckout(checkout);
    try {
      const formattedLineItems = this.convertLineItemsToSupportedFormat(lineItems);
      const query = `mutation { checkoutLineItemsReplace(lineItems: [${formattedLineItems}],
       checkoutId:"${user.get('checkoutId')}"), { checkout { id webUrl totalPrice lineItems(first:10)
       { edges { node { id title quantity variant { id price weight weightUnit image { src } product { id } } } } }  } } }`;
      await this.fetchQuery(query, user, option);
    } catch (error) {
      await Promise.reject(error);
    }
    return this.getCheckout(user, option);
  }

  async addProductsSuggestByTreeToCheckout(products: Array<{[key: string]: any}>, user: Parse.Object, option: Parse.FullOptions)
    : Promise<any> {
    const consultationSession = await this.consultationSessionService.findConsultationSession(user, option);
    let isRxRegimen = false;
    if (consultationSession && consultationSession.get('regimenTag') && consultationSession.get('regimenTag').includes('RX')) {
      isRxRegimen = true;
    }
    const lineItems = products.map((product: any) => {
      const variant = product.variants[0];
      variant.quantity = 1;
      variant.rx = isRxRegimen;
      variant.addedByTree = true;
      return variant;
    });
    const checkout = await this.checkoutDto.findOrCreateCheckout(user, option);
    const totalPrice: number = lineItems.map((lineItem: any) => lineItem.price)
      .reduce((total: number, price: any) => total + Number(price), 0);
    await checkout.save({ lineItems, totalPrice }, option);
    return this.getCheckout(user, option);
  }

  async fetchQuery(query: string, user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    let result: { [key: string]: any };
    try {
      result = await rp({
        method: 'POST',
        uri: env.STOREFRONT_GRAPHQL_ENDPOINT,
        headers: {
          'X-Shopify-Storefront-Access-Token': env.STOREFRONT_API_KEY,
        },
        body: { query },
        json: true,
      }) as { [key: string]: any };
    } catch (error) {
      await Promise.reject(error);
    }
    const checkout = await this.checkoutDto.findOrCreateCheckout(user, option);
    await checkout.save({ result }, option);
    return result;
  }

  getLineItemsFromCheckout(checkout: { [key: string]: any }): Array<{ [key: string]: any }> {
    return checkout.lineItems.map((item: any) => ({
      variantId: item.storefrontId,
      quantity: item.quantity,
    })) as Array<{ [key: string]: any }>;
  }

  convertLineItemsToSupportedFormat(lineItems: Array<{ [key: string]: any }>): string {
    let lineItemsString = '';
    lineItems.forEach((item: any) => {
      lineItemsString = `${lineItemsString}{ variantId: "${item.variantId}", quantity: ${item.quantity} },`;
    });
    return lineItemsString.slice(0, -1);
  }

  async getCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<{ [key: string]: any }> {
    const checkout: Parse.Object = await this.checkoutDto.findOrCreateCheckout(user, option);
    const result = { lineItems: checkout.get('lineItems'),
      totalPrice: checkout.get('totalPrice').toFixed(2),
      checkoutUrl: checkout.get('checkoutUrl'),
      checkoutId: checkout.get('checkoutId') };
    return result;
  }

  async findOrCreateCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.checkoutDto.findOrCreateCheckout(user, option);
  }

  async getLineItemsCount(user: Parse.Object, option: Parse.FullOptions): Promise<number> {
    const checkout: Parse.Object = await this.checkoutDto.findOrCreateCheckout(user, option);
    return checkout.get('lineItems').length;
  }

  async findCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.checkoutDto.findCheckout(user, option);
  }

  async deleteCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    return this.checkoutDto.deleteCheckout(user, option);
  }
}
