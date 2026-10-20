import { FormEvent, useEffect, useState } from 'react'
import { api } from '../api/client'
import Modal from '../components/Modal'
import type { Teacher } from '../types'

const emptyForm = { name: '', email: '', phone: '', subject: '', qualification: '' }

export default function Teachers() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)

  async function load() {
    const { data } = await api.get('/teachers')
    setTeachers(data)
  }

  useEffect(() => { load() }, [])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    await api.post('/teachers', form)
    setShowModal(false)
    setForm(emptyForm)
    load()
  }

  async function remove(id: number) {
    await api.delete(`/teachers/${id}`)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Faculty</h1>
          <p className="text-ink/50 mt-1">Teaching staff directory.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="bg-forest-700 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-forest-600">
          Add teacher
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        {teachers.map((t) => (
          <div key={t.id} className="bg-white border border-forest-100 rounded-lg px-5 py-4 flex justify-between items-start">
            <div>
              <p className="font-medium">{t.name}</p>
              <p className="text-sm text-ink/60">{t.subject || 'Subject not set'}</p>
              <p className="text-xs text-ink/40 mt-1">{t.email} {t.phone && `· ${t.phone}`}</p>
            </div>
            <button onClick={() => remove(t.id)} className="text-xs text-brick hover:underline">Remove</button>
          </div>
        ))}
        {teachers.length === 0 && <p className="text-ink/40">No faculty members added yet.</p>}
      </div>

      {showModal && (
        <Modal title="Add teacher" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            <input required placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input placeholder="Qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <button className="w-full bg-forest-700 text-white rounded-md py-2.5 font-medium hover:bg-forest-600">Save teacher</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
