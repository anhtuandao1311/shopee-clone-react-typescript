import { Purchase, PurchaseListStatus } from '~/types/purchase.type'
import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'

const purchaseApi = {
  addToCart: (body: { product_id: string; buy_count: number }) =>
    http.post<SuccessResponse<Purchase>>('/purchases/add-to-cart', body),

  getPurchases: (params: { status: PurchaseListStatus }) =>
    http.get<SuccessResponse<Purchase[]>>('/purchases', { params }),

  buyProducts: (body: { product_id: string; buy_count: number }) =>
    http.post<SuccessResponse<Purchase[]>>('/purchases/buy-products', body),

  updatePurchase: (body: { product_id: string; buy_count: number }) =>
    http.put<SuccessResponse<Purchase>>('/purchases/update-purchase', body),

  deletePurchase: (purchaseIds: string[]) =>
    http.delete<SuccessResponse<{ deleted_count: number }>>('/purchases', {
      data: purchaseIds
    })
}

export default purchaseApi
