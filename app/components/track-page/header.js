import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TrackPageHeaderComponent extends Component {
  @service currentUser;
  @service store;

  get currentUserHasStartedTrack() {
    return this.currentUser.isAuthenticated && this.currentUser.record.repositories.filterBy('language', this.args.language).firstObject;
  }

  get topParticipants() {
    return this.store
      .peekAll('track-leaderboard-entry')
      .filterBy('language', this.args.language)
      .sortBy('completedStagesCount')
      .reverse()
      .uniqBy('user')
      .slice(0, 3)
      .mapBy('user');
  }
}