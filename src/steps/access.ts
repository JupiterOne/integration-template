import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
  IntegrationMissingKeyError,
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
    const userEntity = await jobState.addEntity(
      createIntegrationEntity({
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
      }),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userEntity,
      }),
    );
  });
}

export async function fetchGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateGroups(async (group) => {
    const groupEntity = await jobState.addEntity(
      createIntegrationEntity({
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
      }),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: groupEntity,
      }),
    );

    for (const user of group.users || []) {
      const userEntity = await jobState.findEntity(user.id);

      if (!userEntity) {
        throw new IntegrationMissingKeyError(
          `Expected user with key to exist (key=${user.id})`,
        );
      }

      await jobState.addRelationship(
        createDirectRelationship({
          _class: RelationshipClass.HAS,
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
    entities: [
      {
        resourceName: 'Account',
        _type: 'acme_account',
        _class: 'Account',
      },
    ],
    relationships: [
      {
        _type: 'acme_account_has_user',
        _class: RelationshipClass.HAS,
        sourceType: 'acme_account',
        targetType: 'acme_user',
      },
      {
        _type: 'acme_account_has_group',
        _class: RelationshipClass.HAS,
        sourceType: 'acme_account',
        targetType: 'acme_group',
      },
      {
        _type: 'acme_group_has_user',
        _class: RelationshipClass.HAS,
        sourceType: 'acme_group',
        targetType: 'acme_user',
      },
    ],
    dependsOn: ['fetch-account'],
    executionHandler: fetchUsers,
  },
];
