import EmberRouter from '@ember/routing/router';
import config from 'codecrafters-frontend/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('courses');
  this.route('course', { path: '/courses/:course_slug' });
});
