import { Injectable } from '@nestjs/common';

@Injectable()
export class OrderDto {
  constructor(@inject(ConsultationSessionModel) private consultationSessionModel: ConsultationSessionModel,
              @inject(QueryUtil) private queryUtil: QueryUtil) {}

  async getAllOrders(user: Parse.Object, option: Parse.FullOptions): Promise<Array<Parse.Object>> {
    return this.queryUtil.find(CollectionUtil.Order, { where: { user }, descending: 'createdAt', option });
  }

  async getOrder(orderId: string, option: Parse.FullOptions): Promise<Parse.Object> {
    const order = await this.queryUtil.findOne(CollectionUtil.Order, { where: { orderId }, option });
    return order;
  }

  async saveOrder(user: Parse.Object, orderDetails: {[key: string]: any}, lineItems: any, checkoutLineItems: any, option: Parse.FullOptions)
    : Promise<{[key: string]: any}> {
    const consultationSession = await this.consultationSessionModel.findConsultationSession(user, option);
    const order = new CollectionUtil.Order();
    order.set('orderDetails', orderDetails);
    order.set('lineItems', lineItems);
    order.set('checkoutLineItems', checkoutLineItems);
    order.set('user', user);
    order.set('delivered', false);
    order.set('orderId', orderDetails.id.toString());
    order.set('orderURL', `https://${env.SHOPIFY_SHOPNAME}/admin/orders/${orderDetails.id}`);
    if (consultationSession && consultationSession.get('regimenTag') && consultationSession.get('regimenTag').includes('RX')) {
      order.set('approved', false);
    } else {
      order.set('approved', true);
    }
    await order.save({}, option);
    return { status: 'success', orderId: order.id };
  }
}
