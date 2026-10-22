import { FormEvent, useEffect, useState } from 'react'
import { api } from '../api/client'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import type { Student, SchoolClass } from '../types'

const emptyForm = {
  name: '',
  gender: '',
  class_id: '',
  parent_name: '',
  parent_phone: '',
  parent_email: '',
  address: '',
}

export default function Students() {
  const [students, setStudents] = useState<Student[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function load() {
    const { data } = await api.get('/students', { params: search ? { search } : {} })
    setStudents(data)
  }

  useEffect(() => {
    load()
    api.get('/classes').then((res) => setClasses(res.data))
  }, [])

  function classLabel(classId?: number) {
    const c = classes.find((cl) => cl.id === classId)
    return c ? `${c.name}${c.section ? ' - ' + c.section : ''}` : '—'
  }

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    await api.post('/students', { ...form, class_id: form.class_id ? Number(form.class_id) : null })
    setShowModal(false)
    setForm(emptyForm)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Students</h1>
          <p className="text-ink/50 mt-1">Every enrolled student record in one place.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-forest-700 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-forest-600"
        >
          Add student
        </button>
      </div>

      <div className="flex gap-3 mt-6">
        <input
          placeholder="Search by name or admission no..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm w-72"
        />
        <button onClick={load} className="text-sm text-forest-700 underline underline-offset-2">
          Search
        </button>
      </div>

      <div className="mt-6 bg-white border border-forest-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forest-50 text-ink/60 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Admission No.</th>
              <th className="text-left px-4 py-3">Name</th>
              <th className="text-left px-4 py-3">Class</th>
              <th className="text-left px-4 py-3">Parent Contact</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t border-forest-50">
                <td className="px-4 py-3 font-mono text-xs text-ink/60">{s.admission_no}</td>
                <td className="px-4 py-3 font-medium">{s.name}</td>
                <td className="px-4 py-3 text-ink/70">{classLabel(s.class_id)}</td>
                <td className="px-4 py-3 text-ink/70">{s.parent_name || '—'}<br /><span className="text-xs text-ink/40">{s.parent_phone}</span></td>
                <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
              </tr>
            ))}
            {students.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-ink/40">No students yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="Add student" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <select value={form.class_id} onChange={(e) => setForm({ ...form, class_id: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm">
              <option value="">Select class</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name} {c.section ? '- ' + c.section : ''}</option>
              ))}
            </select>
            <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm">
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input placeholder="Parent / guardian name" value={form.parent_name} onChange={(e) => setForm({ ...form, parent_name: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Parent phone" value={form.parent_phone} onChange={(e) => setForm({ ...form, parent_phone: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Parent email" value={form.parent_email} onChange={(e) => setForm({ ...form, parent_email: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <button className="w-full bg-forest-700 text-white rounded-md py-2.5 font-medium hover:bg-forest-600">Save student</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
