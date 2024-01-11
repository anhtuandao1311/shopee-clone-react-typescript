import { Link } from 'react-router-dom'
import ProductRating from '~/components/ProductRating'
import { Product } from '~/types/product.type'
import { formatCurrency, formatNumberToSocialStyle } from '~/utils/utils'

interface Props {
  product: Product
}

export default function Product({ product }: Props) {
  return (
    <Link to='/product/1'>
      <div className='bg-white shadow-sm rounded-sm hover:translate-y-[-0.2rem] hover:shadow-md duration-100 transition-transform overflow-hidden'>
        <div className='w-full pt-[100%] relative'>
          <img
            src={product.images[0]}
            alt={product.name}
            className='absolute top-0 left-0 w-full h-full object-cover'
          />
        </div>
        <div className='p-2'>
          <div className='min-h-[2.5rem] line-clamp-2 text-sm'>{product.name}</div>
          <div className='flex items-center mt-3'>
            <div className='line-through max-w[50%] text-gray-500 text-sm'>
              đ{formatCurrency(product.price_before_discount)}
            </div>
            <div className='text-orange ml-1'>
              <span className='text-xs'>đ</span>
              <span className='text-base'>{formatCurrency(product.price)}</span>
            </div>
          </div>
          <div className='mt-3 flex items-center justify-start'>
            <ProductRating rating={product.rating} />
            <div className='ml-2 text-sm'>
              <span>{formatNumberToSocialStyle(product.sold)}</span>
              <span className='ml-1'>Đã bán</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
