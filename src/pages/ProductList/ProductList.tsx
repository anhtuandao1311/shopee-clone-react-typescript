import { useQuery } from '@tanstack/react-query'
import Product from './components/Product'
import productApi from '~/apis/product.api'
import Pagination from '~/components/Pagination'
import { ProductListConfig } from '~/types/product.type'
import categoryApi from '~/apis/category.api'
import SideFilter from './components/SideFilter'
import SortProductList from './components/SortProductList'
import useQueryConfig from '~/hooks/useQueryConfig'
import { Helmet } from 'react-helmet-async'

export default function ProductList() {
  const queryConfig = useQueryConfig()
  const { data: productData } = useQuery({
    queryKey: ['products', queryConfig],
    queryFn: () => productApi.getProducts(queryConfig as ProductListConfig),
    staleTime: 3 * 60 * 1000
  })

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryApi.getCategories()
  })

  return (
    <div className='bg-gray-200 py-6'>
      <Helmet>
        <title>Trang chủ</title>
        <meta name='description' content='Trang chủ dự án Shoppe Clone' />
      </Helmet>
      <div className='container'>
        {productData && (
          <div className='grid grid-cols-12 gap-6'>
            <div className='col-span-3'>
              <SideFilter categories={categoriesData?.data.data || []} queryConfig={queryConfig} />
            </div>
            <div className='col-span-9'>
              <SortProductList queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
              <div className='mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3'>
                {productData.data.data.products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>
              <Pagination queryConfig={queryConfig} pageSize={productData.data.data.pagination.page_size} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
