import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  IntegrationMissingKeyError,
} from '@jupiterone/integration-sdk-core';

import { createAPIClient } from '../../client';
import { IntegrationConfig } from '../../config';
import { ACCOUNT_ENTITY_KEY } from '../account';
import { Entities, Steps, Relationships } from '../constants';
import {
  createAccountGroupRelationship,
  createAccountUserRelationship,
  createGroupEntity,
  createGroupUserRelationship,
  createUserEntity,
} from './converter';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const apiClient = createAPIClient(instance.config);

  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  await apiClient.iterateUsers(async (user) => {
    const userEntity = createUserEntity(user);
    await jobState.addEntity(userEntity);
    await jobState.addRelationship(
      createAccountUserRelationship(accountEntity, userEntity),
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
    const groupEntity = createGroupEntity(group);
    await jobState.addEntity(groupEntity);
    await jobState.addRelationship(
      createAccountGroupRelationship(accountEntity, groupEntity),
    );

    for (const user of group.users || []) {
      const userEntity = await jobState.findEntity(user.id);

      if (!userEntity) {
        throw new IntegrationMissingKeyError(
          `Expected user with key to exist (key=${user.id})`,
        );
      }

      await jobState.addRelationship(
        createGroupUserRelationship(groupEntity, userEntity),
      );
    }
  });
}

export const accessSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Fetch Users',
    entities: [
      {
        resourceName: Entities.ACCOUNT.resourceName,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
      },
    ],
    relationships: [
      Relationships.ACCOUNT_HAS_USER,
      Relationships.ACCOUNT_HAS_GROUP,
      Relationships.GROUP_HAS_USER,
    ],
    dependsOn: [Steps.ACCOUNTS],
    executionHandler: fetchUsers,
  },
];
