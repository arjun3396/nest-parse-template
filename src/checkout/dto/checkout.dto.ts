import { Injectable } from '@nestjs/common';

@Injectable()
export class CheckoutDto {
  constructor(@inject(QueryUtil) private queryUtil: QueryUtil) {}

  async findOrCreateCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    let checkout = await this.queryUtil.findOne(CollectionUtil.Checkout, {
      where: { user },
      option,
    });
    if (!checkout) {
      checkout = new CollectionUtil.Checkout();
      checkout.set('user', user);
      checkout.set('lineItems', []);
      checkout.set('totalPrice', 0);
      await checkout.save({}, option);
    }
    return checkout;
  }

  async findCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    const checkout = await this.queryUtil.findOne(CollectionUtil.Checkout, {
      where: { user },
      option,
    });
    return checkout;
  }

  async deleteCheckout(user: Parse.Object, option: Parse.FullOptions): Promise<Parse.Object> {
    const checkout = await this.queryUtil.findOne(CollectionUtil.Checkout, {
      where: { user },
      option,
    });
    if (checkout) {
      return checkout.destroy(option);
    }
    return undefined;
  }
}
