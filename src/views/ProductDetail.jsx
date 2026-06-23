import { useApp } from '../AppContext.jsx'
import { REVIEWS } from '../data/db.js'
import s from './ProductDetail.module.css'

const stars = (r) => '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r))

export default function ProductDetail() {
  const { selectedProd: p, setView, addToCart, user, showToast } = useApp()
  if (!p) return null

  const revs = REVIEWS.filter(r => r.prod === p.id)
  const avg  = revs.length ? revs.reduce((a, r) => a + r.rating, 0) / revs.length : p.rating

  return (
    <div>
      <button className={s.back} onClick={() => setView('home')}>← Volver</button>

      <div className={s.detail}>
        <div className={s.img}>{p.emoji}</div>
        <div className={s.meta}>
          <div className={s.cat}>{p.cat}</div>
          <h1 className={s.name}>{p.name}</h1>
          <div className={s.stars}>{stars(avg)} {avg.toFixed(1)} <span>({revs.length} reseñas)</span></div>
          <div className={s.price}>S/. {p.price.toFixed(2)}</div>
          <p className={s.desc}>{p.desc}</p>
          <div className={s.seller}>Vendedor: <strong>{p.seller}</strong> · Stock: {p.stock} unid.</div>
          <button className={s.buyBtn} onClick={() => addToCart(p)}>🛒 Agregar al carrito</button>
        </div>
      </div>

      {/* Reseñas */}
      <div className={s.reviewSection}>
        <p className="section-title">Reseñas de compradores</p>
        {revs.length === 0
          ? <p className={s.noReviews}>Aún no hay reseñas para este producto.</p>
          : revs.map((r, i) => (
            <div key={i} className={s.reviewCard}>
              <div className={s.rAuthor}>{r.user}</div>
              <div className={s.rStars}>{stars(r.rating)}</div>
              <p>{r.comment}</p>
            </div>
          ))
        }
        {user?.role === 'buyer' && (
          <div className={s.reviewForm}>
            <p style={{fontWeight:500,marginBottom:'.6rem',fontSize:13}}>Dejar una reseña</p>
            <div style={{marginBottom:'.5rem',color:'#F59E0B',fontSize:20}}>★★★★★</div>
            <textarea placeholder="Escribe tu reseña..." rows={3} style={{width:'100%',padding:'8px',border:'1px solid var(--border-md)',borderRadius:'var(--radius-md)',resize:'none',marginBottom:'.5rem'}} />
            <button className={s.buyBtn} style={{width:'auto',padding:'7px 18px'}} onClick={() => showToast('✅ Reseña enviada')}>Publicar</button>
          </div>
        )}
      </div>
    </div>
  )
}
