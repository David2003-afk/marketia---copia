import { useState } from 'react'
import { useApp } from '../AppContext.jsx'
import s from './Auth.module.css'

/* ── Password strength ── */
function pwStrength(v) {
  let score = 0
  if (v.length >= 8)        score++
  if (/[A-Z]/.test(v))     score++
  if (/[a-z]/.test(v))     score++
  if (/[0-9]/.test(v))     score++
  if (/[^A-Za-z0-9]/.test(v)) score++
  return score
}
const strengthColor = ['#EF4444','#F97316','#F59E0B','#22C55E','#3B82F6']
const strengthLabel = ['Muy débil','Débil','Regular','Fuerte','Muy fuerte']

export default function Auth() {
  const { view, setView, login, mockGoogleLogin, registerUser } = useApp()
  const [email,   setEmail]   = useState('')
  const [pass,    setPass]    = useState('')
  const [err,     setErr]     = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass,  setRegPass]  = useState('')
  const [regErr,   setRegErr]   = useState('')
  const [name,    setName]    = useState('')
  const [phone,   setPhone]   = useState('')
  const [addr,    setAddr]    = useState('')
  const [role,    setRole]    = useState('')

  const pwOk = (p) => /[A-Z]/.test(p) && /[a-z]/.test(p) && /[0-9]/.test(p) && /[^A-Za-z0-9]/.test(p) && p.length >= 8
  const score = pwStrength(regPass)

  /* ── LOGIN ── */
  if (view === 'login') return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.logoRow}>🛍️ <span>Market</span>IA</div>
        <h2>Ingresar</h2>

        <div className="form-group"><label>Correo electrónico</label>
          <input type="email" placeholder="tu@correo.com" value={email} onChange={e => setEmail(e.target.value)} />
        </div>
        <div className="form-group"><label>Contraseña</label>
          <input type="password" placeholder="••••••••" value={pass} onChange={e => setPass(e.target.value)} />
        </div>
        {err && <p className="err">{err}</p>}

        <button className="btn-primary" onClick={() => {
          const ok = login(email.trim(), pass)
          if (!ok) setErr('Correo o contraseña incorrectos')
        }}>Ingresar</button>

        <div className={s.divider}>o continúa con</div>
        <button className={s.google} onClick={mockGoogleLogin}>🔵 Continuar con Google</button>
        <span className={s.link} onClick={() => setView('register')}>¿No tienes cuenta? Regístrate</span>

        <div className={s.demo}>
          <strong>Cuentas demo:</strong><br />
          Comprador: ana@mail.com / Ana2024!<br />
          Vendedor: miguel@mail.com / Miguel55!<br />
          Admin: admin@market.com / Admin123!
        </div>
      </div>
    </div>
  )

  /* ── REGISTER STEP 1 ── */
  if (view === 'register') return (
    <div className={s.wrap}>
      <div className={s.card}>
        <div className={s.logoRow}>🛍️ <span>Market</span>IA</div>
        <h2>Crear cuenta</h2>

        <div className="form-group"><label>Correo electrónico</label>
          <input type="email" placeholder="tu@correo.com" value={regEmail} onChange={e => setRegEmail(e.target.value)} />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input type="password" placeholder="••••••••" value={regPass} onChange={e => setRegPass(e.target.value)} />
          <p style={{fontSize:10,color:'var(--text3)',marginTop:3}}>Mín. 8 caracteres · mayúscula · minúscula · número · símbolo</p>
          {regPass && (
            <div style={{marginTop:5}}>
              <div style={{height:3,borderRadius:2,background:strengthColor[score-1]||'#E2E8F0',width:(score*20)+'%',transition:'all .3s'}} />
              <p style={{fontSize:10,color:strengthColor[score-1],marginTop:2}}>{regPass ? strengthLabel[score-1] : ''}</p>
            </div>
          )}
        </div>
        {regErr && <p className="err">{regErr}</p>}

        <button className="btn-primary" onClick={() => {
          if (!regEmail.includes('@')) { setRegErr('Email inválido'); return }
          if (!pwOk(regPass))          { setRegErr('La contraseña no cumple los requisitos'); return }
          setRegErr(''); setView('register2')
        }}>Continuar</button>

        <div className={s.divider}>o regístrate con</div>
        <button className={s.google} onClick={mockGoogleLogin}>🔵 Registrarse con Google</button>
        <span className={s.link} onClick={() => setView('login')}>¿Ya tienes cuenta? Ingresar</span>
      </div>
    </div>
  )

  /* ── REGISTER STEP 2 ── */
  return (
    <div className={s.wrap}>
      <div className={s.card} style={{width:420}}>
        <h2>Completa tu perfil</h2>
        <div className="form-group"><label>Nombre completo</label>
          <input type="text" placeholder="Tu nombre completo" value={name} onChange={e => setName(e.target.value)} />
        </div>
        <div className="form-group"><label>Teléfono</label>
          <input type="text" placeholder="9XX XXX XXX" value={phone} onChange={e => setPhone(e.target.value)} />
        </div>
        <div className="form-group"><label>Dirección</label>
          <input type="text" placeholder="Ciudad, Distrito" value={addr} onChange={e => setAddr(e.target.value)} />
        </div>
        <p style={{fontSize:12,color:'var(--text2)',marginBottom:'.5rem'}}>Selecciona tu rol</p>
        <div className={s.roles}>
          <div className={`${s.role} ${role==='buyer' ? s.roleActive : ''}`} onClick={() => setRole('buyer')}>
            <div className={s.roleIcon}>🛍️</div> Comprador
          </div>
          <div className={`${s.role} ${role==='seller' ? s.roleActive : ''}`} onClick={() => setRole('seller')}>
            <div className={s.roleIcon}>🏪</div> Vendedor
          </div>
        </div>
        <button className="btn-primary" style={{marginTop:'1rem'}} onClick={() => {
          if (!name.trim()) return
          if (!role)        return
          registerUser({ name, email: regEmail, pass: regPass, role, phone, address: addr })
        }}>Crear cuenta</button>
      </div>
    </div>
  )
}
