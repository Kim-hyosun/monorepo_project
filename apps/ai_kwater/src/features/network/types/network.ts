// 원본: 성남정수장/src/store/aio/modules/network.js + ConfigNetwork.vue v-model 키.

export interface NetworkConfig {
  scada1_address: string
  scada1_port: string
  scada2_address: string
  scada2_port: string
  analysis1_address: string
  analysis1_rm: string
  analysis1_nm: string
  analysis1_nn: string
  analysis2_address: string
  analysis2_rm: string
  analysis2_nm: string
  analysis2_nn: string
}

/** 원본 GET /config 응답: { config: NetworkConfig } */
export interface NetworkConfigResponse {
  config: NetworkConfig
}
