import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class CourseRoute extends Route {
  @service currentUser;

  async model(params) {
    await this.currentUser.authenticate();

    let courses = await this.store.findAll('course');
    let course = courses.findBy('slug', params.course_slug);

    let repositories = await this.store.query('repository', {
      course_id: course.id,
    });

    return {
      course: course,
      repositories: repositories,
    };
  }
}
