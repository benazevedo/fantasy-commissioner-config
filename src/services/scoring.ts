import type { BasePosition, DistributionMetrics, HistoricalData, LeagueConfiguration, PlayerSeasonResult, PlayerWeekStats, PositionAnalysis, ScoringSettings, TeamDefenseWeekStats } from '../types/domain'
const n = (value:number|null) => value ?? 0
export function scorePlayerWeek(row:PlayerWeekStats, scoring:ScoringSettings):number {
  const o=scoring.offense
  let points=n(row.passingYards)*o.passingYard+n(row.passingTouchdowns)*o.passingTouchdown+n(row.interceptions)*o.interception+n(row.passingTwoPoint)*o.passingTwoPoint+
    n(row.rushingYards)*o.rushingYard+n(row.rushingTouchdowns)*o.rushingTouchdown+n(row.rushingTwoPoint)*o.rushingTwoPoint+
    n(row.receptions)*(o.reception+(row.position==='TE'?o.teReceptionPremium:0))+n(row.receivingYards)*o.receivingYard+
    n(row.receivingTouchdowns)*o.receivingTouchdown+n(row.receivingTwoPoint)*o.receivingTwoPoint+n(row.fumblesLost)*o.fumbleLost
  if(row.position==='K') points+=n(row.patMade)*scoring.kicker.patMade+n(row.patMissed)*scoring.kicker.patMissed+n(row.fgMade0to39)*scoring.kicker.fg0to39+
    n(row.fgMade40to49)*scoring.kicker.fg40to49+n(row.fgMade50to59)*scoring.kicker.fg50to59+n(row.fgMade60Plus)*scoring.kicker.fg60Plus+n(row.fgMissed)*scoring.kicker.fgMissed
  return points
}
export function defensePointsAllowed(points:number|null, tiers:ScoringSettings['defense']['pointsAllowed']):number {
  if(points===null) return 0
  return points===0?tiers[0]:points<=6?tiers[1]:points<=13?tiers[2]:points<=20?tiers[3]:points<=27?0:points<=34?tiers[4]:tiers[5]
}
export function scoreDefenseWeek(row:TeamDefenseWeekStats, scoring:ScoringSettings):number {
  const d=scoring.defense
  return n(row.sacks)*d.sack+n(row.interceptions)*d.interception+n(row.fumbleRecoveries)*d.fumbleRecovery+n(row.touchdowns)*d.touchdown+
    n(row.safeties)*d.safety+n(row.blockedKicks)*d.blockedKick+n(row.returnTouchdowns)*d.returnTouchdown+defensePointsAllowed(row.pointsAllowed,d.pointsAllowed)
}
const mean=(v:number[])=>v.length?v.reduce((a,b)=>a+b,0)/v.length:0
const sd=(v:number[])=>{const m=mean(v);return Math.sqrt(mean(v.map(x=>(x-m)**2)))}
export function percentile(values:number[], p:number):number {
  if(!values.length)return 0; const a=[...values].sort((x,y)=>x-y); const i=(a.length-1)*p; const lo=Math.floor(i),hi=Math.ceil(i); return a[lo]+(a[hi]-a[lo])*(i-lo)
}
export function aggregate(data:HistoricalData, config:LeagueConfiguration):PlayerSeasonResult[] {
  const groups=new Map<string,{name:string;position:BasePosition;team:string;scores:number[]}>()
  for(const r of data.players) { if(config.qualification.regularSeasonOnly&&r.seasonType!=='REG')continue; const score=scorePlayerWeek(r,config.scoring); if(!config.qualification.includeZeroStatWeeks&&score===0)continue
    const g=groups.get(r.playerId)??{name:r.playerName,position:r.position,team:r.team,scores:[]};g.scores.push(score);groups.set(r.playerId,g)}
  for(const r of data.teams){if(config.qualification.regularSeasonOnly&&r.seasonType!=='REG')continue;const score=scoreDefenseWeek(r,config.scoring);const id=`DST-${r.team}`;const g=groups.get(id)??{name:`${r.team} Defense`,position:'DST',team:r.team,scores:[]};g.scores.push(score);groups.set(id,g)}
  return [...groups].map(([id,g])=>({id,name:g.name,position:g.position,team:g.team,games:g.scores.length,total:g.scores.reduce((a,b)=>a+b,0),ppg:mean(g.scores),standardDeviation:sd(g.scores),weeklyScores:g.scores,starter:false,flex:false,replacementValue:0,rank:0}))
    .filter(x=>x.games>=config.qualification.minimumGames)
}
export function allocateStarters(input:PlayerSeasonResult[], config:LeagueConfiguration):PlayerSeasonResult[] {
  const rows=input.map(x=>({...x})); const positions:BasePosition[]=['QB','RB','WR','TE','K','DST']; const selected=new Set<string>(); const replacement=new Map<BasePosition,number>()
  for(const p of positions){const pool=rows.filter(x=>x.position===p).sort((a,b)=>b.ppg-a.ppg);pool.forEach((x,i)=>x.rank=i+1);const count=config.roster[p]*config.roster.teams;pool.slice(0,count).forEach(x=>{x.starter=true;selected.add(x.id)});replacement.set(p,pool[count]?.ppg??pool.at(-1)?.ppg??0)}
  rows.filter(x=>!selected.has(x.id)&&['RB','WR','TE'].includes(x.position)).sort((a,b)=>b.ppg-a.ppg).slice(0,config.roster.FLEX*config.roster.teams).forEach(x=>{x.starter=true;x.flex=true;selected.add(x.id)})
  for(const x of rows)x.replacementValue=x.ppg-(replacement.get(x.position)??0)
  return rows.sort((a,b)=>b.ppg-a.ppg)
}
export function distribution(values:number[]):DistributionMetrics {
  const m=mean(values),s=sd(values);return{count:values.length,mean:m,median:percentile(values,.5),standardDeviation:s,coefficientOfVariation:m?s/m:0,minimum:Math.min(...values,0),maximum:Math.max(...values,0),p10:percentile(values,.1),p25:percentile(values,.25),p75:percentile(values,.75),p90:percentile(values,.9)}
}
export function analyze(rows:PlayerSeasonResult[]):PositionAnalysis[] {
  return (['QB','RB','WR','TE','K','DST'] as BasePosition[]).map(position=>{const all=rows.filter(x=>x.position===position),starters=all.filter(x=>x.starter),replacement=all.filter(x=>!x.starter).sort((a,b)=>b.ppg-a.ppg)[0]?.ppg??0
    const weeks=all.flatMap(x=>x.weeklyScores),m=mean(weeks),s=sd(weeks);return{position,distribution:distribution(all.map(x=>x.ppg)),starterCount:starters.length,starterCutoff:Math.min(...starters.map(x=>x.ppg),0),replacementPpg:replacement,meanStarterVor:mean(starters.map(x=>x.ppg-replacement)),maxVor:Math.max(...starters.map(x=>x.ppg-replacement),0),topToReplacementGap:Math.max(...all.map(x=>x.ppg),0)-replacement,boomRate:weeks.length?weeks.filter(x=>x>m+s).length/weeks.length:0,bustRate:weeks.length?weeks.filter(x=>x<m-s).length/weeks.length:0}})
}
export function balanceScore(analyses:PositionAnalysis[]):number {
  const core=analyses.filter(x=>!['K'].includes(x.position));const vors=core.map(x=>x.meanStarterVor);const m=mean(vors);const dispersion=m?sd(vors)/m:1;const dominance=m?Math.max(...vors)/(vors.reduce((a,b)=>a+b,0)||1):1;const volatility=mean(core.map(x=>x.distribution.coefficientOfVariation));return Math.max(0,Math.min(100,100-(dispersion*35+dominance*25+volatility*12)))
}
