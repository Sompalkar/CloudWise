import * as React from "react"

// import { cn } from "@/lib/utils"
import { cn } from "../../lib/utils"

/**
 * Chart component that serves as a container for chart elements
 */
const Chart = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div className={cn("relative", className)} ref={ref} {...props} />
})
Chart.displayName = "Chart"

/**
 * ChartContainer component that provides styling for the chart
 */
const ChartContainer = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return <div className={cn("overflow-hidden rounded-md border", className)} ref={ref} {...props} />
  },
)
ChartContainer.displayName = "ChartContainer"

/**
 * ChartTooltip props interface
 */
interface ChartTooltipProps {
  payload?: any[] | null
  label?: string
  formatter?: (value: any) => string
  active?: boolean
}

/**
 * ChartTooltip component for displaying tooltips on charts
 */
const ChartTooltip: React.FC<ChartTooltipProps> = ({ payload, label, formatter, active }) => {
  if (!active || !payload || payload.length === 0) {
    return null
  }

  return (
    <div className="rounded-md border bg-background p-2 text-sm shadow-md">
      <div className="font-bold">{label}</div>
      {payload.map((item, index) => (
        <div key={index} className="flex items-center space-x-2">
          <span style={{ color: item.color }}>●</span>
          <span>
            {item.name}: {formatter ? formatter(item.value) : item.value}
          </span>
        </div>
      ))}
    </div>
  )
}

ChartTooltip.displayName = "ChartTooltip"

/**
 * ChartLegend component for displaying chart legends
 */
const ChartLegend = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("mt-4 flex flex-wrap items-center justify-center gap-4 text-sm", className)}
        {...props}
      />
    )
  },
)
ChartLegend.displayName = "ChartLegend"

/**
 * ChartLegendItem props interface
 */
interface ChartLegendItemProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string
  color: string
}

/**
 * ChartLegendItem component for individual legend items
 */
const ChartLegendItem = React.forwardRef<HTMLDivElement, ChartLegendItemProps>(
  ({ name, color, className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex items-center gap-1", className)} {...props}>
        <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: color }} />
        <span>{name}</span>
      </div>
    )
  },
)
ChartLegendItem.displayName = "ChartLegendItem"

export { Chart, ChartContainer, ChartTooltip, ChartLegend, ChartLegendItem }
