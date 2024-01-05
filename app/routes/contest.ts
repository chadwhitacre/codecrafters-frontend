import type Store from '@ember-data/store';
import type RouterService from '@ember/routing/router-service';
import { inject as service } from '@ember/service';
import type ContestModel from 'codecrafters-frontend/models/contest';
import type LeaderboardEntryModel from 'codecrafters-frontend/models/leaderboard-entry';
import BaseRoute from 'codecrafters-frontend/utils/base-route';

export type ModelType = {
  contest: ContestModel;
  allContests: ContestModel[];
  topLeaderboardEntries: LeaderboardEntryModel[];
  surroundingLeaderboardEntries: LeaderboardEntryModel[];
};

export default class ContestRoute extends BaseRoute {
  allowsAnonymousAccess = true;

  @service declare router: RouterService;
  @service declare store: Store;

  async model(params: { contest_slug: string }) {
    const allContests = (await this.store.query('contest', { include: 'leaderboard' })) as unknown as ContestModel[];

    // TODO: Handle case where contest is not found
    const contest = allContests.find((contest) => contest.slug === params.contest_slug) as ContestModel;

    const topLeaderboardEntries = (await this.store.query('leaderboard-entry', {
      leaderboard_id: contest.leaderboard.id,
      include: 'user,leaderboard',
    })) as unknown as LeaderboardEntryModel[];

    let surroundingLeaderboardEntries: LeaderboardEntryModel[] = [];

    if (this.authenticator.isAuthenticated) {
      surroundingLeaderboardEntries = (await this.store.query('leaderboard-entry', {
        leaderboard_id: contest.leaderboard.id,
        include: 'leaderboard,user',
        filter_type: 'around_me',
      })) as unknown as LeaderboardEntryModel[];
    }

    return {
      contest,
      allContests,
      topLeaderboardEntries,
      surroundingLeaderboardEntries,
    } as ModelType;
  }
}