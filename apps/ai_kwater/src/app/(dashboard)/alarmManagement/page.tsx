'use client'

import { useState } from 'react'

import { AlarmTable } from '@/features/alarms/components/AlarmTable'
import { ModifyAlarmDialog } from '@/features/alarms/components/ModifyAlarmDialog'
import type { AlarmInfo } from '@/features/alarms/types/alarm'

export default function Page() {
  const [target, setTarget] = useState<AlarmInfo | null>(null)

  return (
    <>
      <AlarmTable onModify={setTarget} />
      <ModifyAlarmDialog
        open={target !== null}
        alarm={target}
        onOpenChange={(o) => !o && setTarget(null)}
      />
    </>
  )
}
