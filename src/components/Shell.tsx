import { BarChart3, Bookmark, Calculator, Gauge, Home, LogIn, Menu, Moon, Settings2, Sun } from 'lucide-react'
import { NavLink, Outlet } from 'react-router'
import { useState } from 'react'
import { useApp } from '../app/AppContext'
import { isSupabaseConfigured } from '../lib/supabase'
const links=[['/','Overview',Home],['/builder','League builder',Settings2],['/analysis','Position analysis',BarChart3],['/optimizer','Rule optimizer',Gauge],['/saved','Saved configs',Bookmark],['/methodology','Methodology',Calculator]] as const
export function Shell(){const {config,theme,toggleTheme}=useApp();const [open,setOpen]=useState(false)
  return <div className="app-shell" data-theme={theme}><aside className={open?'sidebar open':'sidebar'}>
    <div className="brand"><span className="brand-mark">FC</span><span>Fantasy<br/><b>CommissionerConfig</b></span></div>
    <nav aria-label="Main navigation">{links.map(([to,label,Icon])=><NavLink key={to} to={to} end={to==='/'} onClick={()=>setOpen(false)}><Icon size={18}/>{label}</NavLink>)}</nav>
    <div className="sidebar-bottom"><div className="data-card"><span className="status-dot"/> Synthetic Demo Data<small>2026 · Local mode</small></div><NavLink to="/auth"><LogIn size={18}/>Account</NavLink></div>
  </aside><main><header className="topbar"><button className="icon-btn mobile-menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu"><Menu/></button><div className="current"><small>CURRENT CONFIGURATION</small><b>{config.name}</b></div><div className="top-actions"><span className="mode-badge">{isSupabaseConfigured?'Cloud connected':'Local demo'}</span><button className="icon-btn" onClick={toggleTheme} aria-label="Toggle color theme">{theme==='dark'?<Sun/>:<Moon/>}</button></div></header>
    <div className="demo-banner"><b>Synthetic Demo Data</b><span>Explore every feature with deterministic sample players. Import nflverse data when you’re ready for real seasons.</span></div><div className="page"><Outlet/></div>
  </main></div>
}
