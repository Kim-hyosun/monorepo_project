import type { NetworkConfig } from '@/features/network/types/network'

export const seedNetworkConfig: NetworkConfig = {
  scada1_address: '10.0.10.1',
  scada1_port: '5020',
  scada2_address: '10.0.10.2',
  scada2_port: '5020',
  analysis1_address: '10.0.20.10',
  analysis1_rm: '8080',
  analysis1_nm: '8081',
  analysis1_nn: '8082',
  analysis2_address: '10.0.20.11',
  analysis2_rm: '8080',
  analysis2_nm: '8081',
  analysis2_nn: '8082',
}
