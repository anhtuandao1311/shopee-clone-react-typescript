import { InputHTMLAttributes } from 'react'
import { UseFormRegister } from 'react-hook-form'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  register?: UseFormRegister<any>
  classNameInput?: string
  classNameError?: string
}

export default function Input({
  errorMessage,
  className,
  name,
  register,
  classNameInput = 'p-3 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm outline-none',
  classNameError = 'mt-2 text-red-600 min-h-[1.5rem] text-sm',
  ...rest
}: InputProps) {
  const registerResult = register && name ? register(name) : null
  return (
    <div className={className}>
      <input className={classNameInput} {...registerResult} {...rest} />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
}
