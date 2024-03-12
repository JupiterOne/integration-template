import {
  IntegrationProviderAuthenticationError,
  IntegrationLogger,
} from '@jupiterone/integration-sdk-core';
import { BaseAPIClient } from '@jupiterone/integration-sdk-http-client';

import { IntegrationConfig } from './config';
import { AcmeUser, AcmeGroup } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient extends BaseAPIClient {
  constructor(
    readonly config: IntegrationConfig,
    readonly logger: IntegrationLogger,
  ) {
    super({
      baseUrl: 'https://example.com/api/v1',
      logger,
    });
  }

  protected getAuthorizationHeaders(): Record<string, string> {
    // TODO return the headers necessary to authenticate with the provider
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
    };
  }

  public async verifyAuthentication(): Promise<void> {
    // TODO make the most light-weight request possible to validate
    // authentication works with the provided credentials, throw an err if
    // authentication fails
    const endpoint = '/some/endpoint?limit=1';
    try {
      await this.request(endpoint);
    } catch (err) {
      throw new IntegrationProviderAuthenticationError({
        cause: err,
        endpoint: this.withBaseUrl(endpoint),
        status: err.status,
        statusText: err.statusText,
      });
    }
  }

  /**
   * Iterates each user resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateUsers(
    iteratee: ResourceIteratee<AcmeUser>,
  ): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const iterator = this.paginate<AcmeUser>(
      { endpoint: '/users' },
      'data.users',
      (data) => {
        const { body } = data;
        const nextCursor = body.nextCursor;
        if (!nextCursor) {
          return; // no more pages
        }
        return {
          nextUrl: `/users?cursor=${nextCursor}`,
        };
      },
    );

    for await (const user of iterator) {
      await iteratee(user);
    }
  }

  /**
   * Iterates each group resource in the provider.
   *
   * @param iteratee receives each resource to produce entities/relationships
   */
  public async iterateGroups(
    iteratee: ResourceIteratee<AcmeGroup>,
  ): Promise<void> {
    // TODO paginate an endpoint, invoke the iteratee with each record in the
    // page
    //
    // The provider API will hopefully support pagination. Functions like this
    // should maintain pagination state, and for each page, for each record in
    // the page, invoke the `ResourceIteratee`. This will encourage a pattern
    // where each resource is processed and dropped from memory.

    const iterator = this.paginate<AcmeGroup>(
      { endpoint: '/groups' },
      'data.groups',
      (data) => {
        const { body } = data;
        const nextCursor = body.nextCursor;
        if (!nextCursor) {
          return; // no more pages
        }
        return {
          nextUrl: `/groups?cursor=${nextCursor}`,
        };
      },
    );

    for await (const group of iterator) {
      await iteratee(group);
    }
  }
}

export function createAPIClient(
  config: IntegrationConfig,
  logger: IntegrationLogger,
): APIClient {
  return new APIClient(config, logger);
}
