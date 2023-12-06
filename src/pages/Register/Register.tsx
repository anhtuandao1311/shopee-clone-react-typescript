import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { RegisterSchema, schema } from '~/utils/rules'
import Input from '~/components/Input'
import { registerAccount } from '~/apis/auth.api'
import { omit } from 'lodash'
import { useMutation } from '@tanstack/react-query'
import { isAxiosUnprocessableEntityError } from '~/utils/utils'
import { ErrorResponse } from '~/types/utils.type'
import { useContext } from 'react'
import { AppContext } from '~/contexts/app.context'
import Button from '~/components/Button'

type FormData = RegisterSchema

export default function Register() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(schema)
  })

  const registerAccountMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => registerAccount(body)
  })

  // onSubmit chỉ chạy khi tất cả các rules đều được thực hiện
  const onSubmit = handleSubmit(
    (data) => {
      const body = omit(data, ['confirm_password'])
      registerAccountMutation.mutate(body, {
        onSuccess: (data) => {
          setIsAuthenticated(true)
          setProfile(data.data.data.user)
          navigate('/')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
            const formError = error.response?.data.data
            if (formError) {
              Object.keys(formError).forEach((key) => {
                const message = formError[key as keyof Omit<FormData, 'confirm_password'>]
                setError(key as keyof Omit<FormData, 'confirm_password'>, {
                  type: 'server',
                  message
                })
              })
            }
          }
        }
      })
    },
    (data) => {
      console.log(data)
    }
  )

  return (
    <div className='bg-orange'>
      <div className='container lg:bg-[url(./assets/register_background.png)] bg-cover'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-10 lg:py-24 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng ký</div>
              <Input
                name='email'
                register={register}
                type='email'
                className='mt-8'
                errorMessage={errors.email?.message}
                placeholder='Email'
              ></Input>

              <Input
                name='password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.password?.message}
                placeholder='Password'
                autoComplete='on'
              ></Input>

              <Input
                name='confirm_password'
                register={register}
                type='password'
                className='mt-2'
                errorMessage={errors.confirm_password?.message}
                placeholder='Nhập lại password'
                autoComplete='on'
              ></Input>

              <Button
                type='submit'
                className='w-full mt-4 text-center py-4 px-2 uppercase bg-orange text-white hover:opacity-90 transition duration-3 flex justify-center items-center gap-4'
                isLoading={registerAccountMutation.isPending}
                disabled={registerAccountMutation.isPending}
              >
                Đăng Nhập
              </Button>

              <div className='flex items-center justify-center mt-8'>
                <span className='text-slate-400'>Bạn đã có tài khoản?</span>
                <Link to='/login' className='ml-1 text-orange'>
                  Đăng nhập
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
