import { AuthResponse } from '~/types/auth.type'
import http from '~/utils/http'

const authApi = {
  registerAccount: async (body: { email: string; password: string }) => http.post<AuthResponse>('/register', body),
  loginAccount: async (body: { email: string; password: string }) => http.post<AuthResponse>('/login', body),
  logoutAccount: async () => http.post('/logout')
}

export default authApi
