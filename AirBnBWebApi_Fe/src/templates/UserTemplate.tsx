import Footer from '@/components/User/Layout/Footer/Footer'
import Header from '@/components/User/Layout/Header/Header'
import AuthModal from '@/components/User/Modal/AuthModal'
import SearchModal from '@/components/User/Modal/SearchModal'
import ROUTES from '@/constants/routes'
import { matchPath, Outlet, useLocation } from 'react-router-dom'

type Props = {}

export function UserTemplate({ }: Props) {
  const lcoation = useLocation();

  const showFooter = lcoation.pathname === ROUTES.HOME || lcoation.pathname === ROUTES.SEARCH || matchPath(lcoation.pathname, ROUTES.ROOM_DETAIL);

  console.log(showFooter)
  return (
    // <div className="user-layout flex flex-col min-h-screen">
    //   {/* Header */}
    //   <header className="fixed top-0 left-0 w-full z-50 bg-gray-100 shadow-sm">
    //     <Header />
    //   </header>

    //   {/* Spacer to prevent overlap with fixed header */}
    //   <div className="h-28"></div>

    //   {/* Main Content */}
    //   <main className="flex-1 py-2 bg-gray-100">
    //     <section className="user-content container mx-auto px-4">
    //       <Outlet />
    //     </section>
    //   </main>

    //   {/* Footer */}
    //   <footer className="bg-white shadow-t">
    //     <Footer />
    //   </footer>

    //   {/* Modals */}
    //   <AuthModal />
    //   <SearchModal />
    // </div>
    <div className="user-layout">
      <header>
        <Header />
      </header>
      <div className="h-28"></div>
      <main className={`py-5 ${showFooter === null ? 'h-vh-70' : ''} `}>
        <section className="user-content">
          <Outlet />
        </section>
      </main>
      {
        showFooter ? (
          <footer>
            <Footer />
          </footer>
        ) : null

      }

      <AuthModal />
      <SearchModal />
    </div>
  )
}
