import { AuthResponse } from '~/types/auth.types'
import http from '~/utils/http'

export const registerAccount = async (body: { email: string; password: string }) =>
  http.post<AuthResponse>('/register', body)

export const loginAccount = async (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body)

export const logoutAccount = async () => http.post('/logout')
