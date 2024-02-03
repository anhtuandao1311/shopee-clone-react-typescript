import { HttpResponse, http } from 'msw'
import config from '~/constants/config'
import { HttpStatusCode } from '~/constants/httpStatusCode.enum'

export const access_token_1s =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWJkZjY4YjExNDAwODkzZGY3MjdlZCIsImVtYWlsIjoiZDM1NjRAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0zMVQwOToyMzoyMC4xMTFaIiwiaWF0IjoxNzA2NjkzMDAwLCJleHAiOjE3MDY2OTMwMDF9.kM8UAOKhWSGsfvwOY6os3V0Mkwd7V3LgxnhdJJIJLEw'

export const refresh_token_1000days =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1OWJkZjY4YjExNDAwODkzZGY3MjdlZCIsImVtYWlsIjoiZDM1NjRAZ21haWwuY29tIiwicm9sZXMiOlsiVXNlciJdLCJjcmVhdGVkX2F0IjoiMjAyNC0wMS0zMVQwOToyMzoyMC4xMTFaIiwiaWF0IjoxNzA2NjkzMDAwLCJleHAiOjE3OTMwOTMwMDB9.rqoT3JAwJQKHohSYDBfwSkZqixN8mSLHkUsH0ImjFRw'

const getUserResponse = {
  message: 'Lấy người dùng thành công',
  data: {
    _id: '659bdf68b11400893df727ed',
    roles: ['User'],
    email: 'd3564@gmail.com',
    createdAt: '2024-01-08T11:41:28.690Z',
    updatedAt: '2024-02-01T15:32:19.202Z',
    date_of_birth: '2021-04-11T14:16:25.751Z'
  }
}

const unauthorizedResponse = {
  message: 'Lỗi',
  data: {
    message: 'Token hết hạn',
    name: 'EXPIRED_TOKEN'
  }
}

const getUserRequest = http.get(`${config.baseUrl}user`, ({ request }) => {
  const accessToken = request.headers.get('Authorization')
  if (accessToken === access_token_1s) {
    return HttpResponse.json(unauthorizedResponse as any, {
      status: HttpStatusCode.Unauthorized
    })
  }
  return HttpResponse.json(getUserResponse, {
    status: HttpStatusCode.Ok
  })
})

const userRequests = [getUserRequest]

export default userRequests
