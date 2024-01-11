import { Category } from '~/types/category.type'
import { SuccessResponse } from '~/types/utils.type'
import http from '~/utils/http'

const categoryApi = {
  getCategories() {
    return http.get<SuccessResponse<Category[]>>('categories')
  }
}

export default categoryApi
