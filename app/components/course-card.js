import Component from '@glimmer/component';
import { action } from '@ember/object';

export default class CourseCardComponent extends Component {
  @action
  navigateToCourse() {
    window.location.replace(`/courses/${this.args.course.slug}`);
  }
}
