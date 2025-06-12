import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'

const Header = () => {
  const { isSignedIn } = useUser()

  return (
    <header className='fixed w-full top-0 bg-white border-b border-gray-300 z-50'>
      <div className='mx-auto flex pt-3 pb-3 px-10'>
        {/* 左侧 Logo 区域 */}
        <div className='flex items-center'>
          <Image
            src='/icons/lightning.svg'
            alt='Maker'
            width={30}
            height={30}
            className='rounded'
          />
          <span className='ml-2 text-[22px] font-bold'>Maker</span>
        </div>

        {/* 右侧功能区域 */}
        <div className='flex items-center ml-auto'>
          {/* <div className='flex items-center text-[15px]'>
            <div className='flex items-center ml-1'>
              <svg
                className='w-3.5 h-3.5 text-gray-600'
                viewBox='0 0 16 16'
                fill='none'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M3.33334 9.33334L8.66668 2.66667L7.33334 8H12.6667L7.33334 14.6667L8.66668 9.33334H3.33334Z'
                  stroke='currentColor'
                  strokeWidth='1.5'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span className='ml-0.5'>1700</span>
            </div>
          </div> */}
          {isSignedIn ? <UserButton /> : <SignInButton />}
        </div>
      </div>
    </header>
  )
}

export default Header
