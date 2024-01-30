import { Link, createSearchParams, useNavigate } from 'react-router-dom'
import Button from '~/components/Button'
import path from '~/constants/paths'
import { Category } from '~/types/category.type'
import classNames from 'classnames'
import InputNumber from '~/components/InputNumber'
import { Controller, useForm } from 'react-hook-form'
import { RegisterSchema, schema } from '~/utils/rules'
import { yupResolver } from '@hookform/resolvers/yup'
import { NoUndefinedField } from '~/types/utils.type'
import omit from 'lodash/omit'
import omitBy from 'lodash/omitBy'
import RatingStars from '../RatingStars'
import { QueryConfig } from '~/hooks/useQueryConfig'
import { useTranslation } from 'react-i18next'

interface Props {
  categories: Category[]
  queryConfig: QueryConfig
}

type FormData = NoUndefinedField<Pick<RegisterSchema, 'price_max' | 'price_min'>>

const priceSchema = schema.pick(['price_min', 'price_max'])

export default function SideFilter({ categories, queryConfig }: Props) {
  const { t } = useTranslation('home')
  const { category } = queryConfig
  const {
    control,
    handleSubmit,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      price_min: '',
      price_max: ''
    },
    resolver: yupResolver(priceSchema) as any,
    shouldFocusError: false
  })

  const navigate = useNavigate()

  const onSubmit = handleSubmit(
    (data) => {
      navigate({
        pathname: path.home,
        search: createSearchParams({
          ...queryConfig,
          ...omitBy(data, (value) => value === '')
        }).toString()
      })
    },
    (errors) => {
      errors
    }
  )

  const handleRemoveFilter = () => {
    navigate({
      pathname: path.home,
      search: createSearchParams(omit(queryConfig, ['price_min', 'price_max', 'rating_filter', 'category'])).toString()
    })
  }

  return (
    <div className='py-4'>
      <Link to={path.home} className='flex items-center font-bold'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6 mr-3'
        >
          <path strokeLinecap='round' strokeLinejoin='round' d='M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5' />
        </svg>
        {t('aside filter.all categories')}
      </Link>
      <div className='bg-gray-300 h-[2px] my-4'></div>
      <ul>
        {categories.map((categoryItem) => {
          const isActive = category === categoryItem._id
          return (
            <li
              className={classNames('py-2 pl-2   flex items-center relative', {
                'text-orange font-semibold': isActive
              })}
            >
              <Link
                to={{
                  pathname: path.home,
                  search: createSearchParams({
                    ...queryConfig,
                    category: categoryItem._id
                  }).toString()
                }}
              >
                {isActive && (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-3 h-3 absolute left-[-10px] top-[10px]'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 4.5l7.5 7.5-7.5 7.5' />
                  </svg>
                )}
                {categoryItem.name}
              </Link>
            </li>
          )
        })}
      </ul>

      <Link to={path.home} className='flex items-center font-bold mt-8'>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          fill='none'
          viewBox='0 0 24 24'
          strokeWidth={1.5}
          stroke='currentColor'
          className='w-6 h-6 mr-3'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            d='M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z'
          />
        </svg>
        {t('aside filter.filter search')}
      </Link>
      <div className='bg-gray-300 h-[2px] my-4'></div>
      <div className='my-5'>
        <div>Khoảng giá</div>
        <form onSubmit={onSubmit}>
          <div className='flex items-start gap-2 mt-3'>
            <Controller
              control={control}
              name='price_min'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    placeholder='TỪ'
                    className='w-1/2'
                    classNameInput='p-1 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm outline-none text-sm'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_max')
                    }}
                    value={field.value}
                    ref={field.ref}
                    classNameError='hidden'
                  />
                )
              }}
            />

            <div className='mt-1'> - </div>
            <Controller
              control={control}
              name='price_max'
              render={({ field }) => {
                return (
                  <InputNumber
                    type='text'
                    placeholder='ĐẾN'
                    className='w-1/2'
                    classNameInput='p-1 w-full border border-gray-300 focus:border-gray-500 rounded-sm focus:shadow-sm outline-none text-sm'
                    onChange={(event) => {
                      field.onChange(event)
                      trigger('price_min')
                    }}
                    value={field.value}
                    ref={field.ref}
                    classNameError='hidden'
                  />
                )
              }}
            />
          </div>
          <div className='mt-2 text-red-600 min-h-[1.5rem] text-sm text-center'>{errors.price_min?.message}</div>
          <Button
            className='w-full text-center py-2 px-1 uppercase bg-orange text-white hover:opacity-90 transition duration-3 flex justify-center items-center gap-4'
            type='submit'
          >
            Áp dụng
          </Button>
        </form>
      </div>
      <div className='bg-gray-300 h-[2px] my-4'></div>

      <div className='my-5'>
        <div>Đánh giá</div>
        <RatingStars queryConfig={queryConfig} />
      </div>

      <div className='bg-gray-300 h-[2px] my-4'></div>
      <Button
        className='w-full text-center py-2 px-1 uppercase bg-orange text-white hover:opacity-90 transition duration-3 flex justify-center items-center gap-4'
        type='button'
        onClick={handleRemoveFilter}
      >
        Xóa tất cả
      </Button>
    </div>
  )
}
