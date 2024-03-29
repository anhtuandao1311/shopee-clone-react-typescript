import { useContext } from 'react'
import Popover from '../Popover'
import { AppContext } from '~/contexts/app.context'
import { Link } from 'react-router-dom'
import path from '~/constants/paths'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import authApi from '~/apis/auth.api'
import { purchaseStatus } from '~/constants/purchase'
import { getAvatarUrl } from '~/utils/utils'
import { useTranslation } from 'react-i18next'
import { locales } from '~/i18n/i18n'

export default function NavHeader() {
  const { i18n } = useTranslation()
  const currentLanguage = locales[i18n.language as keyof typeof locales]
  const { isAuthenticated, setIsAuthenticated, profile, setProfile } = useContext(AppContext)

  const queryClient = useQueryClient()

  const logoutMutation = useMutation({
    mutationFn: authApi.logoutAccount,
    onSuccess: () => {
      setIsAuthenticated(false)
      setProfile(null)
      queryClient.removeQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
    }
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language)
  }

  return (
    <div className='flex justify-end'>
      <Popover
        className='flex items-center py-1 text-white hover:text-gray-300 cursor-pointer'
        renderPopover={
          <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
            <div className='flex flex-col py-2 pl-3 pr-28'>
              <button className='text-left py-2 px-3 hover:text-orange' onClick={() => changeLanguage('vi')}>
                Tiếng Việt
              </button>
              <button className='text-left py-2 px-3 hover:text-orange' onClick={() => changeLanguage('en')}>
                English
              </button>
            </div>
          </div>
        }
      >
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177-.529A2.25 2.25 0 0017.128 15H16.5l-.324-.324a1.453 1.453 0 00-2.328.377l-.036.073a1.586 1.586 0 01-.982.816l-.99.282c-.55.157-.894.702-.8 1.267l.073.438c.08.474.49.821.97.821.846 0 1.598.542 1.865 1.345l.215.643m5.276-3.67a9.012 9.012 0 01-5.276 3.67m0 0a9 9 0 01-10.275-4.835M15.75 9c0 .896-.393 1.7-1.016 2.25'
          />
        </svg>
        <div className='mx-1'>{currentLanguage}</div>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 8.25l-7.5 7.5-7.5-7.5' />
        </svg>
      </Popover>

      {isAuthenticated && (
        <Popover
          className='flex items-center py-1 text-white hover:text-gray-300 cursor-pointer ml-5'
          renderPopover={
            <div className='bg-white relative shadow-md rounded-sm border border-gray-200'>
              <Link
                to={path.profile}
                className='block py-2 px-3 hover:bg-slate-100 bg-white hover:text-cyan-500 text-left'
              >
                Tài khoản của tôi
              </Link>
              <Link
                to={path.historyPurchases}
                className='block py-2 px-3 hover:bg-slate-100 bg-white hover:text-cyan-500 text-left'
              >
                Đơn mua
              </Link>
              <button
                className='w-full block py-2 px-3 hover:bg-slate-100 bg-white hover:text-cyan-500 text-left'
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          }
        >
          <div className='w-6 h-6 mr-2'>
            <img
              src={getAvatarUrl(profile?.avatar)}
              alt='avatar'
              className='w-full h-full rounded-full object-cover'
            ></img>
          </div>
          <div>{profile?.email}</div>
        </Popover>
      )}

      {!isAuthenticated && (
        <div className='flex items-center'>
          <Link to={path.login} className='text-white hover:text-gray-300 ml-5'>
            Đăng Nhập
          </Link>
          <Link to={path.register} className='text-white hover:text-gray-300 ml-5'>
            Đăng Ký
          </Link>
        </div>
      )}
    </div>
  )
}
