import { useState } from 'react'
import { useApp } from '../AppContext.jsx'
import s from './Navbar.module.css'

export default function Navbar() {
  const { user, logout, cartCount, setView, setSearchQ, setSelectedCat } = useApp()
  const [input, setInput] = useState('')

  const goHome = () => { setView('home'); setSearchQ(''); setSelectedCat('Todos'); setInput('') }

  const handleSearch = (e) => {
    e.preventDefault()
    setSearchQ(input)
    setSelectedCat('Todos')
    setView('home')
  }

  return (
    <header className={s.nav}>
      <div className={s.top}>
        {/* Logo izquierda */}
        <div className={s.logo} onClick={goHome}>🛍️ <span>Market</span>IA</div>

        {/* Acciones derecha */}
        <div className={s.actions}>
          {user ? <>
            <span className={s.hi}>Hola, {user.name.split(' ')[0]}</span>
            {user.role === 'seller' && <button className={s.link} onClick={() => setView('seller')}>Dashboard</button>}
            {user.role === 'admin'  && <button className={s.link} onClick={() => setView('admin')}>Admin</button>}
            {user.role !== 'admin'  && <button className={s.link} onClick={() => setView('history')}>Mis pedidos</button>}
            <button className={s.link} onClick={logout}>Salir</button>
          </> : <>
            <button className={s.link}    onClick={() => setView('login')}>Ingresar</button>
            <button className={s.primary} onClick={() => setView('register')}>Registrarse</button>
          </>}
          {/* Carrito */}
          <button className={s.cartBtn} onClick={() => setView('checkout')}>
            🛒 Carrito
            {cartCount > 0 && <span className={s.badge}>{cartCount}</span>}
          </button>
        </div>
      </div>

      {/* Buscador centrado */}
      <div className={s.searchRow}>
        <form className={s.form} onSubmit={handleSearch}>
          <input
            type="text" placeholder="Buscar productos, categorías..."
            value={input} onChange={e => setInput(e.target.value)}
          />
          <button type="submit">🔍</button>
        </form>
      </div>
    </header>
  )
}
