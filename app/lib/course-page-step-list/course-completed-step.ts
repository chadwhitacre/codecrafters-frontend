import { tracked } from '@glimmer/tracking';
import type ProgressIndicator from 'codecrafters-frontend/lib/course-page-step-list/progress-indicator';
import Step from 'codecrafters-frontend/lib/course-page-step-list/step';
import { TemporaryRepositoryModel } from 'codecrafters-frontend/models/temporary-types';

export default class CourseCompletedStep extends Step {
  @tracked repository;

  constructor(repository: TemporaryRepositoryModel) {
    super();

    this.repository = repository;
  }

  get isHidden() {
    return !this.repository.allStagesAreComplete;
  }

  get progressIndicator(): ProgressIndicator {
    return {
      dotColor: 'green',
      dotType: 'static',
      text: 'Congratulations!',
    };
  }

  get status(): 'not_started' {
    return 'not_started';
  }

  get routeParams() {
    return {
      route: 'course.completed',
      models: [this.repository.course.slug],
    };
  }

  get title() {
    return 'Challenge completed!';
  }

  get type(): 'CourseCompletedStep' {
    return 'CourseCompletedStep';
  }
}
