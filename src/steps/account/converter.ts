import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

const USER_LOGIN_PREFIX = 'salesforce-user';
export function createUserEntityIdentifier(login: string): string {
  return `${USER_LOGIN_PREFIX}:${login}`;
}

export function createAccountEntity(): Entity {
  return createIntegrationEntity({
    entityData: {
      source: {
        id: 'acme-unique-account-id',
        name: 'Example Co. Acme Account',
      },
      assign: {
        _key: 'acme-unique-account-id',
        _type: 'acme_account',
        _class: 'Account',
        mfaEnabled: true,
        // This is a custom property that is not a part of the data model class
        // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/Account.json
        manager: 'Manager Name',
      },
    },
  });
}
