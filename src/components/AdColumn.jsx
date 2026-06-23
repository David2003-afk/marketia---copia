import s from './AdColumn.module.css'

const ADS = [
  { title:'Interbank',       sub:'Préstamos hasta S/. 50k', icon:'🏦' },
  { title:'Rimac Seguros',   sub:'Protege lo que más quieres', icon:'🛡️' },
  { title:'Claro Perú',      sub:'Plan ilimitado S/.39/mes', icon:'📡' },
  { title:'PagoEfectivo',    sub:'Paga sin tarjeta fácil',   icon:'💳' },
]

export default function AdColumn() {
  return (
    <aside className={s.col}>
      {ADS.map((a, i) => (
        <div key={i} className={s.box}>
          <p className={s.label}>publicidad</p>
          <div className={s.icon}>{a.icon}</div>
          <p className={s.title}>{a.title}</p>
          <p className={s.sub}>{a.sub}</p>
        </div>
      ))}
    </aside>
  )
}
