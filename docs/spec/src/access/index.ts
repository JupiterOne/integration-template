import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { IntegrationConfig } from '../../../../src/config';

export const accessSpec: StepSpec<IntegrationConfig>[] = [
  {
    /**
     * ENDPOINT: https://localhost/api/v1/users
     * PATTERN: Fetch Entities
     */
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'acme_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'acme_account_has_user',
        sourceType: 'acme_account',
        _class: RelationshipClass.HAS,
        targetType: 'acme_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: https://localhost/api/v1/groups
     * PATTERN: Fetch Entities
     */
    id: 'fetch-groups',
    name: 'Fetch Groups',
    entities: [
      {
        resourceName: 'UserGroup',
        _type: 'acme_group',
        _class: ['UserGroup'],
      },
    ],
    relationships: [
      {
        _type: 'acme_account_has_group',
        sourceType: 'acme_account',
        _class: RelationshipClass.HAS,
        targetType: 'acme_group',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    /**
     * ENDPOINT: n/a
     * PATTERN: Build Child Relationships
     */
    id: 'build-user-group-relationships',
    name: 'Build Group -> User Relationships',
    entities: [],
    relationships: [
      {
        _type: 'acme_group_has_user',
        sourceType: 'acme_group',
        _class: RelationshipClass.HAS,
        targetType: 'acme_user',
      },
    ],
    dependsOn: ['fetch-groups', 'fetch-users'],
    implemented: true,
  },
];
