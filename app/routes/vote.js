import { inject as service } from '@ember/service';
import ApplicationRoute from 'codecrafters-frontend/lib/application-route';
import RSVP from 'rsvp';

export default class VoteRoute extends ApplicationRoute {
  allowsAnonymousAccess = true;
  @service('current-user') currentUserService;
  @service router;
  @service store;

  activate() {
    window.scrollTo({ top: 0 });
  }

  model() {
    const modelPromises = {};

    modelPromises.courseIdeas = this.store.findAll('course-idea', { include: 'votes,votes.user,supervotes,supervotes.user' });

    modelPromises.courseExtensionIdeas = this.store.findAll('course-extension-idea', {
      include: 'course,votes,votes.user,supervotes,supervotes.user',
    });

    if (this.currentUserService.isAuthenticated) {
      // No need to wait on this, can load in the background
      this.store.findRecord('user', this.currentUserService.record.id, {
        include: 'course-idea-supervote-grants,course-extension-idea-supervote-grants',
        reload: true,
      });
    }

    return RSVP.hash(modelPromises);
  }

  afterModel(model, transition) {
    if (transition.to.name === 'vote.index') {
      this.router.transitionTo('vote.course-ideas');
    }
  }
}
