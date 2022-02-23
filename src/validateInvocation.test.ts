import {
  createMockExecutionContext,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { integrationConfig } from '../test/config';
import { setupProjectRecording } from '../test/recording';
import { IntegrationConfig, validateInvocation } from './config';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });

  test('requires valid config', async () => {
    const executionContext = createMockExecutionContext<IntegrationConfig>({
      instanceConfig: {} as IntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrow(
      'Config requires all of {clientId, clientSecret}',
    );
  });

  /**
   * Testing a successful authorization can be done with recordings
   */
  test.skip('successfully validates invocation', async () => {
    recording = setupProjectRecording({
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

  /* Adding `describe` blocks segments the tests into logical sections
   * and makes the output of `yarn test --verbose` provide meaningful
   * to project information to future maintainers.
   */
  describe('fails validating invocation', () => {
    /**
     * Testing failing authorizations can be done with recordings as well.
     * For each possible failure case, a test can be made to ensure that
     * error messaging is expected and clear to end-users
     */
    describe('invalid user credentials', () => {
      test.skip('should throw if clientId is invalid', async () => {
        recording = setupProjectRecording({
          directory: __dirname,
          name: 'client-id-auth-error',
          // Many authorization failures will return non-200 responses
          // and `recordFailedRequest: true` is needed to capture these responses
          options: {
            recordFailedRequests: true,
          },
        });

        const executionContext = createMockExecutionContext({
          instanceConfig: {
            clientId: 'INVALID',
            clientSecret: integrationConfig.clientSecret,
          },
        });

        // tests validate that invalid configurations throw an error
        // with an appropriate and expected message.
        await expect(validateInvocation(executionContext)).rejects.toThrow(
          'Provider authentication failed at https://localhost/api/v1/some/endpoint?limit=1: 401 Unauthorized',
        );
      });

      test.skip('should throw if clientSecret is invalid', async () => {
        recording = setupProjectRecording({
          directory: __dirname,
          name: 'client-secret-auth-error',
          options: {
            recordFailedRequests: true,
          },
        });

        const executionContext = createMockExecutionContext({
          instanceConfig: {
            clientId: integrationConfig.clientSecret,
            clientSecret: 'INVALID',
          },
        });

        await expect(validateInvocation(executionContext)).rejects.toThrow(
          'Provider authentication failed at https://localhost/api/v1/some/endpoint?limit=1: 401 Unauthorized',
        );
      });
    });
  });
});
