import Logo from './Logo';
import HeaderCTA from './HeaderCTA';

const Header = () => {
  return (
    <div className='flex max-w-7xl justify-between mx-auto'>
      <Logo />
      <HeaderCTA />
    </div >
  )
}

export default Header