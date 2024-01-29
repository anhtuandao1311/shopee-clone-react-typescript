import { useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { Link, createSearchParams } from 'react-router-dom'
import purchaseApi from '~/apis/purchase.api'
import path from '~/constants/paths'
import { purchaseStatus } from '~/constants/purchase'
import useQueryParams from '~/hooks/useQueryParams'
import { PurchaseListStatus } from '~/types/purchase.type'
import { formatCurrency, generateNameId } from '~/utils/utils'

const purchaseTabs = [
  { status: purchaseStatus.all, name: 'Tất cả' },
  { status: purchaseStatus.waitForConfirmation, name: 'Chờ xác nhận' },
  { status: purchaseStatus.waitForGetting, name: 'Chờ lấy hàng' },
  { status: purchaseStatus.inProgress, name: 'Đang giao' },
  { status: purchaseStatus.delivered, name: 'Đã giao' },
  { status: purchaseStatus.cancelled, name: 'Đã hủy' }
]

export default function HistoryPurchases() {
  const queryParams: { status?: string } = useQueryParams()
  const status = Number(queryParams.status) || purchaseStatus.all

  const { data: purchasesData } = useQuery({
    queryKey: ['products', status],
    queryFn: () => purchaseApi.getPurchases({ status: status as PurchaseListStatus })
  })

  const purchases = purchasesData?.data.data
  return (
    <div>
      <div className='sticky top-0 flex rounded-t-sm shadow-sm'>
        {purchaseTabs.map((tab) => (
          <Link
            to={{
              pathname: path.historyPurchases,
              search: createSearchParams({
                status: String(tab.status)
              }).toString()
            }}
            className={classNames('flex flex-1 items-center justify-center border-b-2 bg-white py-4 text-center', {
              'border-b-orange text-orange': status === tab.status,
              'border-b-black/10 text-gray-900': status !== tab.status
            })}
          >
            {tab.name}
          </Link>
        ))}
      </div>
      <div>
        {purchases?.map((purchase) => (
          <div key={purchase._id} className='mt-4 rounded-sm border-black/10 bg-white p-6 text-gray-800 shadow-sm'>
            <Link
              to={`${path.home}${generateNameId({ name: purchase.product.name, id: purchase.product._id })}`}
              className='flex'
            >
              <div className='flex-shrink-0'>
                <img className='h-20 w-20 object-cover' src={purchase.product.image} alt={purchase.product.name} />
              </div>
              <div className='ml-3 flex-grow'>
                <div className=' line-clamp-1'>{purchase.product.name}</div>
                <div className='mt-3'>x{purchase.buy_count}</div>
              </div>
              <div className='ml-3 flex-shrink-0'>
                <span className='truncate text-gray-500 line-through'>
                  ₫{formatCurrency(purchase.product.price_before_discount)}
                </span>
                <span className='ml-2 truncate text-orange'>₫{formatCurrency(purchase.product.price)}</span>
              </div>
            </Link>
            <div className='flex justify-end'>
              <div>
                <span>Tổng giá tiền</span>
                <span className='ml-4 text-xl text-orange'>
                  ₫{formatCurrency(purchase.product.price * purchase.buy_count)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
