'use client'

import React from 'react'
import { cn } from '@/lib/utils'

export interface MetricItem {
  key: string
  value: string
  label: string
}

export function MetricGrid({ items, className }: { items: MetricItem[]; className?: string }) {
  return (
    <div
      className={cn(
        "grid [grid-template-columns:repeat(auto-fit,minmax(110px,1fr))] gap-3 sm:gap-4",
        className
      )}
    >
      {items.map((m) => (
        <div key={m.key} className="px-2 text-center">
          <div className="text-xl sm:text-2xl font-bold text-mp-gold mb-1 tabular-nums font-mono">
            {m.value}
          </div>
          <div className="text-[10px] sm:text-[11px] text-mp-gray-400 uppercase tracking-wide font-medium whitespace-nowrap">
            {m.label}
          </div>
        </div>
      ))}
    </div>
  )
}


