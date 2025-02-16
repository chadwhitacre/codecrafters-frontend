import { attribute, collection, clickable, clickOnText, isPresent, visitable } from 'ember-cli-page-object';
import { animationsSettled } from 'ember-animated/test-support';
import createPage from 'codecrafters-frontend/tests/support/create-page';

export default createPage({
  blocks: collection('[data-test-block]'),
  _clickOnContinueButton: clickable('[data-test-continue-button]'),
  _clickOnStepBackButton: clickable('[data-test-step-back-button]'),

  async clickOnContinueButton() {
    this._clickOnContinueButton();
    await animationsSettled();
  },

  async clickOnStepBackButton() {
    this._clickOnStepBackButton();
    await animationsSettled();
  },

  progress: {
    barStyle: attribute('style', '[data-test-concept-progress-bar]'),
    scope: '[data-test-concept-progress]',
  },

  questionCards: collection('[data-test-question-card]', {
    selectOption: clickOnText('[data-test-question-card-option]'),
    clickOnSubmitButton: clickable('[data-test-question-card-submit-button]'),
    clickOnContinueButton: clickable('[data-test-question-card-continue-button]'),
    clickOnShowExplanationButton: clickable('[data-test-question-card-show-explanation-button]'),
    hasSubmitted: isPresent('[data-test-question-submitted]'),
  }),

  shareConceptContainer: {
    clickOnCopyButton: clickable('[data-test-copy-button]'),
    scope: '[data-test-share-concept-container]',
  },

  upcomingConcept: {
    card: {
      title: {
        scope: '[data-test-concept-title]',
      },

      scope: '[data-test-concept-card]',
    },

    title: {
      scope: '[data-test-upcoming-concept-title]',
    },

    scope: '[data-test-upcoming-concept]',
  },

  visit: visitable('/concept/:slug'),
});
