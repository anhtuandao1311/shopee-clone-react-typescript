import { RegisterOptions, UseFormGetValues } from 'react-hook-form'
import * as yup from 'yup'

type Rules = {
  [key in 'email' | 'password' | 'confirm_password']?: RegisterOptions
}

// export const getRules = (getValues?: UseFormGetValues<any>): Rules => ({
//   email: {
//     required: {
//       value: true,
//       message: 'Email không được để trống'
//     },
//     pattern: {
//       value: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
//       message: 'Email không hợp lệ'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Email không được vượt quá 160 ký tự'
//     },
//     minLength: {
//       value: 5,
//       message: 'Email phải lớn hơn 5 ký tự'
//     }
//   },
//   password: {
//     required: {
//       value: true,
//       message: 'Mật khẩu không được để trống'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Mật khẩu không được vượt quá 160 ký tự'
//     },
//     minLength: {
//       value: 6,
//       message: 'Mật khẩu phải lớn hơn 6 ký tự'
//     }
//   },
//   confirm_password: {
//     required: {
//       value: true,
//       message: 'Mật khẩu cần được xác nhận'
//     },
//     maxLength: {
//       value: 160,
//       message: 'Mật khẩu không được vượt quá 160 ký tự'
//     },
//     minLength: {
//       value: 6,
//       message: 'Mật khẩu phải lớn hơn 6 ký tự'
//     },
//     validate:
//       typeof getValues === 'function'
//         ? (value) => (value === getValues('password') ? true : 'Mật khẩu nhập lại không khớp')
//         : undefined
//   }
// })

export const schema = yup
  .object({
    email: yup
      .string()
      .email()
      .required('Email không được để trống')
      .min(5, 'Email phải lớn hơn 5 ký tự')
      .max(160, 'Email không được vượt quá 160 ký tự'),
    password: yup
      .string()
      .required('Mật khẩu không được để trống')
      .min(6, 'Mật khẩu phải lớn hơn 6 ký tự')
      .max(160, 'Mật khẩu không được vượt quá 160 ký tự'),
    confirm_password: yup
      .string()
      .required('Mật khẩu cần được xác nhận')
      .min(6, 'Mật khẩu phải lớn hơn 6 ký tự')
      .max(160, 'Mật khẩu không được vượt quá 160 ký tự')
      .oneOf([yup.ref('password')], 'Mật khẩu nhập lại không khớp')
  })
  .required()

export type RegisterSchema = yup.InferType<typeof schema>
