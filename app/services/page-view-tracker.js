import Service, { inject as service } from '@ember/service';
import { isEqual } from '@ember/utils';
import { action } from '@ember/object';

export default class PageViewTracker extends Service {
  @service router;
  @service store;

  @action
  handleRouteChange(transition) {
    if (this.#shouldIgnoreEventForTransition(transition)) {
      return;
    }

    this.#buildAnalyticsEvent().save();
  }

  setupListener() {
    this.router.on('routeDidChange', this.handleRouteChange);
  }

  willDestroy() {
    this.router.off('routeDidChange', this.handleRouteChange);
  }

  #buildAnalyticsEvent() {
    if (this.router.currentRouteName === 'course') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_course_page',
        properties: { course_slug: this.router.currentRoute.params.course_slug },
      });
    } else if (this.router.currentRouteName === 'course-overview') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_course_overview_page',
        properties: { course_slug: this.router.currentRoute.params.course_slug },
      });
    } else if (this.router.currentRouteName === 'courses') {
      return this.store.createRecord('analytics-event', { name: 'viewed_course_list_page' });
    } else if (this.router.currentRouteName === 'join') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_referral_link_page',
        properties: { slug: this.router.currentRoute.queryParams.via },
      });
    } else if (this.router.currentRouteName === 'pay') {
      return this.store.createRecord('analytics-event', { name: 'viewed_payment_prompt' });
    } else if (this.router.currentRouteName === 'track') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_track_page',
        properties: { track_slug: this.router.currentRoute.params.track_slug },
      });
    } else if (this.router.currentRouteName === 'tracks') {
      return this.store.createRecord('analytics-event', { name: 'viewed_track_list_page' });
    } else if (this.router.currentRouteName === 'user') {
      return this.store.createRecord('analytics-event', {
        name: 'viewed_user_profile_page',
        properties: { username: this.router.currentRoute.params.username },
      });
    } else {
      return this.store.createRecord('analytics-event', { name: 'viewed_unknown_page', properties: { url: this.router.currentURL } });
    }
  }

  #shouldIgnoreEventForTransition(transition) {
    if (transition.to && (transition.to.name === 'course-stage-solution.diff' || transition.to.name === 'course-stage-solution.explanation')) {
      return true; // These are covered by afterModel hooks
    }

    if (!transition.from || !transition.to) {
      return false; // First page load, not reason to ignore
    }

    if (transition.from.name !== transition.to.name) {
      return false;
    }

    if (!isEqual(transition.from.params, transition.to.params)) {
      return false;
    }

    // Route name & params are the same, only query params differ.
    return true;
  }
}
