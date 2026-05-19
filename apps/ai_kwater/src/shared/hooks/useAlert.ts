import { useAlertStore, type DialogPayload } from '@/stores/alertStore'

type DialogArg = string | DialogPayload

function normalize(arg: DialogArg): DialogPayload {
  return typeof arg === 'string' ? { title: arg } : arg
}

export function useAlert() {
  const open = useAlertStore((s) => s.open)

  return {
    alert: (arg: DialogArg) =>
      new Promise<void>((resolve) => {
        open('alert', normalize(arg), () => resolve())
      }),
    confirm: (arg: DialogArg) =>
      new Promise<boolean>((resolve) => {
        open('confirm', normalize(arg), resolve)
      }),
  }
}
