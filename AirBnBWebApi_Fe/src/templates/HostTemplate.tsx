import Header from '@/components/Host/Layout/Header'
import Footer from '@/components/User/Layout/Footer/Footer'
import ROLE from '@/constants/role'
import ROUTES from '@/constants/routes'
import storageKeys from '@/constants/storageKeys'
import { ModalProvider } from '@/contexts/ModalAuthContext'
import { useAuth } from '@/hooks'
import { storage } from '@/utils'
import { Navigate, Outlet } from 'react-router-dom'

type Props = {}

export function HostTemplate({ }: Props) {

  const { user } = useAuth();

  if (!storage.get(storageKeys.USER_INFO) && storage.get(storageKeys.USER_ROLE) !== ROLE.HOST) {
    return <Navigate to={ROUTES.HOST_LOGIN} />
  }

  return (
    <ModalProvider>
      <div className="flex flex-col min-h-screen">
        <header className="sticky top-0 z-50">
          <Header />
        </header>
        <main className="flex-grow pt-16 px-4 lg:px-8 bg-gray-50">
          <Outlet />
        </main>
        <footer className="bg-white shadow-md">
          <Footer />
        </footer>
      </div>
    </ModalProvider>
  )
}
