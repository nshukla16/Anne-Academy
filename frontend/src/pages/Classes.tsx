import { FormEvent, useEffect, useState } from 'react'
import { api } from '../api/client'
import Modal from '../components/Modal'
import type { SchoolClass } from '../types'

const emptyForm = { name: '', section: '', academic_year: '2026-2027' }

export default function Classes() {
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function load() {
    const { data } = await api.get('/classes')
    setClasses(data)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    await api.post('/classes', form)
    setShowModal(false)
    setForm(emptyForm)
    load()
  }

  async function remove(id: number) {
    await api.delete(`/classes/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Classes</h1>
          <p className="text-ink/50 mt-1">Grades and sections for the academic year.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-forest-700 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-forest-600">
          Add class
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        {classes.map((c) => (
          <div key={c.id} className="bg-white border border-forest-100 rounded-lg px-4 py-4">
            <p className="font-display text-lg">{c.name}{c.section ? ` - ${c.section}` : ''}</p>
            <p className="text-xs text-ink/40 mt-1">{c.academic_year}</p>
            <button onClick={() => remove(c.id)} className="text-xs text-brick hover:underline mt-2">Remove</button>
          </div>
        ))}
        {classes.length === 0 && <p className="text-ink/40">No classes set up yet.</p>}
      </div>

      {showModal && (
        <Modal title="Add class" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            <input required placeholder="Class name (e.g. Grade 6)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Section (e.g. A)" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Academic year" value={form.academic_year} onChange={(e) => setForm({ ...form, academic_year: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <button className="w-full bg-forest-700 text-white rounded-md py-2.5 font-medium hover:bg-forest-600">Save class</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
