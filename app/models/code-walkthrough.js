import { attr } from '@ember-data/model';
import Model from '@ember-data/model';

export default class CodeWalkthrough extends Model {
  @attr('string') introductionMarkdown;
  @attr('') sections; // free-form JSON
  @attr('string') slug;
  @attr('string') title;

  // TODO: fetch this from server
  get hackerNewsUrl() {
    return null;
  }
}
