'use client'

import { useEffect } from 'react'
import { initMonitoringClient } from '@/lib/monitoring'

export function MonitoringInit() {
  useEffect(() => {
    initMonitoringClient()
  }, [])
  return null
}


