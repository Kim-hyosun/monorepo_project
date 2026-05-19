'use client'

import { useState } from 'react'

import { AddUserDialog } from '@/features/users/components/AddUserDialog'
import { DeleteUserDialog } from '@/features/users/components/DeleteUserDialog'
import { ModifyPasswordDialog } from '@/features/users/components/ModifyPasswordDialog'
import { ModifyUserDialog } from '@/features/users/components/ModifyUserDialog'
import { UserTable } from '@/features/users/components/UserTable'
import { useUsersQuery } from '@/features/users/queries/userQueries'
import type { User } from '@/features/users/types/user'

type DialogState =
  | { mode: 'add' }
  | { mode: 'modify'; user: User }
  | { mode: 'password'; user: User }
  | { mode: 'delete'; user: User }
  | null

export default function UserManagementPage() {
  const { data = [], isLoading } = useUsersQuery()
  const [dialog, setDialog] = useState<DialogState>(null)

  const close = () => setDialog(null)

  return (
    <>
      <UserTable
        data={data}
        isLoading={isLoading}
        onAdd={() => setDialog({ mode: 'add' })}
        onModify={(user) => setDialog({ mode: 'modify', user })}
        onResetPassword={(user) => setDialog({ mode: 'password', user })}
        onDelete={(user) => setDialog({ mode: 'delete', user })}
      />

      <AddUserDialog open={dialog?.mode === 'add'} onOpenChange={(o) => !o && close()} />
      <ModifyUserDialog
        open={dialog?.mode === 'modify'}
        user={dialog?.mode === 'modify' ? dialog.user : null}
        onOpenChange={(o) => !o && close()}
      />
      <ModifyPasswordDialog
        open={dialog?.mode === 'password'}
        user={dialog?.mode === 'password' ? dialog.user : null}
        onOpenChange={(o) => !o && close()}
      />
      <DeleteUserDialog
        open={dialog?.mode === 'delete'}
        user={dialog?.mode === 'delete' ? dialog.user : null}
        onOpenChange={(o) => !o && close()}
      />
    </>
  )
}
