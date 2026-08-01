import type { LeagueConfiguration, ScoringSettings } from '../types/domain'
export const baselineScoring: ScoringSettings = {
  offense: { passingYard:.04, passingTouchdown:4, interception:-1, passingTwoPoint:2, rushingYard:.1, rushingTouchdown:6, rushingTwoPoint:2, reception:.5, receivingYard:.1, receivingTouchdown:6, receivingTwoPoint:2, fumbleLost:-2, teReceptionPremium:0 },
  kicker: { patMade:1, patMissed:0, fg0to39:3, fg40to49:4, fg50to59:5, fg60Plus:5, fgMissed:0 },
  defense: { sack:1, interception:2, fumbleRecovery:2, touchdown:6, safety:2, blockedKick:2, returnTouchdown:6, pointsAllowed:[10,7,4,1,-1,-4] },
}
export const createBaseline = (): LeagueConfiguration => {
  const now = new Date().toISOString()
  return { id: crypto.randomUUID(), name:'Yahoo-Style Half PPR Baseline', description:'A balanced starting point for a 12-team league.', season:2026,
    roster:{ teams:12,QB:1,RB:2,WR:2,TE:1,FLEX:1,K:1,DST:1,bench:6,ir:2 }, scoring:structuredClone(baselineScoring),
    qualification:{ regularSeasonOnly:true,minimumGames:8,includeZeroStatWeeks:true }, source:'local',createdAt:now,updatedAt:now }
}
