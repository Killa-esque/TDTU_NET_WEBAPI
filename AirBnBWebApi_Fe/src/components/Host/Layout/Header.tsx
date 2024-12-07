import Logo from '@/components/User/Logo/Logo'
import Container from '@/components/Wrapper/Container'
import { BellOutlined } from '@ant-design/icons'
import NavBar from './NavBar'
import UserMenu from './UserMenu'

type Props = {}

const Header = (props: Props) => {
  return (
    <div className="bg-black text-white shadow-md">
      <Container>
        <div className="flex items-center justify-between py-3 lg:py-4">
          {/* Logo */}
          <Logo />

          {/* Navigation Links */}
          <NavBar />

          {/* User Menu */}
          <UserMenu />
        </div>
      </Container>
    </div>
  )
}

export default Header
