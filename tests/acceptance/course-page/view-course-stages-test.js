import { animationsSettled, setupAnimationTest } from 'ember-animated/test-support';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { signIn, signInAsSubscriber } from 'codecrafters-frontend/tests/support/authentication-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import coursePage from 'codecrafters-frontend/tests/pages/course-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';

module('Acceptance | course-page | view-course-stages-test', function (hooks) {
  setupApplicationTest(hooks);
  setupAnimationTest(hooks);
  setupMirage(hooks);
  setupClock(hooks);

  test('can view stages before starting course', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.ok(coursePage.setupItemIsActive, 'setup item is active by default');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is active if clicked on');

    await coursePage.clickOnCollapsedItem('Bind to a port');
    await animationsSettled();

    assert.ok(coursePage.courseStageItemIsActive, 'course stage item is active if clicked on');

    await coursePage.clickOnCollapsedItem('Setup');
    await animationsSettled();

    assert.ok(coursePage.setupItemIsActive, 'setup item is active if clicked on');
  });

  test('can view previous stages after completing them', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    let currentUser = this.server.schema.users.first();
    let python = this.server.schema.languages.findBy({ name: 'Python' });
    let redis = this.server.schema.courses.findBy({ slug: 'redis' });

    let pythonRepository = this.server.create('repository', 'withFirstStageCompleted', {
      course: redis,
      language: python,
      name: 'Python #1',
      user: currentUser,
    });

    this.server.create('course-stage-completion', {
      repository: pythonRepository,
      courseStage: redis.stages.models.sortBy('position').toArray()[1],
    });

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to multiple PINGs');

    await coursePage.clickOnCollapsedItem('Respond to PING');
    await animationsSettled();

    assert.equal(coursePage.activeCourseStageItem.title, 'Respond to PING', 'course stage item is active if clicked on');
  });

  test('stages have free labels if user does not have active subscription', async function (assert) {
    signIn(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Docker');

    assert.ok(coursePage.collapsedItems[0].hasFreeLabel, 'free stages should have free labels');
    assert.ok(coursePage.collapsedItems[1].hasFreeLabel, 'free stages should have free labels');
    assert.notOk(coursePage.collapsedItems[2].hasFreeLabel, 'paid stages should not have free labels');

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.notOk(coursePage.collapsedItems[0].hasFreeLabel, 'free stages should not have free labels if course is free');
    assert.notOk(coursePage.collapsedItems[1].hasFreeLabel, 'free stages should not free labels if course is free');
    assert.notOk(coursePage.collapsedItems[2].hasFreeLabel, 'paid stages should not have free labels');
  });

  test('stages should not have free labels if user has active subscription', async function (assert) {
    signInAsSubscriber(this.owner);
    testScenario(this.server);

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Docker');

    assert.notOk(coursePage.collapsedItems[0].hasFreeLabel, 'free stages should not have free labels');
    assert.notOk(coursePage.collapsedItems[1].hasFreeLabel, 'free stages should not have free labels');
    assert.notOk(coursePage.collapsedItems[2].hasFreeLabel, 'paid stages should not have free labels');

    await coursesPage.visit();
    await coursesPage.clickOnCourse('Build your own Redis');

    assert.notOk(coursePage.collapsedItems[0].hasFreeLabel, 'free stages should not have free labels if course is free');
    assert.notOk(coursePage.collapsedItems[1].hasFreeLabel, 'free stages should not free labels if course is free');
    assert.notOk(coursePage.collapsedItems[2].hasFreeLabel, 'paid stages should not have free labels');
  });
});
