import axios, { AxiosError, AxiosInstance } from 'axios'
import { toast } from 'react-toastify'
import { HttpStatusCode } from '~/constants/httpStatusCode.enum'
import { AuthResponse } from '~/types/auth.type'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveProfileToLocalStorage
} from './auth'
import path from '~/constants/paths'
import config from '~/constants/config'

class Http {
  instance: AxiosInstance

  // nen khai bao access token o day de luu tren ram
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json'
      }
    })

    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken) {
          config.headers.Authorization = this.accessToken
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === path.login || url === path.register) {
          this.accessToken = (response.data as AuthResponse).data.access_token
          saveAccessTokenToLocalStorage(this.accessToken)
          saveProfileToLocalStorage((response.data as AuthResponse).data.user)
        } else if (url === path.logout) {
          this.accessToken = ''
          clearLocalStorage()
        }
        return response
      },
      (error: AxiosError) => {
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          const data: any | undefined = error.response?.data

          // data?.message do khi upload anh qua lon thi loi tra ve ko co message
          const message = data?.message || error.message
          toast.error(message, {
            autoClose: 1000
          })
        }
        if (error.response?.status === HttpStatusCode.Unauthorized) {
          clearLocalStorage()
          // window.location.reload()
        }
        return Promise.reject(error)
      }
    )
  }
}

const http = new Http().instance
export default http
