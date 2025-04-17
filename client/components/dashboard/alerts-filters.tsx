"use client"

import { useState } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Filter, X } from "lucide-react"

export function AlertsFilters() {
  const [filters, setFilters] = useState({
    severity: [] as string[],
    provider: [] as string[],
    category: [] as string[],
    status: [] as string[],
  })

  const toggleFilter = (type: keyof typeof filters, value: string) => {
    setFilters((prev) => {
      const current = [...prev[type]]
      const index = current.indexOf(value)
      if (index === -1) {
        current.push(value)
      } else {
        current.splice(index, 1)
      }
      return { ...prev, [type]: current }
    })
  }

  const clearFilters = () => {
    setFilters({
      severity: [],
      provider: [],
      category: [],
      status: [],
    })
  }

  const hasActiveFilters = Object.values(filters).some((filterGroup) => filterGroup.length > 0)

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            <h3 className="font-medium">Filters</h3>
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 px-2 text-xs">
              <X className="h-3 w-3 mr-1" />
              Clear all
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Label className="text-xs mb-2 block">Severity</Label>
            <div className="flex flex-wrap gap-1">
              {["critical", "high", "medium", "low", "info"].map((severity) => (
                <Button
                  key={severity}
                  variant={filters.severity.includes(severity) ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  onClick={() => toggleFilter("severity", severity)}
                >
                  {severity}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs mb-2 block">Provider</Label>
            <div className="flex flex-wrap gap-1">
              {["aws", "azure", "gcp", "system"].map((provider) => (
                <Button
                  key={provider}
                  variant={filters.provider.includes(provider) ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs uppercase"
                  onClick={() => toggleFilter("provider", provider)}
                >
                  {provider}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs mb-2 block">Category</Label>
            <div className="flex flex-wrap gap-1">
              {["cost", "security", "performance", "availability", "other"].map((category) => (
                <Button
                  key={category}
                  variant={filters.category.includes(category) ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  onClick={() => toggleFilter("category", category)}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-xs mb-2 block">Status</Label>
            <div className="flex flex-wrap gap-1">
              {["new", "read", "acknowledged", "resolved"].map((status) => (
                <Button
                  key={status}
                  variant={filters.status.includes(status) ? "default" : "outline"}
                  size="sm"
                  className="h-7 text-xs capitalize"
                  onClick={() => toggleFilter("status", status)}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
