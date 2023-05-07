import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

// Same as the ember model, to avoid creating fake models
export default class LeaderboardEntry extends Model {
  @attr('string') status;
  @belongsTo('course-stage', { async: false }) currentCourseStage;
  @belongsTo('language', { async: false }) language;
  @belongsTo('user', { async: false }) user;
  @attr('date') lastAttemptAt;

  get completedStagesCount() {
    if (this.statusIsCompleted) {
      return this.currentCourseStage.position;
    } else {
      return this.currentCourseStage.position - 1;
    }
  }

  get course() {
    return this.currentCourseStage.course;
  }

  get userId() {
    return this.user.id;
  }

  get statusIsCompleted() {
    return this.status === 'completed';
  }

  get statusIsEvaluating() {
    return this.status === 'evaluating';
  }

  get statusIsIdle() {
    return this.status === 'idle';
  }
}
