import {
  ExecutionHandlerFunction,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';
import { createAPIClient } from '../../client';

import { IntegrationConfig } from '../../config';
import { Steps, Entities } from '../constants';
import { createAccountEntity } from './converter';

export const fetchAccountDetails: ExecutionHandlerFunction<
  IntegrationStepExecutionContext<IntegrationConfig>
> = async function (
  context: IntegrationStepExecutionContext<IntegrationConfig>,
) {
  const client = createAPIClient(context.instance.config);
  const account = await client.getAccount();

  await context.jobState.addEntity(createAccountEntity(account));
};

export const accountSteps: IntegrationStep<IntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account Details',
    entities: [Entities.ACCOUNT],
    relationships: [],
    dependsOn: [],
    executionHandler: fetchAccountDetails,
  },
];
