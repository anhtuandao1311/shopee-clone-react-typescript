// it la alias cua test
import { describe, test, expect } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from './App'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import * as matchers from '@testing-library/jest-dom/matchers'
import path from './constants/paths'

expect.extend(matchers)

describe('App', () => {
  test('App render va chuyen trang', async () => {
    render(<App />, {
      wrapper: BrowserRouter
    })
    const user = userEvent.setup()

    // verify vao trang chu
    // waitFor se run callback cho den khi nao co ket qua tra ve, phu thuoc vao timeout va interval, neu nhu callback tra ve true thi se dung lai ngay lap tuc, ko can doi het timeout
    await waitFor(() => {
      expect(document.querySelector('title')?.textContent).toBe('Trang chủ')
    })

    // verify chuyen sang trang dang nhap
    await user.click(screen.getByText('Đăng Nhập'))
    await waitFor(() => {
      expect(screen.queryByText('Bạn chưa có tài khoản?')).toBeTruthy()
      expect(document.querySelector('title')?.textContent).toBe('Đăng nhập')
    })

    // screen.debug(document.body.parentElement as HTMLElement, 99999999)
  })

  test('Ve trang not found', async () => {
    const badRoute = '/not/found'
    render(
      <MemoryRouter initialEntries={[badRoute]}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Page Not Found')).toBeTruthy()
    })

    // screen.debug(document.body.parentElement as HTMLElement, 99999999)
  })

  test('Render trang register', async () => {
    render(
      <MemoryRouter initialEntries={[path.register]}>
        <App />
      </MemoryRouter>
    )

    await waitFor(() => {
      expect(screen.getByText('Bạn đã có tài khoản?')).toBeTruthy()
    })

    // screen.debug(document.body.parentElement as HTMLElement, 99999999)
  })
})
