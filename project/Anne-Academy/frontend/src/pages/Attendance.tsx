import { useEffect, useState } from 'react'
import { api } from '../api/client'
import type { AttendanceStatus, SchoolClass, Student } from '../types'

const statuses: AttendanceStatus[] = ['present', 'absent', 'leave', 'late']

export default function Attendance() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [classId, setClassId] = useState<string>('')
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10))
  const [students, setStudents] = useState<Student[]>([])
  const [marks, setMarks] = useState<Record<number, AttendanceStatus>>({})
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    api.get('/classes').then((res) => setClasses(res.data))
  }, [])

  useEffect(() => {
    if (!classId) {
      setStudents([])
      return
    }
    api.get('/students', { params: { class_id: classId } }).then((res) => {
      setStudents(res.data)
      const initial: Record<number, AttendanceStatus> = {}
      res.data.forEach((s: Student) => { initial[s.id] = 'present' })
      setMarks(initial)
    })
  }, [classId])

  async function save() {
    if (!classId) return
    const records = students.map((s) => ({ student_id: s.id, date, status: marks[s.id] || 'present' }))
    await api.post('/attendance/bulk', { class_id: Number(classId), date, records })
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div>
      <h1 className="font-display text-3xl">Attendance</h1>
      <p className="text-ink/50 mt-1">Mark daily attendance by class.</p>

      <div className="flex gap-3 mt-6">
        <select value={classId} onChange={(e) => setClassId(e.target.value)} className="border border-ink/15 rounded-md px-3 py-2 text-sm">
          <option value="">Select class</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>{c.name}{c.section ? ' - ' + c.section : ''}</option>
          ))}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="border border-ink/15 rounded-md px-3 py-2 text-sm" />
      </div>

      {students.length > 0 && (
        <div className="mt-6 bg-white border border-forest-100 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-forest-50 text-ink/60 text-xs uppercase tracking-wide">
              <tr>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t border-forest-50">
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      {statuses.map((st) => (
                        <button
                          key={st}
                          onClick={() => setMarks({ ...marks, [s.id]: st })}
                          className={`px-2.5 py-1 rounded-full text-xs capitalize border ${
                            marks[s.id] === st ? 'bg-forest-700 text-white border-forest-700' : 'border-ink/15 text-ink/60'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="px-4 py-4 border-t border-forest-50 flex items-center gap-3">
            <button onClick={save} className="bg-forest-700 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-forest-600">
              Save attendance
            </button>
            {saved && <span className="text-sm text-forest-700">Saved.</span>}
          </div>
        </div>
      )}
      {classId && students.length === 0 && (
        <p className="text-ink/40 mt-6">No students in this class yet.</p>
      )}
    </div>
  )
}
