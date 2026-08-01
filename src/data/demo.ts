import type { BasePosition, HistoricalData, PlayerWeekStats, TeamDefenseWeekStats } from '../types/domain'
const hash=(s:number)=>{let x=s|0;return()=>{x=Math.imul(x^x>>>15,1|x);x^=x+Math.imul(x^x>>>7,61|x);return((x^x>>>14)>>>0)/4294967296}}
const teams=['ARI','ATL','BAL','BUF','CAR','CHI','CIN','CLE','DAL','DEN','DET','GB','HOU','IND','JAX','KC','LV','LAC','LAR','MIA','MIN','NE','NO','NYG','NYJ','PHI','PIT','SEA','SF','TB','TEN','WAS']
const counts:Record<BasePosition,number>={QB:28,RB:72,WR:84,TE:36,K:32,DST:0}
const empty=(id:string,name:string,p:BasePosition,team:string,week:number):PlayerWeekStats=>({playerId:id,playerName:name,position:p,team,opponent:teams[(teams.indexOf(team)+week)%32],season:2026,week,seasonType:'REG',active:true,passingYards:0,passingTouchdowns:0,interceptions:0,passingTwoPoint:0,rushingYards:0,rushingTouchdowns:0,rushingTwoPoint:0,receptions:0,receivingYards:0,receivingTouchdowns:0,receivingTwoPoint:0,fumblesLost:0,patMade:0,patMissed:0,fgMade0to39:0,fgMade40to49:0,fgMade50to59:0,fgMade60Plus:0,fgMissed:0})
export function makeDemoData():HistoricalData{
  const rnd=hash(26072026),players:PlayerWeekStats[]=[];const labels:Record<BasePosition,string>={QB:'Quarterback',RB:'Running Back',WR:'Wide Receiver',TE:'Tight End',K:'Kicker',DST:'Defense'}
  for(const p of ['QB','RB','WR','TE','K'] as BasePosition[])for(let i=0;i<counts[p];i++)for(let w=1;w<=14;w++){const r=empty(`${p}-${i}`,`${labels[p]} ${String(i+1).padStart(2,'0')}`,p,teams[i%32],w);const talent=1-i/counts[p];const noise=.65+rnd()*.7
    if(p==='QB'){r.passingYards=(145+talent*145)*noise;r.passingTouchdowns=(.7+talent*1.6)*noise;r.interceptions=rnd()<.5?1:0;r.rushingYards=8+talent*24}
    if(p==='RB'){r.rushingYards=(18+talent**1.7*90)*noise;r.rushingTouchdowns=rnd()<.12+talent*.38?1:0;r.receptions=1+talent*3;r.receivingYards=8+talent*25}
    if(p==='WR'){r.receptions=(1.5+talent*5)*noise;r.receivingYards=(20+talent*70)*noise;r.receivingTouchdowns=rnd()<.08+talent*.28?1:0}
    if(p==='TE'){const cliff=i<8?1:i<18?.62:.32;r.receptions=(1+talent*4)*cliff*noise;r.receivingYards=(14+talent*54)*cliff*noise;r.receivingTouchdowns=rnd()<.05+talent*.25?1:0}
    if(p==='K'){r.patMade=Math.floor(rnd()*4);r.fgMade0to39=Math.floor(rnd()*3);r.fgMade40to49=rnd()<.42?1:0;r.fgMade50to59=rnd()<.22?1:0;r.fgMissed=rnd()<.13?1:0}
    players.push(r)}
  const defenses:TeamDefenseWeekStats[]=teams.flatMap((team,i)=>Array.from({length:14},(_,j)=>({team,season:2026,week:j+1,seasonType:'REG' as const,opponent:teams[(i+j+1)%32],sacks:Math.floor(rnd()*5),interceptions:rnd()<.55?1:0,fumbleRecoveries:rnd()<.35?1:0,touchdowns:rnd()<.12?1:0,safeties:rnd()<.04?1:0,blockedKicks:rnd()<.05?1:0,returnTouchdowns:rnd()<.06?1:0,pointsAllowed:Math.floor(rnd()*38)})))
  return{players,teams:defenses,manifest:{source:'synthetic',season:2026,importedAt:new Date(0).toISOString(),playerRows:players.length,teamRows:defenses.length,availability:{all:true}}}
}
