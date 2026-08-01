import { Copy, Download, Play, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { localRepository } from '../../repositories/local'
import { useApp } from '../../app/AppContext'
import type { LeagueConfiguration } from '../../types/domain'
export function Saved(){const [saved,setSaved]=useState(localRepository.saved());const {setConfig}=useApp();const nav=useNavigate();const open=(x:LeagueConfiguration,path:string)=>{setConfig(x);nav(path)}
 const remove=(id:string)=>{if(confirm('Delete this local configuration?')){localRepository.remove(id);setSaved(localRepository.saved())}}
 const download=(x:LeagueConfiguration)=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(x,null,2)],{type:'application/json'}));a.download=`${x.name.replace(/\W+/g,'-').toLowerCase()}.json`;a.click()}
 return <><div className="page-heading compact"><div><span className="eyebrow">CONFIGURATION LIBRARY</span><h1>Your league experiments</h1><p>Saved locally in this browser. Connect Supabase to synchronize across devices.</p></div></div><div className="position-tabs"><button className="active">Local · {saved.length}</button><button disabled>Cloud · connect account</button></div>
 {saved.length===0?<section className="card empty tall"><Copy/><h2>No saved configurations yet</h2><p>Save your current experiment from the league builder.</p><button className="button primary" onClick={()=>nav('/builder')}>Open builder</button></section>:<div className="saved-grid">{saved.map(x=><article className="card saved-card" key={x.id}><div><span className="badge starter">LOCAL</span><small>{new Date(x.updatedAt).toLocaleDateString()}</small></div><h2>{x.name}</h2><p>{x.description||'No description'}</p><dl><div><dt>Teams</dt><dd>{x.roster.teams}</dd></div><div><dt>Season</dt><dd>{x.season}</dd></div><div><dt>Format</dt><dd>{x.scoring.offense.reception} PPR</dd></div></dl><div className="card-actions"><button onClick={()=>open(x,'/analysis')}><Play/>Analyze</button><button onClick={()=>download(x)}><Download/>Export</button><button className="danger" onClick={()=>remove(x.id)}><Trash2/>Delete</button></div></article>)}</div>}</>
}
