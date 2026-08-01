import { describe,expect,it } from 'vitest'
import { createBaseline } from '../lib/defaults'
import { defensePointsAllowed, percentile, scorePlayerWeek } from './scoring'
import type { PlayerWeekStats } from '../types/domain'
const row:PlayerWeekStats={playerId:'1',playerName:'Test',position:'TE',team:'TST',opponent:'OPP',season:2026,week:1,seasonType:'REG',active:true,passingYards:100,passingTouchdowns:1,interceptions:1,passingTwoPoint:0,rushingYards:10,rushingTouchdowns:0,rushingTwoPoint:0,receptions:4,receivingYards:50,receivingTouchdowns:1,receivingTwoPoint:0,fumblesLost:0,patMade:0,patMissed:0,fgMade0to39:0,fgMade40to49:0,fgMade50to59:0,fgMade60Plus:0,fgMissed:0}
describe('scoring',()=>{it('scores offense and TE premium',()=>{const c=createBaseline();expect(scorePlayerWeek(row,c.scoring)).toBe(21);c.scoring.offense.teReceptionPremium=.5;expect(scorePlayerWeek(row,c.scoring)).toBe(23)});it('applies defense tiers',()=>{const t=createBaseline().scoring.defense.pointsAllowed;expect([0,3,10,17,25,31,40].map(x=>defensePointsAllowed(x,t))).toEqual([10,7,4,1,0,-1,-4])});it('interpolates percentiles',()=>expect(percentile([0,10,20],.25)).toBe(5))})
