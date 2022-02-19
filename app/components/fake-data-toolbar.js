import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { action } from '@ember/object';

export default class FakeDataToolbarComponent extends Component {
  @service store;

  @action
  async handleCreateSubmissionButtonClick() {
    let submission = window.server.create('submission', {
      createdAt: new Date(),
      repository: window.server.schema.repositories.find(this.args.repository.id),
      courseStage: window.server.schema.courseStages.find(this.args.repository.activeStage.id),
      status: 'evaluating',
    });

    submission.repository.update('lastSubmission', submission);
  }

  @action
  async handleFailTestsButtonClick() {
    let submission = window.server.schema.submissions.find(this.args.repository.lastSubmission.id);

    let leaderboardEntry = window.server.schema.leaderboardEntries.findBy({
      userId: submission.repository.user.id,
      languageId: submission.repository.language.id,
    });

    submission.update({ status: 'failure' });
    leaderboardEntry.update({ status: 'idle' });
  }

  @action
  async handlePassTestsButtonClick() {
    let submission = this.args.repository.lastSubmission;

    window.server.schema.submissions.find(submission.id).update({ status: 'success' });

    window.server.create('course-stage-completion', {
      completedAt: new Date(),
      repository: window.server.schema.repositories.find(submission.repository.id),
      courseStage: window.server.schema.courseStages.find(submission.courseStage.id),
    });
  }
}