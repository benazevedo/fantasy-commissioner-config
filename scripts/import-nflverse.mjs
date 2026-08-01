import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { parse } from 'csv-parse/sync'
const arg=(name)=>{const i=process.argv.indexOf(name);return i>=0?process.argv[i+1]:undefined}
const season=Number(arg('--season')),refresh=process.argv.includes('--refresh')
if(!Number.isInteger(season)||season<1999||season>new Date().getFullYear()+1){console.error('Usage: npm run data:import -- --season 2025 [--refresh]');process.exit(1)}
const cache=resolve('.cache/nflverse'),out=resolve(`public/data/${season}`);await mkdir(cache,{recursive:true});await mkdir(out,{recursive:true})
const sources={players:`https://github.com/nflverse/nflverse-data/releases/download/stats_player/stats_player_week_${season}.csv`,teams:`https://github.com/nflverse/nflverse-data/releases/download/stats_team/stats_team_week_${season}.csv`}
async function load(kind,url){const file=resolve(cache,`${kind}_${season}.csv`);if(!refresh&&existsSync(file)){console.log(`Using cached ${file}`);return readFile(file,'utf8')}console.log(`Downloading ${url}`);const res=await fetch(url);if(!res.ok)throw new Error(`${kind} download failed: ${res.status} ${res.statusText}`);const text=await res.text();await writeFile(file,text);return text}
const number=(v)=>v===''||v===undefined?null:Number.isFinite(Number(v))?Number(v):null
const aliases=(row,names)=>{for(const n of names)if(n in row)return number(row[n]);return null}
const base=(r)=>({season:Number(r.season),week:Number(r.week),seasonType:r.season_type??'REG',opponent:r.opponent_team??r.opponent??''})
try{
 const rawPlayers=parse(await load('players',sources.players),{columns:true,skip_empty_lines:true});const rawTeams=parse(await load('teams',sources.teams),{columns:true,skip_empty_lines:true})
 const reg=(r)=>Number(r.season)===season&&(r.season_type??'REG')==='REG'
 const players=rawPlayers.filter(reg).map((r)=>({...base(r),playerId:r.player_id??r.player_display_name,playerName:r.player_display_name??r.player_name??'Unknown',position:r.position_group??r.position,team:r.recent_team??r.team??'',active:true,
  passingYards:number(r.passing_yards),passingTouchdowns:number(r.passing_tds),interceptions:number(r.interceptions),passingTwoPoint:aliases(r,['passing_2pt_conversions','passing_two_point_conversions']),
  rushingYards:number(r.rushing_yards),rushingTouchdowns:number(r.rushing_tds),rushingTwoPoint:aliases(r,['rushing_2pt_conversions','rushing_two_point_conversions']),receptions:number(r.receptions),receivingYards:number(r.receiving_yards),receivingTouchdowns:number(r.receiving_tds),receivingTwoPoint:aliases(r,['receiving_2pt_conversions','receiving_two_point_conversions']),fumblesLost:number(r.rushing_fumbles_lost??r.receiving_fumbles_lost??r.fumbles_lost),
  patMade:aliases(r,['pat_made','extra_points_made']),patMissed:aliases(r,['pat_missed','extra_points_missed']),fgMade0to39:aliases(r,['fg_made_0_19','fg_made_20_29','fg_made_30_39']),fgMade40to49:aliases(r,['fg_made_40_49']),fgMade50to59:aliases(r,['fg_made_50_59']),fgMade60Plus:aliases(r,['fg_made_60_']),fgMissed:aliases(r,['fg_missed','field_goals_missed'])}))
 const teams=rawTeams.filter(reg).map((r)=>({...base(r),team:r.team??r.recent_team??'',sacks:aliases(r,['sacks','def_sacks']),interceptions:aliases(r,['interceptions','def_interceptions']),fumbleRecoveries:aliases(r,['fumble_recoveries','def_fumble_recoveries']),touchdowns:aliases(r,['def_tds','defensive_tds']),safeties:number(r.safeties),blockedKicks:aliases(r,['blocked_kicks','def_blocked_kicks']),returnTouchdowns:aliases(r,['return_tds','special_teams_tds']),pointsAllowed:aliases(r,['points_allowed','opponent_score'])}))
 const headers=new Set([...Object.keys(rawPlayers[0]??{}),...Object.keys(rawTeams[0]??{})]);const requested=['passing_yards','passing_tds','interceptions','rushing_yards','rushing_tds','receptions','receiving_yards','receiving_tds','sacks','points_allowed']
 const manifest={source:'nflverse',season,importedAt:new Date().toISOString(),playerRows:players.length,teamRows:teams.length,availability:Object.fromEntries(requested.map(x=>[x,headers.has(x)]))}
 await Promise.all([writeFile(resolve(out,'players.json'),JSON.stringify(players)),writeFile(resolve(out,'teams.json'),JSON.stringify(teams)),writeFile(resolve(out,'manifest.json'),JSON.stringify(manifest,null,2))]);console.log(`Wrote ${players.length} player rows and ${teams.length} team rows to ${out}`)
}catch(error){console.error(`nflverse import failed: ${error instanceof Error?error.message:String(error)}`);process.exit(1)}
