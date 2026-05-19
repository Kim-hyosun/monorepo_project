import { useAlertStore, type DialogPayload } from '@/stores/alertStore'

type DialogArg = string | DialogPayload

function normalize(arg: DialogArg): DialogPayload {
  return typeof arg === 'string' ? { title: arg } : arg
}

export const dialog = {
  alert: (arg: DialogArg) =>
    new Promise<void>((resolve) => {
      useAlertStore.getState().open('alert', normalize(arg), () => resolve())
    }),
  confirm: (arg: DialogArg) =>
    new Promise<boolean>((resolve) => {
      useAlertStore.getState().open('confirm', normalize(arg), resolve)
    }),
}
