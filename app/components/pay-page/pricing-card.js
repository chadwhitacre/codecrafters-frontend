import Component from '@glimmer/component';
import window from 'ember-window-mock';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

export default class PricingCardComponent extends Component {
  @service authenticator;
  @service store;
  @tracked isCreatingCheckoutSession = false;

  get featureDescriptions() {
    return [`Unrestricted content access`, `Download invoice for expensing`, `Private leaderboard for your team`];
  }

  @action
  async handleStartPaymentButtonClicked() {
    this.isCreatingCheckoutSession = true;

    let checkoutSession = this.store.createRecord('individual-checkout-session', {
      autoRenewSubscription: false, // None of our plans are subscriptions at the moment
      customDiscount: this.args.customDiscount,
      earlyBirdDiscountEnabled: this.args.earlyBirdDiscountEnabled,
      referralDiscountEnabled: this.args.referralDiscountEnabled,
      successUrl: `${window.location.origin}/tracks`,
      cancelUrl: `${window.location.origin}/pay`,
      pricingFrequency: this.args.pricingFrequency,
    });

    await checkoutSession.save();
    window.location.href = checkoutSession.url;
  }

  get pricingFrequencyAbbreviation() {
    return {
      monthly: 'mo',
      yearly: 'yr',
      quarterly: 'qtr',
    }[this.args.pricingFrequency];
  }

  get user() {
    return this.authenticator.currentUser;
  }
}
