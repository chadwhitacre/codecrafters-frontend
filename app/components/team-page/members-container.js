import { inject as service } from '@ember/service';
import Component from '@glimmer/component';

export default class MembersContainerComponent extends Component {
  @service('current-user') currentUserService;

  get currentUserIsTeamAdmin() {
    return this.args.team.admins.includes(this.currentUserService.record);
  }
}