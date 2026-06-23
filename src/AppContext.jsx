import { createContext, useContext, useState, useCallback } from 'react'
import { USERS, PRODUCTS, ORDERS, PENDING_PRODUCTS } from './data/db.js'

const Ctx = createContext(null)

export function AppProvider({ children }) {
  const [view,         setView]         = useState('home')
  const [user,         setUser]         = useState(null)
  const [cart,         setCart]         = useState([])
  const [selectedCat,  setSelectedCat]  = useState('Todos')
  const [searchQ,      setSearchQ]      = useState('')
  const [selectedProd, setSelectedProd] = useState(null)
  const [checkoutStep, setCheckoutStep] = useState('cart')
  const [sellerTab,    setSellerTab]    = useState('dashboard')
  const [adminTab,     setAdminTab]     = useState('products')
  const [toast,        setToast]        = useState(null)
  const [users,        setUsers]        = useState(USERS)
  const [orders,       setOrders]       = useState(ORDERS)
  const [pending,      setPending]      = useState(PENDING_PRODUCTS)

  /* ── toast ── */
  const showToast = useCallback((msg) => {
    setToast(null)
    setTimeout(() => setToast(msg), 10)
    setTimeout(() => setToast(null), 2700)
  }, [])

  /* ── cart helpers ── */
  const cartCount = cart.reduce((a, i) => a + i.qty, 0)
  const cartTotal = cart.reduce((a, i) => a + i.qty * i.prod.price, 0)

  const addToCart = useCallback((prod) => {
    setCart(prev => {
      const ex = prev.find(i => i.prod.id === prod.id)
      return ex
        ? prev.map(i => i.prod.id === prod.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { prod, qty: 1 }]
    })
    showToast(`✅ ${prod.name} agregado al carrito`)
  }, [showToast])

  const removeFromCart = useCallback((id) => setCart(p => p.filter(i => i.prod.id !== id)), [])

  const changeQty = useCallback((id, delta) =>
    setCart(p => p.map(i => i.prod.id === id ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0))
  , [])

  /* ── recommendations ── */
  const getRecommended = useCallback(() => {
    if (!user) return PRODUCTS.slice(0, 8)
    const bought = user.purchases || []
    const boughtCats = [...new Set(bought.map(id => PRODUCTS.find(p => p.id === id)?.cat).filter(Boolean))]
    const recs = PRODUCTS.filter(p => boughtCats.includes(p.cat) && !bought.includes(p.id))
    return recs.length >= 4 ? recs.slice(0, 8) : PRODUCTS.filter(p => !bought.includes(p.id)).slice(0, 8)
  }, [user])

  /* ── auth ── */
  const login = useCallback((email, pass) => {
    if (email === 'admin@market.com' && pass === 'Admin123!') {
      setUser({ id:99, name:'Admin MarketIA', email, role:'admin', avatar:'AD', purchases:[], phone:'', address:'', joined:'2024-01-01' })
      setView('admin')
      return true
    }
    const u = users.find(x => x.email === email && x.pass === pass)
    if (u) { setUser(u); setView(u.role === 'seller' ? 'seller' : 'home'); return true }
    return false
  }, [users])

  /* ── Google OAuth real ── */
  const googleLogin = useCallback((googleUser) => {
    const { name, email, picture, sub } = googleUser
    const existing = users.find(u => u.email === email)
    if (existing) {
      setUser(existing)
      setView(existing.role === 'seller' ? 'seller' : existing.role === 'admin' ? 'admin' : 'home')
      showToast('✅ Bienvenido/a de vuelta, ' + existing.name.split(' ')[0] + '!')
    } else {
      const newU = {
        id: sub || Date.now(),
        name,
        email,
        pass: null,
        role: 'buyer',
        avatar: name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase(),
        picture,
        purchases: [],
        phone: '',
        address: '',
        joined: new Date().toISOString().slice(0,10),
      }
      setUsers(p => [...p, newU])
      setUser(newU)
      setView('home')
      showToast('🎉 ¡Bienvenido/a ' + name.split(' ')[0] + '!')
    }
  }, [users, showToast])

  const logout = useCallback(() => {
    // Sign out from Google too
    if (window.google?.accounts?.id) {
      window.google.accounts.id.disableAutoSelect()
    }
    setUser(null); setCart([]); setView('home')
  }, [])

  const registerUser = useCallback((data) => {
    const newU = {
      id: Date.now(), name: data.name, email: data.email, pass: data.pass,
      role: data.role,
      avatar: data.name.split(' ').slice(0,2).map(n => n[0]).join('').toUpperCase(),
      purchases: [], phone: data.phone||'', address: data.address||'',
      joined: new Date().toISOString().slice(0,10),
    }
    setUsers(p => [...p, newU])
    setUser(newU)
    setView(data.role === 'seller' ? 'seller' : 'home')
    showToast('🎉 ¡Bienvenido/a ' + data.name + '!')
  }, [showToast])

  /* ── order ── */
  const placeOrder = useCallback(() => {
    const newOrder = {
      id: 'ORD-' + String(orders.length + 1).padStart(3,'0'),
      user: user?.id,
      items: cart.map(i => ({ prod: i.prod.id, qty: i.qty })),
      total: cartTotal,
      date: new Date().toISOString().slice(0,10),
      status: 'procesando',
    }
    setOrders(p => [...p, newOrder])
    setCart([])
    setCheckoutStep('success')
  }, [cart, cartTotal, orders.length, user])

  /* ── admin actions ── */
  const approveProduct = useCallback((id) => { setPending(p => p.filter(x => x.id !== id)); showToast('✅ Producto aprobado') }, [showToast])
  const rejectProduct  = useCallback((id) => { setPending(p => p.filter(x => x.id !== id)); showToast('❌ Publicación rechazada') }, [showToast])

  return (
    <Ctx.Provider value={{
      view, setView,
      user, login, logout, googleLogin, registerUser,
      cart, addToCart, removeFromCart, changeQty, cartCount, cartTotal,
      selectedCat, setSelectedCat,
      searchQ, setSearchQ,
      selectedProd, setSelectedProd,
      checkoutStep, setCheckoutStep,
      sellerTab, setSellerTab,
      adminTab,  setAdminTab,
      orders, placeOrder,
      pending, approveProduct, rejectProduct,
      users,
      getRecommended,
      toast, showToast,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export const useApp = () => useContext(Ctx)
