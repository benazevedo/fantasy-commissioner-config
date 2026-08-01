import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Route, Routes } from 'react-router'
import { AppProvider } from './AppContext'
import { Shell } from '../components/Shell'
import { Dashboard } from '../features/dashboard/Dashboard'
import { Builder } from '../features/builder/Builder'
import { Analysis } from '../features/analysis/Analysis'
import { Optimizer } from '../features/optimizer/Optimizer'
import { Saved } from '../features/configurations/Saved'
import { Methodology } from '../features/methodology/Methodology'
import { Auth } from '../features/auth/Auth'
const queryClient=new QueryClient()
function NotFound(){return <section className="card empty tall"><h1>404</h1><h2>That route is out of bounds.</h2><a className="button primary" href="/">Return to dashboard</a></section>}
export default function App(){return <QueryClientProvider client={queryClient}><AppProvider><BrowserRouter><Routes><Route element={<Shell/>}><Route index element={<Dashboard/>}/><Route path="builder" element={<Builder/>}/><Route path="analysis" element={<Analysis/>}/><Route path="optimizer" element={<Optimizer/>}/><Route path="saved" element={<Saved/>}/><Route path="methodology" element={<Methodology/>}/><Route path="auth" element={<Auth/>}/><Route path="*" element={<NotFound/>}/></Route></Routes></BrowserRouter></AppProvider></QueryClientProvider>}
