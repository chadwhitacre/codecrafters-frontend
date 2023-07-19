import Controller from '@ember/controller';
import Store from '@ember-data/store';
import { action } from '@ember/object';
import { createPopup } from '@typeform/embed';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { next } from '@ember/runloop';

type ModelType = {
  courseStage: {
    slug: string;
    course: {
      slug: string;
    };
    screencasts: {
      id: string;
    }[];
  };
};

export default class ScreencastsTabComponent extends Controller {
  queryParams = ['selectedScreencastId'];

  declare model: ModelType;

  @tracked embedHtml: string | undefined;
  @tracked selectedScreencastId: any | undefined;
  @tracked screencastPlayerElement: HTMLDivElement | undefined;

  // @ts-ignore
  @service declare authenticator;

  @service declare store: Store;

  get selectedScreencast() {
    if (!this.selectedScreencastId) {
      return null;
    }

    const screencast = this.store.peekRecord('course-stage-screencast', this.selectedScreencastId);

    // If screencast belongs to another stage (query params are persisted between stages), don't show it
    if (screencast && screencast.courseStage === this.model.courseStage) {
      return screencast;
    }
  }

  get screencasts() {
    return this.model.courseStage.screencasts;
  }

  get screencastsForList() {
    return this.screencasts.filter((screencast) => screencast !== this.selectedScreencast);
  }

  @action
  handleScreencastClicked(screencast: any) {
    this.selectedScreencastId = screencast.id;

    next(() => {
      if (this.screencastPlayerElement) {
        this.screencastPlayerElement.scrollIntoView();
      }
    });
  }

  @action
  handleSubmitScreencastButtonClicked() {
    createPopup('Dl5342qZ', {
      hidden: {
        github_username: this.authenticator.currentUser.username,
        course_slug: this.model.courseStage.course.slug,
        course_stage_slug: this.model.courseStage.slug,
      },
    }).toggle();
  }

  @action
  async handleDidInsertScreencastPlayer(element: HTMLDivElement) {
    this.screencastPlayerElement = element;
  }
}