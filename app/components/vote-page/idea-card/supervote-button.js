import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class SupervoteButtonComponent extends Component {
  @service('current-user') currentUserService;
}