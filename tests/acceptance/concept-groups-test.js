import conceptGroupsPage from 'codecrafters-frontend/tests/pages/concept-groups-page';
import createConceptFromFixture from 'codecrafters-frontend/mirage/utils/create-concept-from-fixture';
import networkProtocols from 'codecrafters-frontend/mirage/concept-fixtures/network-protocols';
import tcpOverview from 'codecrafters-frontend/mirage/concept-fixtures/tcp-overview';
import testScenario from 'codecrafters-frontend/mirage/scenarios/test';
import { module, test } from 'qunit';
import { setupApplicationTest } from 'ember-qunit';
import { setupMirage } from 'ember-cli-mirage/test-support';

function createConcepts(server) {
  createConceptFromFixture(server, tcpOverview);
  createConceptFromFixture(server, networkProtocols);
}

module('Acceptance | concept-groups-test', function (hooks) {
  setupApplicationTest(hooks);
  setupMirage(hooks);

  test('displays the correct concept group details for the header', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();

    const conceptGroup = this.server.create('concept-group', {
      author: user,
      description_markdown: 'Dummy description',
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'test-concept-group',
      title: 'Test Concept Group',
    });

    await conceptGroupsPage.visit({ id: conceptGroup.id });

    assert.strictEqual(conceptGroupsPage.header.title, 'Test Concept Group');
    assert.strictEqual(conceptGroupsPage.header.description, 'Dummy description');
    assert.strictEqual(conceptGroupsPage.header.author.username, 'rohitpaulk');
    assert.strictEqual(conceptGroupsPage.header.author.title, 'Collection Author');
  });

  test('displays the correct concept cards', async function (assert) {
    testScenario(this.server);
    createConcepts(this.server);

    const user = this.server.schema.users.first();

    const conceptGroup = this.server.create('concept-group', {
      author: user,
      description_markdown: 'Dummy description',
      concept_slugs: ['tcp-overview', 'network-protocols'],
      slug: 'test-concept-group',
      title: 'Test Concept Group',
    });

    await conceptGroupsPage.visit({ id: conceptGroup.id });

    assert.strictEqual(conceptGroupsPage.conceptCards.length, 2);
    assert.strictEqual(conceptGroupsPage.conceptCards[0].title, 'TCP: An Overview');
    assert.strictEqual(conceptGroupsPage.conceptCards[1].title, 'Network Protocols');
  });
});
