import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const Steps = {
  ACCOUNTS: 'fetch-accounts',
  GROUPS: 'fetch-groups',
  USERS: 'fetch-users',
};

export const Entities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'acme_account',
    _class: ['Account'],
  },
  GROUP: {
    resourceName: 'UserGroup',
    _type: 'acme_group',
    _class: ['UserGroup'],
  },
  USER: {
    resourceName: 'User',
    _type: 'acme_user',
    _class: ['User'],
  },
};

export const Relationships = {
  ACCOUNT_HAS_USER: {
    _type: 'acme_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_GROUP: {
    _type: 'acme_account_has_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.GROUP._type,
  },
  GROUP_HAS_USER: {
    _type: 'acme_group_has_user',
    sourceType: Entities.GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
