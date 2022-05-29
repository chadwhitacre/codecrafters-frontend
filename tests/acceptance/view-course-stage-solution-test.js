import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import courseOverviewPage from 'codecrafters-frontend/tests/pages/course-overview-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { currentURL, visit } from '@ember/test-helpers';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';

module('Acceptance | view-course-stage-solution', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders solution', async function (assert) {
    testScenario(this.server);

    await visit('/courses/redis/solutions/ping-pong-multiple');

    assert.equal(currentURL(), '/courses/redis/solutions/ping-pong-multiple');

    await this.pauseTest();
  });
});
