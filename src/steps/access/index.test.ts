import { executeStepWithDependencies } from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { Recording, setupProjectRecording } from '../../../test/recording';
import { Steps } from '../constants';

// See test/README.md for details
let recording: Recording;
afterEach(async () => {
  await recording.stop();
});

test('fetch-users', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-users',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.USERS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('fetch-groups', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-groups',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.GROUPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});

test('build-user-group-relationships', async () => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'build-user-group-relationships',
  });

  const stepConfig = buildStepTestConfigForStep(Steps.GROUP_USER_RELATIONSHIPS);
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
