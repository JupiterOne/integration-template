import {
  createMockStepExecutionContext,
  //Recording,
} from '@jupiterone/integration-sdk-testing';

import { IntegrationConfig } from '../config';
import { buildGroupUserRelationships, fetchGroups, fetchUsers } from './access';
import { fetchAccountDetails } from './account';
import { integrationConfig } from '../../test/config';
import { Recording, setupIntegrationRecording } from '../../test/recording';

let recording: Recording;

function isRecordingEnabled() {
  return Boolean(process.env.LOAD_ENV) === true;
}

//import { setupProjectRecording } from '../../test/recording';

/* uncomment when ready. See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});
*/

test('should collect data', async () => {
  /* uncomment when ready
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'steps',
  });
  */

  const context = createMockStepExecutionContext<IntegrationConfig>({
    instanceConfig: integrationConfig,
  });

  recording = setupIntegrationRecording({
    directory: __dirname,
    name: 'should collect data',
    options: {
      mode: isRecordingEnabled() ? 'record' : 'replay',
    },
  });

  // Simulates dependency graph execution.
  // See https://github.com/JupiterOne/sdk/issues/262.
  await fetchAccountDetails(context);
  await fetchUsers(context);
  await fetchGroups(context);
  await buildGroupUserRelationships(context);

  // Review snapshot, failure is a regression
  expect({
    numCollectedEntities: context.jobState.collectedEntities.length,
    numCollectedRelationships: context.jobState.collectedRelationships.length,
    collectedEntities: context.jobState.collectedEntities,
    collectedRelationships: context.jobState.collectedRelationships,
    encounteredTypes: context.jobState.encounteredTypes,
  }).toMatchSnapshot();

  const accounts = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('Account'),
  );
  expect(accounts.length).toBeGreaterThan(0);
  expect(accounts).toMatchGraphObjectSchema({
    _class: ['Account'],
    schema: {
      additionalProperties: false,
      properties: {
        _type: { const: 'acme_account' },
        manager: { type: 'string' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['manager'],
    },
  });

  const users = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('User'),
  );
  expect(users.length).toBeGreaterThan(0);
  expect(users).toMatchGraphObjectSchema({
    _class: ['User'],
    schema: {
      additionalProperties: false,
      properties: {
        _type: { const: 'acme_user' },
        firstName: { type: 'string' },
        active: { type: 'boolean' },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['firstName', 'active'],
    },
  });

  const userGroups = context.jobState.collectedEntities.filter((e) =>
    e._class.includes('UserGroup'),
  );
  expect(userGroups.length).toBeGreaterThan(0);
  expect(userGroups).toMatchGraphObjectSchema({
    _class: ['UserGroup'],
    schema: {
      additionalProperties: false,
      properties: {
        _type: { const: 'acme_group' },
        logoLink: {
          type: 'string',
          // Validate that the `logoLink` property has a URL format
          format: 'url',
        },
        _rawData: {
          type: 'array',
          items: { type: 'object' },
        },
      },
      required: ['logoLink'],
    },
  });

  if (recording) {
    await recording.stop();
  }
});
