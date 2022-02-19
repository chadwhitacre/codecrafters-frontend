import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';
import { setupWindowMock } from 'ember-window-mock/test-support';
import { signInAsTeamAdmin, signInAsTeamMember } from 'codecrafters-frontend/tests/support/authentication-helpers';
import { waitUntil } from '@ember/test-helpers';
import coursesPage from 'codecrafters-frontend/tests/pages/courses-page';
import teamPage from 'codecrafters-frontend/tests/pages/team-page';
import setupClock from 'codecrafters-frontend/tests/support/setup-clock';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import percySnapshot from '@percy/ember';
import window from 'ember-window-mock';

module('Acceptance | manage-team-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);
  setupWindowMock(hooks);
  setupClock(hooks);

  test('team admin sees manage team option in account dropdown', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();

    assert.ok(coursesPage.accountDropdown.hasLink('Manage Team'), 'Manage team link is present');
  });

  test('non-admin team member does not see manage team option in account dropdown', async function (assert) {
    testScenario(this.server);
    signInAsTeamMember(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();

    assert.notOk(coursesPage.accountDropdown.hasLink('Manage Team'), 'Manage team link is not present');
  });

  test('team admin can view team members & invite link when they are the only member', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Team');

    assert.equal(teamPage.members.length, 1, 'expected only one members to be present');

    await percySnapshot('Manage Team - Only Admin Present');
  });

  test('team admin can view team members when multiple members exist', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    const team = this.server.schema.teams.first();

    const member1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const member2 = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    this.server.create('team-membership', { user: member1, team: team, createdAt: new Date(), isAdmin: false });
    this.server.create('team-membership', { user: member2, team: team, createdAt: new Date(), isAdmin: false });

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Team');

    assert.equal(teamPage.members.length, 3, 'expected 3 members to be present');

    await percySnapshot('Manage Team - Multiple Members Present');
  });

  test('team admin can remove team members', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    const team = this.server.schema.teams.first();

    const member1 = this.server.create('user', {
      avatarUrl: 'https://github.com/sarupbanskota.png',
      createdAt: new Date(),
      githubUsername: 'sarupbanskota',
      username: 'sarupbanskota',
    });

    const member2 = this.server.create('user', {
      avatarUrl: 'https://github.com/Gufran.png',
      createdAt: new Date(),
      githubUsername: 'gufran',
      username: 'gufran',
    });

    this.server.create('team-membership', { user: member1, team: team, createdAt: new Date(2021, 1, 1), isAdmin: false });
    this.server.create('team-membership', { user: member2, team: team, createdAt: new Date(2021, 2, 1), isAdmin: false });

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Team');

    assert.equal(teamPage.members.length, 3, 'expected 3 members to be present');

    await teamPage.members[1].clickRemoveButton();
    await waitUntil(() => teamPage.members.length === 2);

    await teamPage.members[1].clickRemoveButton();
    await waitUntil(() => teamPage.members.length === 1);
  });

  test('team admin can create team billing session', async function (assert) {
    testScenario(this.server);
    signInAsTeamAdmin(this.owner, this.server);

    await coursesPage.visit();
    await coursesPage.accountDropdown.toggle();
    await coursesPage.accountDropdown.clickOnLink('Manage Team');

    await teamPage.clickOnManageSubscriptionButton();

    assert.equal(window.location.href, 'https://test.com/team_billing_session', 'should redirect to team billing session URL');
  });
});