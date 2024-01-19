import { InputHTMLAttributes, forwardRef, useState } from 'react'
import { UseControllerProps, useController } from 'react-hook-form'

export interface InputNumberProps extends InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  classNameInput?: string
  classNameError?: string
}

function InputV2(props: UseControllerProps & InputNumberProps) {
  const {
    type,
    onChange,
    className,
    classNameInput = 'p-3 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm outline-none',
    classNameError = 'mt-2 text-red-600 min-h-[1.5rem] text-sm',
    value,
    ...rest
  } = props
  const { field, fieldState } = useController(props)
  const [localValue, setLocalValue] = useState<string>(field.value)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const valueFromInput = event.target.value
    const numberCondition = type === 'number' && (/^\d+$/.test(valueFromInput) || valueFromInput === '')
    if (numberCondition || type !== 'number') {
      // cap nhat localValue
      setLocalValue(valueFromInput)

      // goi field.onChange de cap nhat vao state cua react-hook-form
      field.onChange(event)

      // execute onChange callback truyen tu ben ngoai vao
      onChange && onChange(event)
    }
  }
  return (
    <div className={className}>
      <input
        className={classNameInput}
        {...rest}
        {...field}
        onChange={(event) => handleChange(event)}
        value={value || localValue}
      />
      <div className={classNameError}>{fieldState.error?.message}</div>
    </div>
  )
}

export default InputV2
