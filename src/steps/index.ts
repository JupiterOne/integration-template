import { accountSteps } from './account';
import { accessSteps } from './access';

const integrationSteps = [...accountSteps, ...accessSteps];

export { integrationSteps };
