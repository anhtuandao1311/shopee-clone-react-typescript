import { HttpResponse, http } from 'msw'
import config from '~/constants/config'
import { HttpStatusCode } from '~/constants/httpStatusCode.enum'

const loginRes = {
  message: 'Đăng nhập thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWJkZjY4YjExNDAwODkzZGY3MjdlZCIsImVtYWlsIjoiZDM1NjRAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMi0wMVQxMToxNjo0OC40OTBaIiwiaWF0IjoxNzA2Nzg2MjA4LCJleHAiOjE3MDY4ODYyMDd9.IbCngH4jhYuHDhcSM6Yx--rkn8ASnjUw6j2eHTmPpIc',
    expires: 99999,
    refresh_token:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWJkZjY4YjExNDAwODkzZGY3MjdlZCIsImVtYWlsIjoiZDM1NjRAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMi0wMVQxMToxNjo0OC40OTBaIiwiaWF0IjoxNzA2Nzg2MjA4LCJleHAiOjE3OTMxODYyMDh9.coYPHY8pYzmBWUBqs-ao1nJViJ2QrHhfbgKPBb_q-j8',
    expires_refresh_token: 86400000,
    user: {
      _id: '659bdf68b11400893df727ed',
      roles: ['User'],
      email: 'd3564@gmail.com',
      createdAt: '2024-01-08T11:41:28.690Z',
      updatedAt: '2024-01-28T05:11:04.644Z',
      __v: 0,
      date_of_birth: '2021-04-11T14:16:25.751Z'
    }
  }
}

const refreshTokenResponse = {
  message: 'Refresh Token thành công',
  data: {
    access_token:
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWJkZjY4YjExNDAwODkzZGY3MjdlZCIsImVtYWlsIjoiZDM1NjRAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMi0wMVQxNzo1MToxMy4yOTRaIiwiaWF0IjoxNzA2ODA5ODczLCJleHAiOjE3MDc0MTQ2NzN9.uAnHxR1UZExLBEvrN2K3zi--tSw70gGhgyQglvVEMQQ'
  }
}

const loginRequest = http.post(`${config.baseUrl}login`, () => {
  return HttpResponse.json(loginRes, {
    status: HttpStatusCode.Ok
  })
})

const refreshToken = http.post(`${config.baseUrl}refresh-access-token`, () => {
  return HttpResponse.json(refreshTokenResponse, {
    status: HttpStatusCode.Ok
  })
})

const authRequests = [loginRequest, refreshToken]

export default authRequests
