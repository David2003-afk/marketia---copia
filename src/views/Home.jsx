import { useApp } from '../AppContext.jsx'
import { PRODUCTS, CATEGORIES } from '../data/db.js'
import s from './Home.module.css'

const stars = (r) => '★'.repeat(Math.floor(r)) + '☆'.repeat(5 - Math.floor(r))

export default function Home() {
  const { selectedCat, setSelectedCat, searchQ, addToCart, setSelectedProd, setView, getRecommended } = useApp()

  const allCats = ['Todos', '⭐ Recomendación', ...CATEGORIES]
  const isRec = selectedCat === '⭐ Recomendación'
  const recommended = getRecommended()
  const recIds = new Set(recommended.map(p => p.id))

  let prods = PRODUCTS
  if (searchQ) {
    const q = searchQ.toLowerCase()
    prods = prods.filter(p => p.name.toLowerCase().includes(q) || p.cat.toLowerCase().includes(q))
  }
  if (isRec) prods = recommended
  else if (selectedCat !== 'Todos') prods = prods.filter(p => p.cat === selectedCat)

  const open = (prod) => { setSelectedProd(prod); setView('product') }

  return (
    <div>
      {/* Categorías */}
      <div className={s.cats}>
        {allCats.map(c => (
          <button key={c}
            className={`${s.pill} ${c === selectedCat ? s.active : ''} ${c === '⭐ Recomendación' ? s.rec : ''}`}
            onClick={() => setSelectedCat(c)}>
            {c}
          </button>
        ))}
      </div>

      {isRec && (
        <div className="ai-box">
          <strong>🤖 Recomendaciones personalizadas</strong>
          La IA analizó tus compras anteriores y encontró estos productos que podrían interesarte.
        </div>
      )}

      {searchQ && <p className={s.searchInfo}>Resultados para "<strong>{searchQ}</strong>" — {prods.length} productos</p>}

      <p className="section-title">
        {isRec ? 'Para ti' : selectedCat === 'Todos' ? 'Todos los productos' : selectedCat}
        <span>({prods.length})</span>
      </p>

      {prods.length === 0
        ? <div className={s.empty}>
            <div className={s.emptyIcon}>🔍</div>
            <p>No encontramos resultados.</p>
            <button onClick={() => { setSelectedCat('Todos') }}>Ver todos</button>
          </div>
        : <div className={s.grid}>
            {prods.map(p => (
              <div key={p.id} className={s.card} onClick={() => open(p)}>
                {recIds.has(p.id) && !isRec && <span className={s.recBadge}>⭐ IA</span>}
                <div className={s.thumb}>{p.emoji}</div>
                <div className={s.info}>
                  <div className={s.cat}>{p.cat}</div>
                  <div className={s.name}>{p.name}</div>
                  <div className={s.rating}>{stars(p.rating)} {p.rating}</div>
                  <div className={s.price}>S/. {p.price.toFixed(2)}</div>
                  <button className={s.addBtn} onClick={e => { e.stopPropagation(); addToCart(p) }}>
                    + Agregar
                  </button>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  )
}
