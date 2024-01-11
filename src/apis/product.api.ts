import { SuccessResponse } from './../types/utils.type'
import { Product, ProductList, ProductListConfig } from '~/types/product.type'
import http from '~/utils/http'

const productApi = {
  getProducts: async (params: ProductListConfig) => http.get<SuccessResponse<ProductList>>('/products', { params }),
  getProductDetail: async (id: string) => http.get<SuccessResponse<Product>>(`/products/${id}`)
}

export default productApi
