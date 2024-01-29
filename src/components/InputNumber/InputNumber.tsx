import { InputHTMLAttributes, forwardRef, useState } from 'react'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumberInner(
  {
    errorMessage,
    className,
    classNameInput = 'p-3 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm outline-none',
    classNameError = 'mt-2 text-red-600 min-h-[1.5rem] text-sm',
    onChange,
    value = '',
    ...rest
  },
  ref
) {
  const [localValue, setLocalValue] = useState<string>(value as string)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    if (/^\d+$/.test(value) || value === '') {
      // execute onChange callback truyen tu ben ngoai vao
      onChange && onChange(event)

      // cap nhat localValue
      setLocalValue(value)
    }
  }
  return (
    <div className={className}>
      <input
        className={classNameInput}
        {...rest}
        onChange={(event) => handleChange(event)}
        ref={ref}
        value={value || localValue}
      />
      <div className={classNameError}>{errorMessage}</div>
    </div>
  )
})

export default InputNumber
