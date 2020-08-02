import {
  createDirectRelationship,
  createIntegrationEntity,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  generateRelationshipType,
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

export const accessSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-users',
    name: 'Fetch Users',
    types: [
      'acme_user',
      generateRelationshipType('HAS', 'acme_account', 'acme_user'),
    ],
    dependsOn: ['fetch-account'],
    executionHandler: fetchUsers,
  },
];
