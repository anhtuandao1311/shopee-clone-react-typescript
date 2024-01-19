import { AxiosError, isAxiosError } from 'axios'
import { HttpStatusCode } from '~/constants/httpStatusCode.enum'

// export function isAxiosError<T>(error: unknown): error is AxiosError<T> {
//   return axios.isAxiosError(error)
// }

export function isAxiosUnprocessableEntityError<FormError>(error: unknown): error is AxiosError<FormError> {
  return isAxiosError(error) && error.response?.status === HttpStatusCode.UnprocessableEntity
}

export function formatCurrency(price: number) {
  return new Intl.NumberFormat('de-DE').format(price)
}

export function formatNumberToSocialStyle(number: number) {
  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1
  })
    .format(number)
    .replace('.', ',')
}

export function calculateSaleRate(originalPrice: number, salePrice: number) {
  return Math.round(((originalPrice - salePrice) / originalPrice) * 100) + '%'
}

function removeSpecialCharacter(str: string) {
  // eslint-disable-next-line no-useless-escape
  return str.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, '')
}

export function generateNameId({ name, id }: { name: string; id: string }) {
  return removeSpecialCharacter(name).replace(/\s/g, '-') + `-i-${id}`
}

export function getIdFromNameId(nameId: string) {
  const arr = nameId.split('-i-')
  return arr[arr.length - 1]
}
