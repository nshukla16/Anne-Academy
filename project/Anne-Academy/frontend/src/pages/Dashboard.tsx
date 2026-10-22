import { useEffect, useState } from 'react'
import { api } from '../api/client'
import StatCard from '../components/StatCard'
import type { DashboardStats } from '../types'

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null)

  useEffect(() => {
    api.get('/dashboard/stats').then((res) => setStats(res.data))
  }, [])

  return (
    <div>
      <h1 className="font-display text-3xl">Good to see you</h1>
      <p className="text-ink/50 mt-1">Here's how the school is tracking today.</p>

      {!stats ? (
        <p className="mt-8 text-ink/40">Loading overview...</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
            <StatCard label="Enrolled students" value={stats.total_students} />
            <StatCard label="Faculty" value={stats.total_teachers} />
            <StatCard label="Classes" value={stats.total_classes} />
            <StatCard label="New enquiries" value={stats.new_leads} accent="ochre" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <StatCard label="Admitted from pipeline" value={stats.admitted_leads} />
            <StatCard
              label="Fees collected"
              value={`$${stats.collected_fee_amount.toLocaleString()}`}
            />
            <StatCard
              label="Fees pending"
              value={`$${stats.pending_fee_amount.toLocaleString()}`}
              accent="brick"
            />
          </div>

          <div className="mt-8 bg-white border border-forest-100 rounded-lg px-6 py-5">
            <h2 className="font-display text-lg mb-3">Attendance today</h2>
            <div className="flex gap-8">
              <div>
                <p className="text-2xl font-display text-forest-700">{stats.attendance_today_present}</p>
                <p className="text-xs text-ink/50 uppercase tracking-wide">Present</p>
              </div>
              <div>
                <p className="text-2xl font-display text-brick">{stats.attendance_today_absent}</p>
                <p className="text-xs text-ink/50 uppercase tracking-wide">Absent</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
