import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  generateRelationshipType,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../client';
import { IntegrationConfig } from '../types';
import { ACCOUNT_ENTITY_KEY } from './account';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateUsers(async (user) => {
    const userEntity = createIntegrationEntity({
      entityData: {
        source: user,
        assign: {
          _type: 'acme_user',
          _class: 'User',
          username: 'testusername',
          email: 'test@test.com',
          // This is a custom property that is not a part of the data model class
          // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/User.json
          firstName: 'John',
        },
      },
    });

    await Promise.all([
      jobState.addEntity(userEntity),
      jobState.addRelationship(
        createDirectRelationship({
          _class: 'HAS',
          from: accountEntity,
          to: userEntity,
        }),
      ),
    ]);
  });
}

export async function fetchGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateGroups(async (group) => {
    const groupEntity = createIntegrationEntity({
      entityData: {
        source: group,
        assign: {
          _type: 'acme_group',
          _class: 'UserGroup',
          email: 'testgroup@test.com',
          // This is a custom property that is not a part of the data model class
          // hierarchy. See: https://github.com/JupiterOne/data-model/blob/master/src/schemas/UserGroup.json
          logoLink: 'https://test.com/logo.png',
        },
      },
    });

    await Promise.all([
      jobState.addEntity(groupEntity),
      jobState.addRelationship(
        createDirectRelationship({
          _class: 'HAS',
          from: accountEntity,
          to: groupEntity,
        }),
      ),
    ]);

    for (const user of group.users || []) {
      const userEntity = await jobState.getEntity({
        _type: 'acme_user',
        _key: user.id,
      });
      await jobState.addRelationship(
        createDirectRelationship({
          _class: 'HAS',
          from: groupEntity,
          to: userEntity,
        }),
      );
    }
  });
}

export const accessSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-users',
    name: 'Fetch Users',
    types: [
      'acme_user',
      generateRelationshipType('HAS', 'acme_account', 'acme_user'),
      generateRelationshipType('HAS', 'acme_account', 'acme_group'),
      generateRelationshipType('HAS', 'acme_group', 'acme_user'),
    ],
    dependsOn: ['fetch-account'],
    executionHandler: fetchUsers,
  },
];
