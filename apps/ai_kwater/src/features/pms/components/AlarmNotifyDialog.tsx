'use client'

import { Dialog as DialogPrimitive } from '@base-ui/react/dialog'

import {
  Dialog,
  DialogBackdrop,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
} from '@/shared/ui/dialog'
import { Button } from '@/shared/ui/button'
import { useMarkAlertRead } from '@/features/pms/queries/pmsQueries'
import { useProcessDialogStore } from '@/stores/processDialogStore'

const STATUS_TONE: Record<string, string> = {
  경보: 'border-rose-500/50 bg-rose-500/10 text-rose-300',
  주의: 'border-amber-400/50 bg-amber-500/10 text-amber-300',
}

export function AlarmNotifyDialog() {
  const { alarmNotify, closeAlarmNotify } = useProcessDialogStore()
  const { mutate: markRead } = useMarkAlertRead()
  const alert = alarmNotify.alert

  const onConfirm = () => {
    if (alert && alert.read !== true) markRead(alert.num)
    closeAlarmNotify()
  }

  return (
    <Dialog open={alarmNotify.visible} onOpenChange={(open) => !open && onConfirm()}>
      <DialogPortal>
        <DialogBackdrop />
        <DialogPrimitive.Popup
          className='fixed top-1/2 left-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-lg border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-6 text-white shadow-xl backdrop-blur'
          style={{ backgroundImage: 'var(--aio-divider-gradient)' }}
        >
          <DialogHeader>
            <DialogTitle
              className='text-[var(--aio-accent)]'
              style={{ textShadow: 'var(--aio-text-glow)' }}
            >
              경보 / 주의 상세
            </DialogTitle>
            <DialogDescription className='text-[var(--aio-subtitle)]'>
              알람 항목의 상세 정보를 확인합니다.
            </DialogDescription>
          </DialogHeader>

          {alert ? (
            <div className='mt-4 space-y-3'>
              <div
                className={`rounded-md border px-3 py-2 text-sm ${
                  STATUS_TONE[alert.status] ?? 'border-white/10 bg-white/5 text-white'
                }`}
              >
                <div className='flex items-center justify-between'>
                  <span className='font-semibold'>{alert.list}</span>
                  <span className='text-xs'>{alert.status}</span>
                </div>
              </div>

              <dl className='grid grid-cols-[120px_1fr] gap-y-2 text-sm'>
                <dt className='text-[var(--aio-subtitle)]'>번호</dt>
                <dd className='text-white'>#{alert.num}</dd>
                <dt className='text-[var(--aio-subtitle)]'>발생 시각</dt>
                <dd className='text-white'>{alert.time}</dd>
                <dt className='text-[var(--aio-subtitle)]'>상세 정보</dt>
                <dd className='text-white'>{alert.info}</dd>
              </dl>
            </div>
          ) : (
            <div className='mt-4 text-sm text-[var(--aio-subtitle)]'>선택된 알람이 없습니다.</div>
          )}

          <DialogFooter>
            <Button size='sm' variant='secondary' onClick={onConfirm}>
              확인
            </Button>
          </DialogFooter>
        </DialogPrimitive.Popup>
      </DialogPortal>
    </Dialog>
  )
}
