import { User } from '~/types/user.types'

export const saveAccessTokenToLocalStorage = (token: string) => {
  localStorage.setItem('access_token', token)
}

export const clearLocalStorage = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLocalStorage = () => {
  return localStorage.getItem('access_token') || ''
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
