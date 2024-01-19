import { useMutation, useQuery } from '@tanstack/react-query'
import DOMPurify from 'dompurify'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import productApi from '~/apis/product.api'
import ProductRating from '~/components/ProductRating'
import { ProductListConfig } from '~/types/product.type'
import { calculateSaleRate, formatCurrency, formatNumberToSocialStyle, getIdFromNameId } from '~/utils/utils'
import Product from '../ProductList/components/Product'
import QuantityController from '~/components/QuantityController'
import purchaseApi from '~/apis/purchase.api'
import { queryClient } from '~/main'
import { purchaseStatus } from '~/constants/purchase'
import { toast } from 'react-toastify'

export default function ProductDetails() {
  const [buyCount, setBuyCount] = useState(1)
  const { nameId } = useParams()
  const id = getIdFromNameId(nameId as string)
  const { data: productDetailsData } = useQuery({
    queryKey: ['productDetails', id],
    queryFn: () => productApi.getProductDetails(id as string)
  })
  const imageRef = useRef<HTMLImageElement>(null)
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5])
  const [activeImage, setActiveImage] = useState('')
  const product = productDetailsData?.data.data
  console.log(product)
  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  )
  const queryConfig = { category: product?.category._id }
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    enabled: Boolean(product),
    staleTime: 3 * 60 * 1000
  })

  const addToCartMutation = useMutation({
    mutationFn: (body: any) => purchaseApi.addToCart(body)
  })

  useEffect(() => {
    if (product && product.images.length > 0) {
      setActiveImage(product.images[0])
    }
  }, [product])

  const handleActiveImage = (image: string) => {
    setActiveImage(image)
  }

  const handleNextImages = () => {
    if (product && currentIndexImages[1] < product.images.length) {
      setCurrentIndexImages([currentIndexImages[0] + 1, currentIndexImages[1] + 1])
    }
  }

  const handlePreviousImages = () => {
    if (product && currentIndexImages[0] > 0) {
      setCurrentIndexImages([currentIndexImages[0] - 1, currentIndexImages[1] - 1])
    }
  }

  const handleZoom = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    const image = imageRef.current as HTMLImageElement
    const { offsetX, offsetY } = event.nativeEvent
    const { naturalHeight, naturalWidth } = image
    image.style.width = naturalWidth + 'px'
    image.style.height = naturalHeight + 'px'
    image.style.maxWidth = 'unset'
    const top = offsetY * (1 - naturalHeight / rect.height)
    const left = offsetX * (1 - naturalWidth / rect.width)
    image.style.top = top + 'px'
    image.style.left = left + 'px'
  }

  const handleRemoveZoom = () => {
    ;(imageRef.current as HTMLImageElement).removeAttribute('style')
  }

  const handleBuyCount = (value: number) => {
    setBuyCount(value)
  }

  const addToCart = () => {
    addToCartMutation.mutate(
      { product_id: product?._id, buy_count: buyCount },
      {
        onSuccess: (data) => {
          toast.success(data.data.message, { autoClose: 2000 })
          queryClient.invalidateQueries({ queryKey: ['purchases', { status: purchaseStatus.inCart }] })
        }
      }
    )
  }

  if (!product) return null
  return (
    <div className='bg-gray-200 py-6'>
      <div className='container'>
        <div className='bg-white p-4 shadow'>
          <div className='grid grid-cols-12 gap-9'>
            <div className='col-span-5'>
              <div
                className='relative w-full pt-[100%] shadow overflow-hidden cursor-zoom-in'
                onMouseMove={handleZoom}
                onMouseLeave={handleRemoveZoom}
              >
                <img
                  src={activeImage}
                  alt={product.name}
                  className='absolute top-0 left-0 w-full h-full object-cover pointer-events-none'
                  ref={imageRef}
                />
              </div>
              <div className='relative mt-4 grid grid-cols-5 gap-1'>
                <button
                  className='absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/30 text-white'
                  onClick={handlePreviousImages}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='M15.75 19.5 8.25 12l7.5-7.5' />
                  </svg>
                </button>
                {currentImages.map((image, index) => {
                  const isActive = image === activeImage
                  return (
                    <div
                      key={index}
                      className='relative w-full pt-[100%]'
                      onMouseEnter={() => handleActiveImage(image)}
                    >
                      <img
                        src={image}
                        alt={product.name}
                        className='absolute top-0 left-0 w-full h-full object-cover cursor-pointer'
                      />
                      {isActive && <div className='absolute inset-0 border-2 border-orange'></div>}
                    </div>
                  )
                })}
                <button
                  className='absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/30 text-white'
                  onClick={handleNextImages}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-6 h-6'
                  >
                    <path strokeLinecap='round' strokeLinejoin='round' d='m8.25 4.5 7.5 7.5-7.5 7.5' />
                  </svg>
                </button>
              </div>
            </div>
            <div className='col-span-7'>
              <h1 className='text-xl font-medium uppercase'>{product.name}</h1>
              <div className='mt-8 flex items-center'>
                <div className='flex items-center'>
                  <span className='mr-1 border-b border-b-orange text-orange'>{product.rating}</span>
                  <ProductRating
                    rating={product.rating}
                    activeClassname='h-4 w-4 fill-orange text-orange'
                    nonActiveClassname='h-4 w-4 fill-gray-300 text-gray-300'
                  />
                  <div className='mx-4 h-4 w-[2px] bg-gray-300'></div>
                  <div>
                    <span className='border-b border-b-black text-black'>
                      {formatNumberToSocialStyle(product.sold)}
                    </span>
                    <span className='text-gray-400 ml-1'>Đã bán</span>
                  </div>
                </div>
              </div>
              <div className='mt-8 flex items-center bg-gray-50 px-5 py-4'>
                <div className='text-gray-500 line-through'>₫{formatCurrency(product.price_before_discount)}</div>
                <div className='ml-3 text-3xl font-medium text-orange'>₫{formatCurrency(product.price)}</div>
                <div className='bg-orange text-white ml-5 text-xs px-[4px] py-[1px] font-bold rounded-sm'>
                  {calculateSaleRate(product.price_before_discount, product.price)} GIẢM
                </div>
              </div>
              <div className='mt-8 flex items-center'>
                <div className='capitalize text-gray-400'>Số Lượng</div>
                <QuantityController
                  onIncrease={handleBuyCount}
                  onDecrease={handleBuyCount}
                  onType={handleBuyCount}
                  value={buyCount}
                  max={product.quantity}
                />
                <div className='ml-5 text-sm text-gray-400'>{product.quantity} sản phẩm có sẵn</div>
              </div>
              <div className='mt-8 flex items-center'>
                <button
                  className='flex py-4 px-6 bg-orange/10 border-orange text-orange border rounded-sm mr-4 hover:bg-orange/5 '
                  onClick={addToCart}
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    fill='none'
                    viewBox='0 0 24 24'
                    strokeWidth={1.5}
                    stroke='currentColor'
                    className='w-5 h-5 mr-2'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      d='M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z'
                    />
                  </svg>
                  Thêm Vào Giỏ Hàng
                </button>
                <button className='flex py-4 px-6 bg-orange border rounded-sm border-orange text-white hover:opacity-90 '>
                  Mua Ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='container'>
        <div className='mt-8 bg-white p-4 shadow'>
          <div className='rounded bg-gray-50 p-4 text-lg capitalize text-slate-700'>Mô tả sản phẩm</div>
          <div className='py-6 px-4 text-sm leading-loose'>
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product.description) }} />
          </div>
        </div>
      </div>
      <div className='container'>
        <h1 className='uppercase text-slate-600 mt-8'>Có Thể Bạn Cũng Thích</h1>
        <div className='mt-8'>
          <div className='mt-6 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3'>
            {productData &&
              productData.data.data.products.map((product) => <Product key={product._id} product={product} />)}
          </div>
        </div>
      </div>
    </div>
  )
}
