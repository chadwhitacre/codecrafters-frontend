import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CodeWalkthrough extends Model {
  @attr('string') introductionMarkdown;
  @attr('') sections; // free-form JSON
  @attr('string') slug;
  @attr('string') title;
  @attr('date') updatedAt;
  @attr('string') hackerNewsUrl;
}
