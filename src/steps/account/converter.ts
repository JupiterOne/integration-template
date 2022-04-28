import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';
import { AcmeAccount } from '../../types';

import { Entities } from '../constants';

export function createAccountEntity(account: AcmeAccount): Entity {
  return createIntegrationEntity({
    entityData: {
      source: account,
      assign: {
        _key: account.id,
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
      },
    },
  });
}
