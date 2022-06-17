import Poller from 'codecrafters-frontend/lib/poller';

export default class RepositoryPoller extends Poller {
  async doPoll() {
    return await this.store.query('repository', {
      course_id: this.model.course.id,
      include: 'language,course,user,course-stage-completions.course-stage,last-submission.course-stage',
    });
  }
}
