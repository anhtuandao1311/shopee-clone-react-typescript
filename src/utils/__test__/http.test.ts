import { beforeEach, describe, expect, it } from 'vitest'
import { HttpStatusCode } from '~/constants/httpStatusCode.enum'
import { saveAccessTokenToLocalStorage, saveRefreshTokenToLocalStorage } from '../auth'
import { Http } from '../http'
import { access_token_1s, refresh_token_1000days } from '~/msw/user.msw'

describe('http axios', () => {
  let http = new Http().instance
  beforeEach(() => {
    // phai clear localStorage truoc khi khoi tao http moi
    localStorage.clear()
    http = new Http().instance
  })

  it('Call API', async () => {
    const res = await http.get('products')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Auth Request', async () => {
    await http.post('login', {
      email: 'tuanjohnny@gmail.com',
      password: '123456'
    })
    const res = await http.get('user')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })

  it('Refresh Token', async () => {
    saveAccessTokenToLocalStorage(access_token_1s)
    saveRefreshTokenToLocalStorage(refresh_token_1000days)
    // khai bao http moi de co the lay duoc access token moi tu local storage
    http = new Http().instance
    const res = await http.get('user')
    expect(res.status).toBe(HttpStatusCode.Ok)
  })
})
