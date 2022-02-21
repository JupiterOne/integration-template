import {
  IntegrationProviderAuthenticationError,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';
import {
  createMockExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { IntegrationConfig, validateInvocation } from './config';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  it('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationValidationError,
    );
  });

  /**
   * Testing authorizations can be done with recordings.
   * To capture failed responses, recordFailedRequests is set to true.
   */
  it.skip('auth error', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'client-auth-error',
      // Many authorization failures will return non-200 responses
      // and `recordFailedRequest: true` is needed to capture these responses
      options: {
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext({
      instanceConfig: {
        clientId: 'INVALID',
        clientSecret: 'INVALID',
      },
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      IntegrationProviderAuthenticationError,
    );
  });

  /**
   * Testing a successful authorization can be done with recordings as well
   */
  it.skip('validates invocation', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'validate-invocation',
    });

    // Pass integrationConfig to authenticate with real credentials
    const executionContext = createMockExecutionContext({
      instanceConfig: integrationConfig,
    });

    // successful validateInvocation doesn't throw errors and will be undefined
    await expect(validateInvocation(executionContext)).resolves.toBeUndefined();
  });
});
