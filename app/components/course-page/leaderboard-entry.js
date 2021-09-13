import Component from '@glimmer/component';

export default class CoursePageLeaderboardEntryComponent extends Component {
  get progressNumerator() {
    return this.args.entry.highestCompletedCourseStage.position;
  }

  get progressDenominator() {
    return this.args.entry.highestCompletedCourseStage.course.stages.length;
  }

  get progressPercentage() {
    return 100 * (this.progressNumerator / this.progressDenominator);
  }
}
