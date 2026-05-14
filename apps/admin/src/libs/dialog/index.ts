import { useAlertStore, type DialogPayload } from '@/stores/alertStore'

type DialogArg = string | DialogPayload

function normalize(arg: DialogArg): DialogPayload {
  return typeof arg === 'string' ? { title: arg } : arg
}

/**
 * 훅을 쓸 수 없는 컨텍스트(axios 인터셉터, 유틸 함수, store 등)에서
 * 전역 dialog를 호출하기 위한 module-level API.
 *
 * Zustand store에 직접 접근하므로 React 트리 외부에서도 동작.
 * 단, <AlertHost />가 mount된 이후에만 UI가 보임.
 */
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
