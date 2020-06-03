import {
  IntegrationStep,
  IntegrationStepExecutionContext,
  createIntegrationEntity,
} from '@jupiterone/integration-sdk-core';

import { IntegrationConfig } from '../types';

const step: IntegrationStep<IntegrationConfig> = {
  id: 'fetch-accounts',
  name: 'Fetch accounts',
  types: ['my_integration_account'],
  async executionHandler({
    jobState,
  }: IntegrationStepExecutionContext<IntegrationConfig>) {
    await jobState.addEntity(
      createIntegrationEntity({
        entityData: {
          source: {
            id: 'integration-account-a',
            name: 'My Account',
          },
          assign: {
            _key: 'account:integration-account-a',
            _type: 'my-integration-account',
            _class: 'Account',
          },
        },
      }),
    );
  },
};

export default step;
