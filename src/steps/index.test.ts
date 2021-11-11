import { buildGroupUserRelationships, fetchGroups, fetchUsers } from './access';
import { fetchAccountDetails } from './account';
import { integrationConfig } from '../../test/config';
import { createDataCollectionTest } from '../../test/recording';

import { Entities } from './constants';

describe('#fetchDetails', () => {
  test('should collect data', async () => {
    await createDataCollectionTest({
      recordingName: 'fetchDetails',
      recordingDirectory: __dirname,
      normalizeEntryFlag: false,
      integrationConfig,
      stepFunctions: [
        fetchAccountDetails,
        fetchUsers,
        fetchGroups,
        buildGroupUserRelationships,
      ],
      entitySchemaMatchers: [
        {
          _type: Entities.ACCOUNT._type,
          matcher: {
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
          },
        },
        {
          _type: Entities.GROUP._type,
          matcher: {
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
          },
        },
        {
          _type: Entities.USER._type,
          matcher: {
            _class: ['User'],
            schema: {
              additionalProperties: false,
              properties: {
                _type: { const: 'acme_user' },
                firstName: { type: 'string' },
                _rawData: {
                  type: 'array',
                  items: { type: 'object' },
                },
              },
              required: ['firstName'],
            },
          },
        },
      ],
    });
  });
});
