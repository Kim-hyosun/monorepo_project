import { create } from 'zustand'

export type DialogMode = 'alert' | 'confirm'

export interface DialogPayload {
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
}

interface DialogState extends DialogPayload {
  isOpen: boolean
  mode: DialogMode
  resolve: ((value: boolean) => void) | null
  open: (mode: DialogMode, payload: DialogPayload, resolve: (value: boolean) => void) => void
  close: (value: boolean) => void
}

export const useAlertStore = create<DialogState>((set, get) => ({
  isOpen: false,
  mode: 'alert',
  title: '',
  description: undefined,
  confirmLabel: undefined,
  cancelLabel: undefined,
  resolve: null,
  open: (mode, payload, resolve) =>
    set({
      isOpen: true,
      mode,
      title: payload.title,
      description: payload.description,
      confirmLabel: payload.confirmLabel,
      cancelLabel: payload.cancelLabel,
      resolve,
    }),
  close: (value) => {
    const resolve = get().resolve
    set({ isOpen: false, resolve: null })
    resolve?.(value)
  },
}))
