import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../types';
import { fetchGroups, fetchUsers } from './access';
import { fetchAccountDetails } from './account';

const DEFAULT_CLIENT_ID = 'dummy-acme-client-id';
const DEFAULT_CLIENT_SECRET = 'dummy-acme-client-secret';

const integrationConfig: IntegrationConfig = {
  clientId: process.env.CLIENT_ID || DEFAULT_CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET || DEFAULT_CLIENT_SECRET,
};

test('should collect data', async () => {
  const context = createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  // Simulates dependency graph execution.
  // See https://github.com/JupiterOne/sdk/issues/262.
  await fetchAccountDetails(context);
  await fetchUsers(context);
  await fetchGroups(context);

  // Review snapshot, failure is a regression
  expect({
    collectedEntities: context.jobState.collectedEntities,
    collectedRelationships: context.jobState.collectedRelationships,
    encounteredTypes: context.jobState.encounteredTypes,
  }).toMatchSnapshot();
});
