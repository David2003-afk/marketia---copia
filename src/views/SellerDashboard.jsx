import { useState } from 'react'
import { useApp } from '../AppContext.jsx'
import { PRODUCTS, CATEGORIES } from '../data/db.js'
import s from './SellerDashboard.module.css'

const COLORS = ['#3B82F6','#8B5CF6','#10B981','#F59E0B','#EF4444','#06B6D4','#EC4899','#84CC16','#F97316','#6366F1']
const PERIODS = [
  {val:'1w', label:'Última semana'},
  {val:'1m', label:'Último mes'},
  {val:'3m', label:'Últimos 3 meses'},
  {val:'6m', label:'Últimos 6 meses'},
  {val:'12m',label:'Últimos 12 meses'},
]
const multiplier = {  '1w':0.02, '1m':0.08, '3m':0.25, '6m':0.5, '12m':1 }

export default function SellerDashboard() {
  const { sellerTab, setSellerTab, showToast } = useApp()
  const [catF,   setCatF]   = useState('Todos')
  const [period, setPeriod] = useState('12m')
  const [pName,  setPName]  = useState('')
  const [pCat,   setPCat]   = useState(CATEGORIES[0])
  const [pPrice, setPPrice] = useState('')
  const [pDesc,  setPDesc]  = useState('')
  const [pStock, setPStock] = useState('')
  const [pEmoji, setPEmoji] = useState('🛍️')

  const mx = multiplier[period]

  const topByCat = CATEGORIES.map(cat => {
    const prods = PRODUCTS.filter(p => p.cat === cat && (catF === 'Todos' || catF === cat))
    return { cat, sales: Math.round(prods.reduce((a,p) => a+p.sold,0) * mx) }
  }).sort((a,b) => b.sales - a.sales)

  const topProds = [...PRODUCTS]
    .filter(p => catF === 'Todos' || p.cat === catF)
    .sort((a,b) => b.sold - a.sold).slice(0,5)

  const totalSales = Math.round(topProds.reduce((a,p) => a+p.sold,0) * mx)
  const totalRev   = Math.round(topProds.reduce((a,p) => a+p.sold*p.price,0) * mx)
  const barMax = topByCat[0]?.sales || 1

  return (
    <div>
      <div className="tab-nav">
        <button className={sellerTab==='dashboard'?'active':''} onClick={() => setSellerTab('dashboard')}>Dashboard IA</button>
        <button className={sellerTab==='publish'  ?'active':''} onClick={() => setSellerTab('publish')}>Publicar producto</button>
        <button className={sellerTab==='myprods'  ?'active':''} onClick={() => setSellerTab('myprods')}>Mis productos</button>
      </div>

      {/* ── DASHBOARD ── */}
      {sellerTab === 'dashboard' && <>
        <div className="ai-box">
          <strong>🤖 Análisis de IA</strong>
          {catF === 'Todos'
            ? 'Videojuegos y Electrónica muestran mayor crecimiento. Se recomienda aumentar stock en consolas y accesorios gaming.'
            : `La categoría ${catF} tiene buena demanda. La IA sugiere ampliar variedad de marcas y considerar bundles complementarios.`}
        </div>

        <div className={s.filters}>
          <select value={catF} onChange={e => setCatF(e.target.value)}>
            <option>Todos</option>
            {CATEGORIES.map(c => <option key={c}>{c}</option>)}
          </select>
          <select value={period} onChange={e => setPeriod(e.target.value)}>
            {PERIODS.map(p => <option key={p.val} value={p.val}>{p.label}</option>)}
          </select>
        </div>

        <div className={s.metrics}>
          <div className={s.metric}><div className={s.mLabel}>Ventas totales</div><div className={s.mVal}>{totalSales.toLocaleString()}</div><div className={s.mSub}>unidades</div></div>
          <div className={s.metric}><div className={s.mLabel}>Ingresos</div><div className={s.mVal}>S/.{(totalRev/1000).toFixed(1)}k</div><div className={s.mSub}>período seleccionado</div></div>
          <div className={s.metric}><div className={s.mLabel}>Productos activos</div><div className={s.mVal}>{PRODUCTS.filter(p => catF==='Todos'||p.cat===catF).length}</div><div className={s.mSub}>en catálogo</div></div>
          <div className={s.metric}><div className={s.mLabel}>Calificación tienda</div><div className={s.mVal}>4.6 ★</div><div className={s.mSub}>promedio</div></div>
        </div>

        <div className={s.charts}>
          <div className={s.chartBox}>
            <p className="section-title">Ventas por categoría</p>
            <div className={s.barChart}>
              {topByCat.slice(0,7).map((c,i) => (
                <div key={c.cat} className={s.barWrap} title={`${c.cat}: ${c.sales}`}>
                  <div className={s.barInner} style={{height:`${Math.round((c.sales/barMax)*90)}px`, background:`${COLORS[i]}22`, borderTop:`2px solid ${COLORS[i]}`}}>
                    <span style={{color:COLORS[i]}}>{c.sales}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className={s.legend}>
              {topByCat.slice(0,7).map((c,i) => (
                <span key={c.cat} style={{color:COLORS[i],fontSize:10}}>■ {c.cat.split(' ')[0]}</span>
              ))}
            </div>
          </div>

          <div className={s.chartBox}>
            <p className="section-title">Productos más vendidos</p>
            {topProds.map((p,i) => (
              <div key={p.id} className={s.topRow}>
                <span className={s.rank}>#{i+1}</span>
                <span className={s.topName}>{p.emoji} {p.name.substring(0,22)}{p.name.length>22?'…':''}</span>
                <span className={s.topSales}>{Math.round(p.sold*mx)}</span>
              </div>
            ))}
          </div>
        </div>
      </>}

      {/* ── PUBLISH ── */}
      {sellerTab === 'publish' && (
        <div className={s.pubForm}>
          <h3>Nuevo producto</h3>
          <div className="form-group"><label>Nombre</label>
            <input type="text" placeholder="ej. Jabón de lavanda" value={pName} onChange={e => setPName(e.target.value)} />
          </div>
          <div className={s.row2}>
            <div className="form-group"><label>Categoría</label>
              <select value={pCat} onChange={e => setPCat(e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group"><label>Precio (S/.)</label>
              <input type="number" placeholder="0.00" step="0.10" value={pPrice} onChange={e => setPPrice(e.target.value)} />
            </div>
          </div>
          <div className="form-group"><label>Descripción</label>
            <textarea rows={3} placeholder="Describe tu producto..." style={{width:'100%',resize:'none',padding:'8px',border:'1px solid var(--border-md)',borderRadius:'var(--radius-md)'}}
              value={pDesc} onChange={e => setPDesc(e.target.value)} />
          </div>
          <div className={s.row2}>
            <div className="form-group"><label>Stock</label>
              <input type="number" placeholder="0" value={pStock} onChange={e => setPStock(e.target.value)} />
            </div>
            <div className="form-group"><label>Emoji</label>
              <input type="text" placeholder="🛍️" maxLength={2} value={pEmoji} onChange={e => setPEmoji(e.target.value)} />
            </div>
          </div>
          <div className="ai-box" style={{marginBottom:'1rem'}}>
            <strong>💡 Sugerencia IA</strong>
            Los productos de <em>Cuidado personal</em> y <em>Alimentación saludable</em> tienen alta demanda esta temporada.
          </div>
          <button className="btn-primary" onClick={() => {
            if (!pName.trim()) { showToast('⚠️ Ingresa el nombre del producto'); return }
            showToast('✅ Producto enviado a revisión del administrador')
            setPName(''); setPPrice(''); setPDesc(''); setPStock(''); setPEmoji('🛍️')
            setSellerTab('myprods')
          }}>Publicar para revisión</button>
        </div>
      )}

      {/* ── MIS PRODUCTOS ── */}
      {sellerTab === 'myprods' && (
        <div className={s.prodGrid}>
          {PRODUCTS.slice(0,8).map(p => (
            <div key={p.id} className={s.prodCard}>
              <div className={s.prodThumb}>{p.emoji}</div>
              <div className={s.prodInfo}>
                <div style={{fontSize:10,color:'var(--text3)',marginBottom:2}}>{p.cat}</div>
                <div style={{fontSize:13,fontWeight:500,marginBottom:4}}>{p.name}</div>
                <div style={{fontSize:13,color:'var(--accent)',fontWeight:600,marginBottom:4}}>S/. {p.price.toFixed(2)}</div>
                <div style={{fontSize:11,color:'var(--text3)',marginBottom:5}}>Stock: {p.stock} · Vendidos: {p.sold}</div>
                <span className="status-badge s-active">Activo</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
