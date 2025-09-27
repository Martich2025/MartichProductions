import { initMonitoringServer } from '@/lib/monitoring'

export async function register() {
  await initMonitoringServer()
}


