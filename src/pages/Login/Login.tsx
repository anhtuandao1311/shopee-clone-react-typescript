import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import Button from '~/components/Button'
import Input from '~/components/Input'
import { AppContext } from '~/contexts/app.context'
import { ErrorResponse } from '~/types/utils.type'
import { schema, RegisterSchema } from '~/utils/rules'
import { isAxiosUnprocessableEntityError } from '~/utils/utils'
import authApi from '~/apis/auth.api'

type FormData = Pick<RegisterSchema, 'email' | 'password'>

const loginSchema = schema.pick(['email', 'password'])

export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors }
  } = useForm<FormData>({
    resolver: yupResolver(loginSchema)
  })

  const loginAccountMutation = useMutation({
    mutationFn: (body: FormData) => authApi.loginAccount(body)
  })

  const onSubmit = handleSubmit(
    (data) => {
      loginAccountMutation.mutate(data, {
        onSuccess: (data) => {
          setIsAuthenticated(true)
          setProfile(data.data.data.user)
          navigate('/')
        },
        onError: (error) => {
          if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
            const formError = error.response?.data.data
            if (formError) {
              Object.keys(formError).forEach((key) => {
                const message = formError[key as keyof FormData]
                setError(key as keyof FormData, {
                  type: 'server',
                  message
                })
              })
            }
          }
        }
      })
    },
    (errors) => {
      console.log(errors)
    }
  )

  return (
    <div className='bg-orange'>
      <div className='container lg:bg-[url(./assets/register_background.png)] bg-cover'>
        <div className='grid grid-cols-1 lg:grid-cols-5 py-10 lg:py-32 lg:pr-10'>
          <div className='lg:col-span-2 lg:col-start-4'>
            <form className='p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className='text-2xl'>Đăng nhập</div>
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

              <Button
                type='submit'
                className='w-full mt-4 text-center py-4 px-2 uppercase bg-orange text-white hover:opacity-90 transition duration-3 flex justify-center items-center gap-4'
                isLoading={loginAccountMutation.isPending}
                disabled={loginAccountMutation.isPending}
              >
                Đăng Nhập
              </Button>
              <div className='flex items-center justify-center mt-8'>
                <span className='text-slate-400'>Bạn chưa có tài khoản?</span>
                <Link to='/register' className='ml-1 text-orange'>
                  Đăng ký
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
