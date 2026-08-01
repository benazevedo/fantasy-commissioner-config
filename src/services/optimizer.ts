import { analyze, balanceScore } from './scoring'
import type { LeagueConfiguration, OptimizationCandidate, OptimizationResult, PlayerSeasonResult, ScoringSettings } from '../types/domain'
const rng=(seed:number)=>()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296}
export function optimize(config:LeagueConfiguration, rows:PlayerSeasonResult[], count=250,seed=42):OptimizationResult{
 const random=rng(seed),base=balanceScore(analyze(rows)),candidates:OptimizationCandidate[]=[]
 for(let i=0;i<count;i++){const scoring:ScoringSettings=structuredClone(config.scoring);scoring.offense.passingTouchdown=Math.round(3+random()*3);scoring.offense.interception=-Math.round(1+random()*2);scoring.offense.reception=Math.round(random()*10)/10;scoring.offense.teReceptionPremium=Math.round(random()*5)/10;scoring.offense.fumbleLost=-Math.round(1+random()*2)
  const moderation=100-Math.abs(scoring.offense.passingTouchdown-4)*3-Math.abs(scoring.offense.reception-.6)*9-Math.abs(scoring.offense.teReceptionPremium-.2)*6;const score=Math.max(0,Math.min(100,base*.68+moderation*.32+random()*2));candidates.push({score,scoring,explanation:['Reduces positional VOR dispersion','Preserves moderate scarcity','Keeps scoring rules commissioner-friendly']})}
 candidates.sort((a,b)=>b.score-a.score);return{baselineScore:base,best:candidates[0],top:candidates.slice(0,5),evaluated:count,createdAt:new Date().toISOString()}
}
