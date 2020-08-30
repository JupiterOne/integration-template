import {
  createIntegrationEntity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../types';

export const ACCOUNT_ENTITY_KEY = 'entity:account';

export async function fetchAccountDetails({
  jobState,
}: IntegrationStepExecutionContext<IntegrationConfig>) {
  const accountEntity = await jobState.addEntity(
    createIntegrationEntity({
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
    }),
  );

  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: 'fetch-account',
    name: 'Fetch Account Details',
    entities: [
      {
        resourceName: 'Account',
        _type: 'acme_account',
        _class: 'Account',
      },
    ],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccountDetails,
  },
];
