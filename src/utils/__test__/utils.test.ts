import { describe, it, expect } from 'vitest'
import { isAxiosUnprocessableEntityError } from '../utils'
import { AxiosError } from 'axios'
import { HttpStatusCode } from '~/constants/httpStatusCode.enum'

describe('isAxiosUnprocessableEntityError', () => {
  it('isAxiosUnprocessableEntityError returns boolean', () => {
    expect(isAxiosUnprocessableEntityError(new Error())).toBe(false)

    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.InternalServerError
        } as any)
      )
    ).toBe(false)

    expect(
      isAxiosUnprocessableEntityError(
        new AxiosError(undefined, undefined, undefined, undefined, {
          status: HttpStatusCode.UnprocessableEntity
        } as any)
      )
    ).toBe(true)
  })
})
