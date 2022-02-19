import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | view-courses', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('it renders', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    assert.equal(coursesPage.courseCards.length, 4, 'expected 4 course cards to be present');

    assert.notOk(coursesPage.courseCards[0].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(coursesPage.courseCards[1].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(coursesPage.courseCards[2].hasBetaLabel, 'live challenges should not have beta label');
    assert.ok(coursesPage.courseCards[3].hasBetaLabel, 'live challenges should not have beta label');
  });

  test('it renders with progress if user has started a course', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      user: currentUser,
    });

    await coursesPage.visit();
    assert.equal(coursesPage.courseCards.length, 4, 'expected 4 course cards to be present');

    assert.equal(coursesPage.courseCards[0].actionText, 'Resume');
    assert.equal(coursesPage.courseCards[1].actionText, 'Start');
    assert.equal(coursesPage.courseCards[1].actionText, 'Start');
    assert.equal(coursesPage.courseCards[1].actionText, 'Start');
  });

  test('it renders if user is not signed in', async function (assert) {
    testScenario(this.server);

    await coursesPage.visit();
    assert.equal(coursesPage.courseCards.length, 4, 'expected 4 course cards to be present');

    assert.notOk(coursesPage.courseCards[0].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(coursesPage.courseCards[1].hasBetaLabel, 'live challenges should not have beta label');
    assert.notOk(coursesPage.courseCards[2].hasBetaLabel, 'live challenges should not have beta label');
    assert.ok(coursesPage.courseCards[3].hasBetaLabel, 'live challenges should not have beta label');
  });
});