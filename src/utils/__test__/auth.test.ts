import { beforeEach, describe, expect, it } from 'vitest'
import {
  clearLocalStorage,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  saveAccessTokenToLocalStorage,
  saveProfileToLocalStorage,
  saveRefreshTokenToLocalStorage
} from '../auth'
import { User } from '~/types/user.type'

const access_token =
  'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWEzODlhYjExNDAwODkzZGY3MzZhZCIsImVtYWlsIjoidHVhbmpvaG5ueUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI0LTAxLTMxVDA4OjEyOjM2LjI4NFoiLCJpYXQiOjE3MDY2ODg3NTYsImV4cCI6MTcwNjY4ODc2Nn0._jPB3MZt-OpYnOUXFl4_UfN03Xa5tKmoTTzTsAcZhz4'

const refresh_token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY1YWEzODlhYjExNDAwODkzZGY3MzZhZCIsImVtYWlsIjoidHVhbmpvaG5ueUBnbWFpbC5jb20iLCJyb2xlcyI6WyJVc2VyIl0sImNyZWF0ZWRfYXQiOiIyMDI0LTAxLTMxVDA4OjEyOjM2LjI4NFoiLCJpYXQiOjE3MDY2ODg3NTYsImV4cCI6MTcwNjY5MjM1Nn0.sgO5c0VGtI3j-xeZ9sPLl91lIW6GyHxMoAPTFD9sMuM'

const profile = {
  _id: '65aa389ab11400893df736ad',
  roles: ['User'],
  email: 'tuanjohnny@gmail.com',
  createdAt: '2024-01-19T08:53:46.420Z',
  updatedAt: '2024-01-28T06:15:08.479Z',
  __v: 0,
  date_of_birth: '2005-11-01T17:00:00.000Z',
  name: 'Anh Tuan Dao',
  phone: '0165465449',
  address: 'HCM'
}

beforeEach(() => {
  localStorage.clear()
})

describe('saveAccessTokenToLocalStorage', () => {
  it('access_token is set to localStorage', () => {
    saveAccessTokenToLocalStorage(access_token)
    expect(localStorage.getItem('access_token')).toBe(access_token)
  })
})

describe('saveRefreshTokenToLocalStorage', () => {
  it('refresh_token is set to localStorage', () => {
    saveRefreshTokenToLocalStorage(refresh_token)
    expect(localStorage.getItem('refresh_token')).toBe(refresh_token)
  })
})

describe('saveProfileToLocalStorage', () => {
  it('profile is set to localStorage', () => {
    saveProfileToLocalStorage(profile as User)
    expect(JSON.parse(localStorage.getItem('profile') as any)).toEqual(profile)
  })
})

describe('getAccessTokenFromLocalStorage', () => {
  it('access_token is get from localStorage', () => {
    saveAccessTokenToLocalStorage(access_token)
    expect(getAccessTokenFromLocalStorage()).toBe(access_token)
  })
})

describe('getRefreshTokenFromLocalStorage', () => {
  it('refresh_token is get from localStorage', () => {
    saveRefreshTokenToLocalStorage(refresh_token)
    expect(getRefreshTokenFromLocalStorage()).toBe(refresh_token)
  })
})

describe('clearLocalStorage', () => {
  it('clearLocalStorage is called', () => {
    saveAccessTokenToLocalStorage(access_token)
    saveRefreshTokenToLocalStorage(refresh_token)
    saveProfileToLocalStorage(profile as User)
    clearLocalStorage()
    expect(localStorage.getItem('access_token')).toBe(null)
    expect(localStorage.getItem('refresh_token')).toBe(null)
    expect(localStorage.getItem('profile')).toBe(null)
  })
})
