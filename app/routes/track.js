import { inject as service } from '@ember/service';
import BaseRoute from 'codecrafters-frontend/lib/base-route';
import RepositoryPoller from 'codecrafters-frontend/lib/repository-poller';
import scrollToTop from 'codecrafters-frontend/lib/scroll-to-top';
import { tracked } from '@glimmer/tracking';
import config from 'codecrafters-frontend/config/environment';

export default class TrackRoute extends BaseRoute {
  allowsAnonymousAccess = true;
  @service authenticator;
  @service store;
  @service headData;

  @tracked previousMetaImageUrl;

  activate() {
    scrollToTop();
  }

  async model(params) {
    let courses = await this.store.findAll('course', {
      include: 'stages,stages.solutions.language,language-configurations.language',
    });
    let language = this.store.peekAll('language').findBy('slug', params.track_slug);

    if (this.authenticator.isAuthenticated) {
      await this.store.findAll('repository', {
        include: RepositoryPoller.defaultIncludedResources,
      });
    }

    return {
      courses: courses.filter((course) => course.betaOrLiveLanguages.includes(language)),
      language: language,
    };
  }

  async afterModel({ language: { slug } = {} } = {}) {
    this.previousMetaImageUrl = this.headData.imageUrl;
    this.headData.imageUrl = `${config.x.metaTagImagesBaseURL}language-${slug}.jpg`;
  }

  deactivate() {
    this.headData.imageUrl = this.previousMetaImageUrl;
  }
}
