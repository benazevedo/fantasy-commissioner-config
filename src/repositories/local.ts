import { z } from 'zod'
import type { LeagueConfiguration, SavedOptimizationRun } from '../types/domain'
const KEY='fcc:v1:'
const read=<T>(key:string,fallback:T):T=>{try{const raw=localStorage.getItem(KEY+key);return raw?JSON.parse(raw) as T:fallback}catch{return fallback}}
const write=(key:string,value:unknown)=>localStorage.setItem(KEY+key,JSON.stringify(value))
export const localRepository={
  current:()=>read<LeagueConfiguration|null>('current',null),setCurrent:(v:LeagueConfiguration)=>write('current',v),
  saved:()=>read<LeagueConfiguration[]>('saved',[]),save:(v:LeagueConfiguration)=>{const all=localRepository.saved().filter(x=>x.id!==v.id);write('saved',[v,...all]);return v},
  remove:(id:string)=>write('saved',localRepository.saved().filter(x=>x.id!==id)),
  runs:()=>read<SavedOptimizationRun[]>('runs',[]),saveRun:(v:SavedOptimizationRun)=>write('runs',[v,...localRepository.runs()]),
  theme:()=>read<'light'|'dark'>('theme',matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'),setTheme:(v:'light'|'dark')=>write('theme',v)
}
export const configurationImportSchema=z.object({name:z.string().min(1),season:z.number().int(),roster:z.object({teams:z.number().int().min(4).max(32)}).passthrough(),scoring:z.object({offense:z.object({passingTouchdown:z.number()}).passthrough(),kicker:z.object({patMade:z.number()}).passthrough(),defense:z.object({sack:z.number()}).passthrough()}).passthrough()}).passthrough()
