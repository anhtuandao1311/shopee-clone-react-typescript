import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, test, expect, beforeAll } from 'vitest'
import App from '~/App'
import path from '~/constants/paths'

describe('Login', () => {
  let emailInput: HTMLInputElement
  let passwordInput: HTMLInputElement
  let submitButton: HTMLButtonElement
  beforeAll(async () => {
    render(
      <MemoryRouter initialEntries={[path.login]}>
        <App />
      </MemoryRouter>
    )
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Email')).toBeTruthy()
    })
  })
  test('Hien thi loi required khi khong nhap gi', async () => {
    fireEvent.submit(document.querySelector('button[type="submit"]') as Element)

    await waitFor(async () => {
      expect(await screen.queryByText('Email không được để trống')).toBeTruthy()
      expect(await screen.queryByText('Mật khẩu không được để trống')).toBeTruthy()
    })
  })

  test('Hien thi loi khi nhap sai rules duoc quy dinh', async () => {
    emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
    fireEvent.change(emailInput, {
      target: {
        value: 'test@'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123'
      }
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(screen.queryByText('Email không hợp lệ')).toBeTruthy()
      expect(screen.queryByText('Mật khẩu phải lớn hơn 6 ký tự')).toBeTruthy()
    })
  })

  test('Khong hien thi loi khi nhap dung input', async () => {
    const emailInput = document.querySelector('form input[type="email"]') as HTMLInputElement
    const passwordInput = document.querySelector('form input[type="password"]') as HTMLInputElement
    const submitButton = document.querySelector('form button[type="submit"]') as HTMLButtonElement
    fireEvent.change(emailInput, {
      target: {
        value: 'test@gmail.com'
      }
    })
    fireEvent.change(passwordInput, {
      target: {
        value: '123456'
      }
    })

    // khi check tim khong ra thi nen dung query hon la find hoac get
    // khi dung query thi nen cho vao waitFor
    await waitFor(() => {
      expect(screen.queryByText('Email không hợp lệ')).toBeNull()
      expect(screen.queryByText('Mật khẩu phải lớn hơn 6 ký tự')).toBeNull()
    })
    fireEvent.submit(submitButton)

    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang chủ')
    })
  })
})
