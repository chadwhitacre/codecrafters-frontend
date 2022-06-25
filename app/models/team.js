import { attr, hasMany } from '@ember-data/model';
import Model from '@ember-data/model';

export default class TeamModel extends Model {
  @attr('string') inviteCode;
  @hasMany('team-membership', { async: false }) memberships;
  @attr('string') name;
  @hasMany('team-subscription', { async: false }) subscriptions;

  get admins() {
    return this.memberships.filterBy('isAdmin', true).mapBy('user');
  }

  get hasActiveSubscription() {
    return this.subscriptions.isAny('isActive');
  }

  get inviteUrl() {
    return `${window.location.origin}/join_team?invite_code=${this.inviteCode}`;
  }

  get members() {
    return this.memberships.mapBy('user');
  }
}
