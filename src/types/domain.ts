export type Position = 'QB' | 'RB' | 'WR' | 'TE' | 'FLEX' | 'K' | 'DST'
export type BasePosition = Exclude<Position, 'FLEX'>
export type FlexEligiblePosition = 'RB' | 'WR' | 'TE'

export interface PlayerWeekStats {
  playerId: string; playerName: string; position: BasePosition; team: string; opponent: string
  season: number; week: number; seasonType: 'REG' | 'POST'; active: boolean
  passingYards: number | null; passingTouchdowns: number | null; interceptions: number | null; passingTwoPoint: number | null
  rushingYards: number | null; rushingTouchdowns: number | null; rushingTwoPoint: number | null
  receptions: number | null; receivingYards: number | null; receivingTouchdowns: number | null; receivingTwoPoint: number | null
  fumblesLost: number | null; patMade: number | null; patMissed: number | null
  fgMade0to39: number | null; fgMade40to49: number | null; fgMade50to59: number | null; fgMade60Plus: number | null
  fgMissed: number | null
}
export interface TeamDefenseWeekStats {
  team: string; season: number; week: number; seasonType: 'REG' | 'POST'; opponent: string
  sacks: number | null; interceptions: number | null; fumbleRecoveries: number | null; touchdowns: number | null
  safeties: number | null; blockedKicks: number | null; returnTouchdowns: number | null; pointsAllowed: number | null
}
export interface RosterSettings { teams: number; QB: number; RB: number; WR: number; TE: number; FLEX: number; K: number; DST: number; bench: number; ir: number }
export interface OffensiveScoringSettings {
  passingYard: number; passingTouchdown: number; interception: number; passingTwoPoint: number
  rushingYard: number; rushingTouchdown: number; rushingTwoPoint: number; reception: number
  receivingYard: number; receivingTouchdown: number; receivingTwoPoint: number; fumbleLost: number; teReceptionPremium: number
}
export interface KickerScoringSettings {
  patMade: number; patMissed: number; fg0to39: number; fg40to49: number; fg50to59: number; fg60Plus: number; fgMissed: number
}
export interface DefenseScoringSettings {
  sack: number; interception: number; fumbleRecovery: number; touchdown: number; safety: number; blockedKick: number
  returnTouchdown: number; pointsAllowed: [number, number, number, number, number, number]
}
export interface ScoringSettings { offense: OffensiveScoringSettings; kicker: KickerScoringSettings; defense: DefenseScoringSettings }
export interface QualificationSettings { regularSeasonOnly: boolean; minimumGames: number; includeZeroStatWeeks: boolean }
export interface LeagueConfiguration {
  id: string; name: string; description: string; season: number; roster: RosterSettings; scoring: ScoringSettings
  qualification: QualificationSettings; source: 'local' | 'cloud'; createdAt: string; updatedAt: string
}
export interface PlayerSeasonResult {
  id: string; name: string; position: BasePosition; team: string; games: number; total: number; ppg: number
  standardDeviation: number; weeklyScores: number[]; starter: boolean; flex: boolean; replacementValue: number; rank: number
}
export interface DistributionMetrics {
  count: number; mean: number; median: number; standardDeviation: number; coefficientOfVariation: number; minimum: number; maximum: number
  p10: number; p25: number; p75: number; p90: number
}
export interface PositionAnalysis {
  position: BasePosition; distribution: DistributionMetrics; starterCount: number; starterCutoff: number; replacementPpg: number
  meanStarterVor: number; maxVor: number; topToReplacementGap: number; boomRate: number; bustRate: number
}
export interface OptimizationObjectiveWeights { balance: number; depth: number; availability: number; competitiveness: number; volatility: number; simplicity: number }
export interface OptimizationSettings { size: 250 | 1000 | 5000; seed: number; fineTuning: boolean; weights: OptimizationObjectiveWeights }
export interface OptimizationCandidate { score: number; scoring: ScoringSettings; explanation: string[] }
export interface OptimizationResult { baselineScore: number; best: OptimizationCandidate; top: OptimizationCandidate[]; evaluated: number; createdAt: string }
export interface SavedOptimizationRun extends OptimizationResult { id: string; configurationName: string }
export interface DataManifest { source: 'nflverse' | 'synthetic'; season: number; importedAt: string; playerRows: number; teamRows: number; availability: Record<string, boolean> }
export interface HistoricalData { players: PlayerWeekStats[]; teams: TeamDefenseWeekStats[]; manifest: DataManifest }
