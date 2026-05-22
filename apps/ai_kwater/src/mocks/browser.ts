import { setupWorker } from 'msw/browser'

import { alarmHandlers } from '@/mocks/handlers/alarms'
import { coagulantsHandlers } from '@/mocks/handlers/coagulants'
import { disinfectionHandlers } from '@/mocks/handlers/disinfection'
import { emsHandlers } from '@/mocks/handlers/ems'
import { filterHandlers } from '@/mocks/handlers/filter'
import { gacHandlers } from '@/mocks/handlers/gac'
import { loginHistoryHandlers } from '@/mocks/handlers/loginHistory'
import { mixingHandlers } from '@/mocks/handlers/mixing'
import { networkHandlers } from '@/mocks/handlers/network'
import { ozoneHandlers } from '@/mocks/handlers/ozone'
import { performanceHandlers } from '@/mocks/handlers/performance'
import { pmsHandlers } from '@/mocks/handlers/pms'
import { rawHandlers } from '@/mocks/handlers/raw'
import { receivingHandlers } from '@/mocks/handlers/receiving'
import { sedimentationHandlers } from '@/mocks/handlers/sedimentation'
import { userHandlers } from '@/mocks/handlers/users'

export const worker = setupWorker(
  ...userHandlers,
  ...loginHistoryHandlers,
  ...alarmHandlers,
  ...networkHandlers,
  ...performanceHandlers,
  ...rawHandlers,
  ...ozoneHandlers,
  ...receivingHandlers,
  ...coagulantsHandlers,
  ...mixingHandlers,
  ...sedimentationHandlers,
  ...filterHandlers,
  ...gacHandlers,
  ...disinfectionHandlers,
  ...pmsHandlers,
  ...emsHandlers,
)
