import { createContext, useContext, useMemo, useState, type ReactNode } from 'react'
import { createBaseline } from '../lib/defaults'
import { makeDemoData } from '../data/demo'
import { localRepository } from '../repositories/local'
import { aggregate, allocateStarters, analyze, balanceScore } from '../services/scoring'
import type { LeagueConfiguration } from '../types/domain'
interface State { config:LeagueConfiguration; setConfig:(v:LeagueConfiguration)=>void; save:()=>void; reset:()=>void; data:ReturnType<typeof makeDemoData>; results:ReturnType<typeof aggregate>; analyses:ReturnType<typeof analyze>; score:number; theme:'light'|'dark'; toggleTheme:()=>void }
const Context=createContext<State|null>(null)
export function AppProvider({children}:{children:ReactNode}){
  const [config,setRaw]=useState(()=>localRepository.current()??createBaseline());const [theme,setTheme]=useState(localRepository.theme)
  const data=useMemo(()=>makeDemoData(),[]);const results=useMemo(()=>allocateStarters(aggregate(data,config),config),[data,config]);const analyses=useMemo(()=>analyze(results),[results])
  const setConfig=(v:LeagueConfiguration)=>{setRaw(v);localRepository.setCurrent(v)}
  const value:State={config,setConfig,save:()=>localRepository.save({...config,updatedAt:new Date().toISOString()}),reset:()=>setConfig(createBaseline()),data,results,analyses,score:balanceScore(analyses),theme,toggleTheme:()=>{const next=theme==='dark'?'light':'dark';setTheme(next);localRepository.setTheme(next)}}
  return <Context.Provider value={value}>{children}</Context.Provider>
}
// eslint-disable-next-line react-refresh/only-export-components
export const useApp=()=>{const v=useContext(Context);if(!v)throw new Error('Missing AppProvider');return v}
