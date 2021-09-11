import { attr, belongsTo } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CourseStageModel extends Model {
  @belongsTo('course', { async: false }) course;
  @attr('string') name;
  @attr('string') descriptionMarkdownTemplate;
  @attr('number') position;
}
