export interface User {
  userid: string
  name: string
  partname: string
  authority?: number
}

export interface UsersResponse {
  login: User[]
}

export interface CreateUserPayload {
  userid: string
  name: string
  password: string
  partname: string
  authority: number
}

export interface UpdateUserPayload {
  name: string
  partname: string
  authority?: number
}

export interface ResetPasswordPayload {
  password: string
}
