import { inject as service } from '@ember/service';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import fade from 'ember-animated/transitions/fade';

export default class CourseStageItemActionButtonListComponent extends Component {
  @service authenticator;
  @service featureFlags;
  @service store;
  @service visibility;
  transition = fade;

  get anyButtonIsVisible() {
    return (
      this.shouldShowViewSolutionButton ||
      this.shouldShowViewTestCasesButton ||
      this.shouldShowViewSourceWalkthroughButton ||
      this.shouldShowSubmitFeedbackButton ||
      this.shouldShowEditFeedbackButton ||
      this.shouldShowViewCommentsButton
    );
  }

  @action
  handleViewTestCasesButtonClicked() {
    window.open(this.args.courseStage.testerSourceCodeUrl, '_blank').focus();
  }

  get shouldShowEditFeedbackButton() {
    return !this.args.shouldHideFeedbackButtons && !!this.args.repository.hasClosedCourseStageFeedbackSubmissionFor(this.args.courseStage);
  }

  get shouldShowSubmitFeedbackButton() {
    // Hide if we're asked to hide feedback
    if (this.args.shouldHideFeedbackButtons) {
      return false;
    }

    // Hide if edit feedback button is visible
    if (this.shouldShowEditFeedbackButton) {
      return false;
    }

    if (this.args.repository.stageIsComplete(this.args.courseStage)) {
      return true; // Always show feedback button if stage is complete
    }

    // Show when stage is active except for stage 1
    return !this.args.courseStage.isFirst && this.args.repository.activeStage === this.args.courseStage;
  }

  get shouldShowViewCommentsButton() {
    return true; // Comments are always available
  }

  get shouldShowViewSolutionButton() {
    return true; // Community solutions are always available!
  }

  get shouldPulseViewSolutionButton() {
    return this.shouldShowViewSolutionButton && this.args.courseStage.shouldShowPulsingViewSolutionButtonFor(this.args.repository);
  }

  get shouldShowViewTestCasesButton() {
    if (this.args.courseStage.isFirst) {
      return false; // Don't expose user to too many features at once
    }

    return this.args.courseStage.testerSourceCodeUrl;
  }

  get shouldShowViewSourceWalkthroughButton() {
    // This can be distracting, especially in early stages. Let's disable for now.
    return false;

    // return this.args.courseStage.sourceWalkthrough;
  }
}
