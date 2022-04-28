import { IntegrationConfig } from './config';
import { AcmeAccount } from './types';

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

/**
 * An APIClient maintains authentication state and provides an interface to
 * third party data APIs.
 *
 * It is recommended that integrations wrap provider data APIs to provide a
 * place to handle error responses and implement common patterns for iterating
 * resources.
 */
export class APIClient {
  constructor(readonly config: IntegrationConfig) {}

  /**
   * getAccount fetches the account details from the provider API.
   * @returns {Promise<AcmeAccount>} A promise for the AcmeAccount
   */
  public async getAccount(): Promise<AcmeAccount> {
    // This is where an authenticated request to the provider API would be made
    // We return a promise that resolves to mock data
    // to simulate an API response
    return new Promise<AcmeAccount>((resolve) => {
      resolve({
        id: 'account-id',
        name: 'Account Name',
      });
    });
  }
}

export function createAPIClient(config: IntegrationConfig): APIClient {
  return new APIClient(config);
}
