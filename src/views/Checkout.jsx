import { useState } from 'react'
import { useApp } from '../AppContext.jsx'
import s from './Checkout.module.css'

export default function Checkout() {
  const { cart, removeFromCart, changeQty, cartTotal, checkoutStep, setCheckoutStep, placeOrder, setView, showToast } = useApp()
  const [payMethod, setPayMethod] = useState('card')
  const [cardNum,   setCardNum]   = useState('')
  const [cardExp,   setCardExp]   = useState('')
  const [cardCvv,   setCardCvv]   = useState('')
  const [cardName,  setCardName]  = useState('')

  if (checkoutStep === 'success') return (
    <div className={s.success}>
      <div className={s.successIcon}>✅</div>
      <h2>¡Pedido realizado!</h2>
      <p>Tu compra fue procesada. Recibirás actualizaciones en tu correo.</p>
      <button onClick={() => { setCheckoutStep('cart'); setView('home') }}>Seguir comprando</button>
    </div>
  )

  if (checkoutStep === 'pay') return (
    <div className={s.wrap}>
      <button className={s.back} onClick={() => setCheckoutStep('cart')}>← Volver al carrito</button>
      <p className="section-title">Método de pago</p>

      <div className={s.tabs}>
        <button className={payMethod === 'card' ? s.tabActive : s.tab} onClick={() => setPayMethod('card')}>💳 Tarjeta</button>
        <button className={payMethod === 'yape' ? s.tabActive : s.tab} onClick={() => setPayMethod('yape')}>📱 Yape</button>
      </div>

      {payMethod === 'card'
        ? <div className={s.card}>
            <div className="form-group">
              <label>Número de tarjeta</label>
              <input type="text" placeholder="1234 5678 9012 3456" maxLength={19}
                value={cardNum} onChange={e => setCardNum(e.target.value)} />
            </div>
            <div className={s.row2}>
              <div className="form-group">
                <label>Vencimiento</label>
                <input type="text" placeholder="MM/AA" maxLength={5}
                  value={cardExp} onChange={e => setCardExp(e.target.value)} />
              </div>
              <div className="form-group">
                <label>CVV</label>
                <input type="text" placeholder="123" maxLength={3}
                  value={cardCvv} onChange={e => setCardCvv(e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label>Nombre en la tarjeta</label>
              <input type="text" placeholder="NOMBRE APELLIDO"
                value={cardName} onChange={e => setCardName(e.target.value)} />
            </div>
            <div className={s.secure}>🔒 Pago seguro con cifrado SSL</div>
            <div className={s.totalLine}>Total: <strong>S/. {cartTotal.toFixed(2)}</strong></div>
            <button className="btn-primary" onClick={() => {
              if (!cardNum || cardNum.replace(/\s/g,'').length < 12) { showToast('⚠️ Número de tarjeta inválido'); return }
              if (!cardExp || !cardExp.includes('/'))                 { showToast('⚠️ Fecha inválida'); return }
              if (!cardCvv || cardCvv.length !== 3)                   { showToast('⚠️ CVV debe tener 3 dígitos'); return }
              placeOrder()
            }}>Pagar S/. {cartTotal.toFixed(2)}</button>
          </div>
        : <div className={s.card}>
            <div className={s.yape}>
              <p>Escanea el QR con tu app Yape</p>
              <div className={s.qr}></div>
              <p><strong>S/. {cartTotal.toFixed(2)}</strong></p>
              <p className={s.yapeNum}>Número Yape: 999-111-222</p>
              <button style={{padding:'9px 24px',background:'#6D28D9',color:'#fff',border:'none',borderRadius:'var(--radius-md)',marginTop:'.5rem'}}
                onClick={placeOrder}>Ya realicé el pago</button>
            </div>
          </div>
      }
    </div>
  )

  /* ── Vista carrito ── */
  return (
    <div className={s.wrap}>
      <p className="section-title">Tu carrito <span>({cart.reduce((a,i)=>a+i.qty,0)} items)</span></p>

      {cart.length === 0
        ? <div className={s.empty}>
            <div style={{fontSize:40,marginBottom:'.5rem'}}>🛒</div>
            <p>Tu carrito está vacío</p>
            <button onClick={() => setView('home')}>Explorar productos</button>
          </div>
        : <div className={s.cartBox}>
            {cart.map(item => (
              <div key={item.prod.id} className={s.item}>
                <div className={s.itemIcon}>{item.prod.emoji}</div>
                <div className={s.itemInfo}>
                  <div className={s.itemName}>{item.prod.name}</div>
                  <div className={s.itemPrice}>S/. {item.prod.price.toFixed(2)} c/u</div>
                </div>
                <div className={s.qty}>
                  <button onClick={() => changeQty(item.prod.id, -1)}>−</button>
                  <span>{item.qty}</span>
                  <button onClick={() => changeQty(item.prod.id,  1)}>+</button>
                </div>
                <button className={s.del} onClick={() => removeFromCart(item.prod.id)}>🗑</button>
              </div>
            ))}
            <div className={s.total}>Total: <span>S/. {cartTotal.toFixed(2)}</span></div>
            <button className="btn-primary" style={{marginTop:'.8rem'}} onClick={() => setCheckoutStep('pay')}>
              Proceder al pago →
            </button>
          </div>
      }
    </div>
  )
}
