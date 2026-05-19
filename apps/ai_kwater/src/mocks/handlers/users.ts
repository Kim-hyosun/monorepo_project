import { http, HttpResponse } from 'msw'

import { seedUsers } from '@/mocks/data/users'
import type { CreateUserPayload, UpdateUserPayload, User } from '@/features/users/types/user'

let users: User[] = [...seedUsers]
const passwords = new Map<string, string>()

export const userHandlers = [
  http.get('*/users', () => {
    return HttpResponse.json({ login: users })
  }),

  http.post('*/users', async ({ request }) => {
    const payload = (await request.json()) as CreateUserPayload
    if (users.some((u) => u.userid === payload.userid)) {
      return new HttpResponse(null, { status: 409 })
    }
    users = [
      ...users,
      {
        userid: payload.userid,
        name: payload.name,
        partname: payload.partname,
        authority: payload.authority,
      },
    ]
    passwords.set(payload.userid, payload.password)
    return new HttpResponse(null, { status: 201 })
  }),

  http.put('*/users/pw/:userid', async ({ params, request }) => {
    const { userid } = params as { userid: string }
    const { password } = (await request.json()) as { password: string }
    if (!users.some((u) => u.userid === userid)) {
      return new HttpResponse(null, { status: 404 })
    }
    passwords.set(userid, password)
    return new HttpResponse(null, { status: 204 })
  }),

  http.put('*/users/:userid', async ({ params, request }) => {
    const { userid } = params as { userid: string }
    const patch = (await request.json()) as UpdateUserPayload
    const idx = users.findIndex((u) => u.userid === userid)
    if (idx === -1) return new HttpResponse(null, { status: 404 })
    users[idx] = { ...users[idx], ...patch }
    return new HttpResponse(null, { status: 204 })
  }),

  http.delete('*/users/:userid', ({ params }) => {
    const { userid } = params as { userid: string }
    const before = users.length
    users = users.filter((u) => u.userid !== userid)
    if (users.length === before) return new HttpResponse(null, { status: 404 })
    passwords.delete(userid)
    return new HttpResponse(null, { status: 204 })
  }),
]
