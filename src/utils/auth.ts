import { User } from '~/types/user.type'

export const LocalStorageEventTarget = new EventTarget()

export const saveAccessTokenToLocalStorage = (token: string) => {
  localStorage.setItem('access_token', token)
}

export const saveRefreshTokenToLocalStorage = (token: string) => {
  localStorage.setItem('refresh_token', token)
}

export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  localStorage.removeItem('profile')
  LocalStorageEventTarget.dispatchEvent(new Event('clearLocalStorage'))
}

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('access_token') || ''
}

export const getRefreshTokenFromLocalStorage = () => {
  return localStorage.getItem('refresh_token') || ''
}

export const saveProfileToLocalStorage = (profile: User) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}

export const getProfileFromLocalStorage = () => {
  const res = localStorage.getItem('profile')
  if (res) {
    return JSON.parse(res)
  }
  return null
}
