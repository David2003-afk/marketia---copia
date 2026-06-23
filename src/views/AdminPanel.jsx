import { useApp } from '../AppContext.jsx'
import { PRODUCTS, SELLERS } from '../data/db.js'
import s from './AdminPanel.module.css'

export default function AdminPanel() {
  const { adminTab, setAdminTab, pending, approveProduct, rejectProduct, users, showToast } = useApp()

  return (
    <div>
      <div className="tab-nav">
        <button className={adminTab==='products'?'active':''} onClick={() => setAdminTab('products')}>Productos pendientes</button>
        <button className={adminTab==='sellers' ?'active':''} onClick={() => setAdminTab('sellers')}>Vendedores</button>
        <button className={adminTab==='users'   ?'active':''} onClick={() => setAdminTab('users')}>Usuarios</button>
      </div>

      {/* ── PRODUCTS ── */}
      {adminTab === 'products' && <>
        <p className="section-title">Publicaciones pendientes <span>({pending.length})</span></p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Producto</th><th>Categoría</th><th>Vendedor</th><th>Precio</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {pending.map(p => (
                <tr key={p.id}>
                  <td>{p.emoji} {p.name}</td><td>{p.cat}</td><td>{p.seller}</td><td>S/. {p.price}</td>
                  <td><span className="status-badge s-pend">{p.status}</span></td>
                  <td>
                    <button className={s.btnOk}  onClick={() => approveProduct(p.id)}>✔ Aprobar</button>
                    <button className={s.btnBan} onClick={() => rejectProduct(p.id)}>✖ Rechazar</button>
                  </td>
                </tr>
              ))}
              {pending.length === 0 && <tr><td colSpan={6} className={s.empty}>No hay publicaciones pendientes</td></tr>}
            </tbody>
          </table>
        </div>

        <p className="section-title" style={{marginTop:'1.5rem'}}>Todos los productos <span>(mostrando 8)</span></p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Producto</th><th>Categoría</th><th>Vendedor</th><th>Precio</th><th>Stock</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {PRODUCTS.slice(0,8).map(p => (
                <tr key={p.id}>
                  <td>{p.emoji} {p.name}</td><td>{p.cat}</td><td>{p.seller}</td>
                  <td>S/. {p.price}</td><td>{p.stock}</td>
                  <td><span className="status-badge s-active">Activo</span></td>
                  <td><button className={s.btnBan} onClick={() => showToast('Producto suspendido')}>Suspender</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}

      {/* ── SELLERS ── */}
      {adminTab === 'sellers' && <>
        <p className="section-title">Gestión de vendedores</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Tienda</th><th>Productos</th><th>Ventas</th><th>Calificación</th><th>Estado</th><th>Acciones</th></tr></thead>
            <tbody>
              {SELLERS.map(sel => {
                const prods = PRODUCTS.filter(p => p.seller === sel.name)
                const sales = prods.reduce((a,p) => a+p.sold, 0)
                return (
                  <tr key={sel.name}>
                    <td><strong>{sel.name}</strong></td>
                    <td>{prods.length}</td><td>{sales}</td><td>{sel.rating} ★</td>
                    <td><span className={`status-badge ${sel.status==='activo'?'s-active':'s-pend'}`}>{sel.status}</span></td>
                    <td>
                      {sel.status === 'pendiente' && <button className={s.btnOk} onClick={() => showToast('✅ Vendedor aprobado')}>Aprobar</button>}
                      <button className={s.btnBan} onClick={() => showToast('Vendedor suspendido')}>Suspender</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </>}

      {/* ── USERS ── */}
      {adminTab === 'users' && <>
        <p className="section-title">Gestión de usuarios</p>
        <div className={s.tableWrap}>
          <table className={s.table}>
            <thead><tr><th>Usuario</th><th>Email</th><th>Rol</th><th>Miembro desde</th><th>Estado</th><th>Acción</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:8}}>
                      <div style={{width:28,height:28,borderRadius:'50%',background:'var(--accent-light)',color:'var(--accent)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:11,fontWeight:600}}>{u.avatar}</div>
                      {u.name}
                    </div>
                  </td>
                  <td style={{fontSize:12}}>{u.email}</td>
                  <td><span className={`status-badge ${u.role==='admin'?'s-ban':u.role==='seller'?'s-pend':'s-active'}`}>{u.role}</span></td>
                  <td style={{fontSize:12}}>{u.joined}</td>
                  <td><span className="status-badge s-active">Activo</span></td>
                  <td><button className={s.btnBan} onClick={() => showToast('Usuario suspendido')}>Suspender</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>}
    </div>
  )
}
