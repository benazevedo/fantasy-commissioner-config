import { useEffect, useRef } from 'react'
import * as echarts from 'echarts/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, MarkLineComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import type { EChartsCoreOption } from 'echarts/core'
echarts.use([BarChart,LineChart,PieChart,GridComponent,LegendComponent,MarkLineComponent,TooltipComponent,CanvasRenderer])
export function EChart({option,summary}:{option:EChartsCoreOption;summary:string}){
  const ref=useRef<HTMLDivElement>(null)
  useEffect(()=>{if(!ref.current)return;const chart=echarts.init(ref.current);chart.setOption(option);const ro=new ResizeObserver(()=>chart.resize());ro.observe(ref.current);return()=>{ro.disconnect();chart.dispose()}},[option])
  return <figure className="chart"><div ref={ref} className="chart-canvas" role="img" aria-label={summary}/><figcaption className="sr-only">{summary}</figcaption></figure>
}
