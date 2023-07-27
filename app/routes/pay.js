import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import RegionalDiscountModel from 'codecrafters-frontend/models/regional-discount';

export default class PayRoute extends BaseRoute {
  @service authenticator;
  @service store;

  activate() {
    scrollToTop();
  }

  async model() {
    await this.authenticator.authenticate();

    if (this.authenticator.currentUser && this.authenticator.currentUser.hasActiveSubscription) {
      this.router.transitionTo('membership');
    }

    return {
      courses: await this.store.findAll('course'), // For testimonials
      customDiscounts: await this.store.findAll('custom-discount', { include: 'user' }),
      regionalDiscount: await this.store.createRecord('regional-discount').fetchCurrent(),
    };
  }
}
