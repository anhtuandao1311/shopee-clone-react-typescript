import { Link } from 'react-router-dom'
import path from '~/constants/paths'

export default function SideFilter() {
  return (
    <div className='py-4'>
      <Link to={path.home} className='flex items-center font-bold'>
        <svg enableBackground='new 0 0 15 15' viewBox='0 0 15 15' x={0} y={0} className='w-3 h-4 mr-3 fill-current'>
          <g>
            <polyline
              fill='none'
              points='5.5 13.2 5.5 5.8 1.5 1.2 13.5 1.2 9.5 5.8 9.5 10.2'
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeMiterlimit={10}
            />
          </g>
        </svg>
      </Link>
      <div className='bg-gray-300 h[1px] my-4'></div>
      <ul>
        <li className='py-2 pl-2'>
          <Link to={path.home}></Link>
        </li>
      </ul>
    </div>
  )
}
