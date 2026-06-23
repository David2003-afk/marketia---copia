import { useApp } from '../AppContext.jsx'
import { PRODUCTS } from '../data/db.js'
import s from './OrderHistory.module.css'

const statusClass = { entregado:'s-active', 'en camino':'s-pend', procesando:'s-ban' }

export default function OrderHistory() {
  const { user, orders, setView } = useApp()

  if (!user) return (
    <div className={s.empty}>
      <p>Debes iniciar sesión para ver tu historial.</p>
      <button onClick={() => setView('login')}>Ingresar</button>
    </div>
  )

  const myOrders = orders.filter(o => o.user === user.id)

  return (
    <div>
      <p className="section-title">Historial de pedidos <span>({myOrders.length})</span></p>

      {myOrders.length === 0 && <p style={{color:'var(--text2)',fontSize:13}}>Aún no tienes pedidos.</p>}

      {myOrders.map(o => (
        <div key={o.id} className={s.orderCard}>
          <div className={s.orderHead}>
            <span className={s.orderId}>{o.id}</span>
            <div className={s.orderMeta}>
              <span style={{fontSize:12,color:'var(--text3)'}}>{o.date}</span>
              <span className={`status-badge ${statusClass[o.status] || 's-pend'}`}>{o.status}</span>
            </div>
          </div>
          {o.items.map((it, i) => {
            const p = PRODUCTS.find(x => x.id === it.prod)
            return p ? (
              <div key={i} className={s.orderItem}>{p.emoji} {p.name} × {it.qty}</div>
            ) : null
          })}
          <div className={s.orderTotal}>Total: <strong>S/. {o.total.toFixed(2)}</strong></div>
        </div>
      ))}

      {/* Datos personales */}
      <div className={s.profile}>
        <p className="section-title" style={{marginBottom:'.6rem'}}>Información personal</p>
        <div className={s.profileGrid}>
          <div><span>Nombre</span>{user.name}</div>
          <div><span>Email</span>{user.email}</div>
          <div><span>Teléfono</span>{user.phone || '—'}</div>
          <div><span>Dirección</span>{user.address || '—'}</div>
          <div><span>Miembro desde</span>{user.joined}</div>
          <div><span>Rol</span>{user.role}</div>
        </div>
      </div>
    </div>
  )
}
