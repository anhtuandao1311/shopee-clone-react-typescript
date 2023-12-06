import { RegisterOptions, UseFormRegister } from 'react-hook-form'

interface InputProps {
  type: React.HTMLInputTypeAttribute
  errorMessage?: string
  placeholder?: string
  className?: string
  name: string
  register: UseFormRegister<any>
  autoComplete?: string
}

export default function Input({
  type,
  errorMessage,
  placeholder,
  className,
  name,
  register,
  autoComplete
}: InputProps) {
  return (
    <div className={className}>
      <input
        type={type}
        className='p-3 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm'
        placeholder={placeholder}
        {...register(name)}
        autoComplete={autoComplete}
      />
      <div className='mt-2 text-red-600 min-h-[1.5rem] text-sm'>{errorMessage}</div>
    </div>
  )
}
