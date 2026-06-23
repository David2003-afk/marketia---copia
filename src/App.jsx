import { AppProvider, useApp } from './AppContext.jsx'
import Navbar       from './components/Navbar.jsx'
import AdColumn     from './components/AdColumn.jsx'
import Home         from './views/Home.jsx'
import ProductDetail from './views/ProductDetail.jsx'
import Checkout     from './views/Checkout.jsx'
import Auth         from './views/Auth.jsx'
import OrderHistory from './views/OrderHistory.jsx'
import SellerDashboard from './views/SellerDashboard.jsx'
import AdminPanel   from './views/AdminPanel.jsx'

const AUTH_VIEWS = ['login', 'register', 'register2']
const NO_ADS     = ['seller', 'admin', 'checkout']

function Inner() {
  const { view, toast } = useApp()

  const isAuth  = AUTH_VIEWS.includes(view)
  const hasAds  = !NO_ADS.includes(view) && !isAuth

  const renderView = () => {
    if (isAuth)            return <Auth />
    if (view === 'product') return <ProductDetail />
    if (view === 'checkout') return <Checkout />
    if (view === 'history')  return <OrderHistory />
    if (view === 'seller')   return <SellerDashboard />
    if (view === 'admin')    return <AdminPanel />
    return <Home />
  }

  return (
    <>
      {!isAuth && <Navbar />}

      {isAuth
        ? renderView()
        : (
          <div style={{ display:'flex', minHeight:'calc(100vh - 78px)' }}>
            {hasAds && <AdColumn />}
            <main style={{ flex:1, padding:'1rem 1.3rem', minWidth:0 }}>
              {renderView()}
            </main>
            {hasAds && <AdColumn />}
          </div>
        )
      }

      {toast && <div className="toast">{toast}</div>}
    </>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Inner />
    </AppProvider>
  )
}
