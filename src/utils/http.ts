import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { HttpStatusCode } from '~/constants/httpStatusCode.enum'
import { AuthResponse, RefreshTokenResponse } from '~/types/auth.type'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveProfileToLocalStorage,
  saveRefreshTokenToLocalStorage
} from './auth'
import config from '~/constants/config'
import { URL_LOGIN, URL_LOGOUT, URL_REFRESH_TOKEN, URL_REGISTER } from '~/apis/auth.api'
import { isAxiosExpiredTokenError, isAxiosUnauthorizedError } from './utils'
import { ErrorResponse } from '~/types/utils.type'

class Http {
  instance: AxiosInstance

  // nen khai bao access token o day de luu tren ram
  private accessToken: string
  private refreshToken: string
  private refreshTokenRequest: Promise<string> | null
  constructor() {
    this.accessToken = getAccessTokenFromLocalStorage()
    this.refreshToken = getRefreshTokenFromLocalStorage()
    this.refreshTokenRequest = null
    this.instance = axios.create({
      baseURL: config.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'expire-access-token': 10, //10s
        'expire-refresh-token': 60 * 60 //1h
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
        if (url === URL_LOGIN || url === URL_REGISTER) {
          // xu li access va refresh token
          this.accessToken = (response.data as AuthResponse).data.access_token
          this.refreshToken = (response.data as AuthResponse).data.refresh_token
          saveAccessTokenToLocalStorage(this.accessToken)
          saveRefreshTokenToLocalStorage(this.refreshToken)
          saveProfileToLocalStorage((response.data as AuthResponse).data.user)
        } else if (url === URL_LOGOUT) {
          this.accessToken = ''
          this.refreshToken = ''
          clearLocalStorage()
        }
        return response
      },
      (error: AxiosError) => {
        // chi toast loi ko phai 422 va 401
        if (
          error.response?.status !== HttpStatusCode.UnprocessableEntity &&
          error.response?.status !== HttpStatusCode.Unauthorized
        ) {
          const data: any | undefined = error.response?.data
          // data?.message co dau ? do khi upload anh qua lon thi loi tra ve ko co message
          const message = data?.message || error.message
          toast.error(message, {
            autoClose: 1000
          })
        }

        // 401 Unauthorized co nhieu truong hop
        // - token ko dung
        // - token het han
        // - ko truyen token
        if (isAxiosUnauthorizedError<ErrorResponse<{ name: string; message: string }>>(error)) {
          const config = error.response?.config || ({ headers: {} } as InternalAxiosRequestConfig)
          const { url } = config
          // truong hop token het han va do la access token het han
          if (isAxiosExpiredTokenError(error) && url !== URL_REFRESH_TOKEN) {
            this.refreshTokenRequest = this.refreshTokenRequest
              ? this.refreshTokenRequest
              : this.handleRefreshToken().finally(() => {
                  // khi refresh token xong thi set lai null de lan sau goi request thi no se goi lai refresh token
                  // nen giu refreshTokenRequest khoang 10s cho nhung request tiep theo neu bi 401 thi ko can goi api refresh token nua
                  setTimeout(() => {
                    this.refreshTokenRequest = null
                  }, 10000)
                })
            return this.refreshTokenRequest.then((accessToken) => {
              if (config.headers) config.headers.Authorization = accessToken

              // tiep tuc goi lai request cu vua bi loi
              return this.instance({ ...config, headers: { ...config.headers, Authorization: accessToken } })
            })
          }

          // truong hop token ko dung, ko truyen token, token het han va do la refresh token
          clearLocalStorage()
          this.accessToken = ''
          this.refreshToken = ''
          toast.error(error.response?.data.data?.message || error.response?.data.message)
          // window.location.reload()
        }
        return Promise.reject(error)
      }
    )
  }

  private handleRefreshToken() {
    return this.instance
      .post<RefreshTokenResponse>(URL_REFRESH_TOKEN, { refresh_token: this.refreshToken })
      .then((response) => {
        const { access_token } = response.data.data
        saveAccessTokenToLocalStorage(access_token)
        this.accessToken = access_token
        return access_token
      })
      .catch((error) => {
        clearLocalStorage()
        this.accessToken = ''
        this.refreshToken = ''
        throw error
      })
  }
}

const http = new Http().instance
export default http
