'use client'

import { AlertDialog } from '@base-ui/react/alert-dialog'
import { useAlertStore } from '@/stores/alertStore'
import { Button } from '@/shared/ui/button'

export function AlertHost() {
  const { isOpen, mode, title, description, confirmLabel, cancelLabel, close } = useAlertStore()
  const isConfirm = mode === 'confirm'

  return (
    <AlertDialog.Root open={isOpen} onOpenChange={(open) => !open && close(false)}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className='fixed inset-0 bg-black/40 backdrop-blur-sm' />
        <AlertDialog.Popup className='bg-background fixed top-1/2 left-1/2 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-lg border p-6 shadow-lg'>
          <AlertDialog.Title className='text-lg font-semibold'>{title}</AlertDialog.Title>
          {description && (
            <AlertDialog.Description className='text-muted-foreground mt-2 text-sm whitespace-pre-line'>
              {description}
            </AlertDialog.Description>
          )}
          <div className='mt-6 flex justify-end gap-2'>
            {isConfirm && (
              <Button variant='outline' onClick={() => close(false)}>
                {cancelLabel ?? '취소'}
              </Button>
            )}
            <Button onClick={() => close(true)}>{confirmLabel ?? '확인'}</Button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
