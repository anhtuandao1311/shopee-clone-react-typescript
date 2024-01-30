import { ProductListConfig } from '~/types/product.type'
import useQueryParams from './useQueryParams'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'

export type QueryConfig = {
  [key in keyof ProductListConfig]: string
}
export default function useQueryConfig() {
  const queryParams = useQueryParams()
  const queryConfig: QueryConfig = omitBy(
    {
      page: queryParams.page || '1',
      limit: queryParams.limit,
      sort_by: queryParams.sort_by,
      exclude: queryParams.exclude,
      order: queryParams.order,
      name: queryParams.name,
      price_max: queryParams.price_max,
      price_min: queryParams.price_min,
      rating_filter: queryParams.rating_filter,
      category: queryParams.category
    },
    isUndefined
  )
  return queryConfig
}
