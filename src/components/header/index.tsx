import { SignInButton, UserButton, useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const Header = () => {
  const { isSignedIn } = useUser()
  const router = useRouter()

  const handleClickLogo = () => {
    router.push('/projects')
  }

  return (
    <header className='fixed w-full top-0 bg-white border-b border-gray-300 z-50'>
      <div className='mx-auto flex pt-3 pb-3 px-10'>
        {/* 左侧 Logo 区域 */}
        <div
          className='flex items-center hover:cursor-pointer'
          onClick={handleClickLogo}
        >
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
          {isSignedIn ? <UserButton /> : <SignInButton />}
        </div>
      </div>
    </header>
  )
}

export default Header
