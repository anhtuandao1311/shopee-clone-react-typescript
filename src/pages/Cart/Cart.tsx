import { useQuery } from '@tanstack/react-query'
import purchaseApi from '~/apis/purchase.api'
import { purchaseStatus } from '~/constants/purchase'
import { PurchaseListStatus } from '~/types/purchase.type'

export default function Cart() {
  const { data: purchasesInCartData } = useQuery({
    queryKey: ['purchases', { status: purchaseStatus.inCart }],
    queryFn: () => purchaseApi.getPurchases({ status: purchaseStatus.inCart as PurchaseListStatus })
  })
  return <div className='bg-neutral-100 py-16'></div>
}
