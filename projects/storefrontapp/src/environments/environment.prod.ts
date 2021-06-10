import { Environment } from './models/environment.model';

export const environment: Environment = {
  production: true,
  occBaseUrl: buildProcess.env.CX_BASE_URL ?? 'https://localhost:9002',
  //dummy c1
  occApiPrefix: '/occ/v2/',
  cds: buildProcess.env.CX_CDS,
  b2b: buildProcess.env.CX_B2B,
  cdc: buildProcess.env.CX_CDC,
  cpq: buildProcess.env.CX_CPQ,
  digitalPayments: buildProcess.env.CX_DIGITAL_PAYMENTS ?? true,
};
