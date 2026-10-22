import { FormEvent, useEffect, useState } from 'react'
import { api } from '../api/client'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import type { Lead, LeadStatus, LeadSource } from '../types'

const statuses: LeadStatus[] = ['new', 'contacted', 'follow_up', 'admitted', 'lost']
const sources: LeadSource[] = ['website', 'walk_in', 'referral', 'phone', 'social_media', 'other']

const emptyForm = {
  student_name: '',
  parent_name: '',
  phone: '',
  email: '',
  interested_class: '',
  source: 'website' as LeadSource,
}

export default function Leads() {
  const [leads, setLeads] = useState<Lead[]>([])
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('')
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [noteText, setNoteText] = useState('')

  async function load() {
    const params: Record<string, string> = {}
    if (search) params.search = search
    if (filterStatus) params.status = filterStatus
    const { data } = await api.get('/leads', { params })
    setLeads(data)
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus])

  async function handleCreate(e: FormEvent) {
    e.preventDefault()
    await api.post('/leads', form)
    setShowModal(false)
    setForm(emptyForm)
    load()
  }

  async function updateStatus(lead: Lead, status: LeadStatus) {
    await api.put(`/leads/${lead.id}`, { status })
    load()
    if (selectedLead?.id === lead.id) {
      const { data } = await api.get(`/leads/${lead.id}`)
      setSelectedLead(data)
    }
  }

  async function openLead(lead: Lead) {
    const { data } = await api.get(`/leads/${lead.id}`)
    setSelectedLead(data)
  }

  async function addNote(e: FormEvent) {
    e.preventDefault()
    if (!selectedLead || !noteText.trim()) return
    await api.post(`/leads/${selectedLead.id}/notes`, { note: noteText })
    setNoteText('')
    const { data } = await api.get(`/leads/${selectedLead.id}`)
    setSelectedLead(data)
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Admissions Pipeline</h1>
          <p className="text-ink/50 mt-1">Track enquiries from first contact to admission.</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-forest-700 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-forest-600"
        >
          New enquiry
        </button>
      </div>

      <div className="flex gap-3 mt-6">
        <input
          placeholder="Search by name or phone..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && load()}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm w-72"
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-ink/15 rounded-md px-3 py-2 text-sm capitalize"
        >
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s} value={s}>{s.replace('_', ' ')}</option>
          ))}
        </select>
        <button onClick={load} className="text-sm text-forest-700 underline underline-offset-2">
          Search
        </button>
      </div>

      <div className="mt-6 bg-white border border-forest-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forest-50 text-ink/60 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Student</th>
              <th className="text-left px-4 py-3">Parent / Contact</th>
              <th className="text-left px-4 py-3">Interested Class</th>
              <th className="text-left px-4 py-3">Source</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr
                key={lead.id}
                onClick={() => openLead(lead)}
                className="border-t border-forest-50 hover:bg-forest-50/60 cursor-pointer"
              >
                <td className="px-4 py-3 font-medium">{lead.student_name}</td>
                <td className="px-4 py-3 text-ink/70">
                  {lead.parent_name}<br />
                  <span className="text-xs text-ink/40">{lead.phone}</span>
                </td>
                <td className="px-4 py-3 text-ink/70">{lead.interested_class || '—'}</td>
                <td className="px-4 py-3 text-ink/70 capitalize">{lead.source.replace('_', ' ')}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-ink/40">
                  No enquiries yet. Add your first one.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <Modal title="New enquiry" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate} className="space-y-3">
            <input
              required
              placeholder="Student name"
              value={form.student_name}
              onChange={(e) => setForm({ ...form, student_name: e.target.value })}
              className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm"
            />
            <input
              placeholder="Parent / guardian name"
              value={form.parent_name}
              onChange={(e) => setForm({ ...form, parent_name: e.target.value })}
              className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm"
            />
            <input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm"
            />
            <input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm"
            />
            <input
              placeholder="Interested class (e.g. Grade 3)"
              value={form.interested_class}
              onChange={(e) => setForm({ ...form, interested_class: e.target.value })}
              className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm"
            />
            <select
              value={form.source}
              onChange={(e) => setForm({ ...form, source: e.target.value as LeadSource })}
              className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm capitalize"
            >
              {sources.map((s) => (
                <option key={s} value={s}>{s.replace('_', ' ')}</option>
              ))}
            </select>
            <button className="w-full bg-forest-700 text-white rounded-md py-2.5 font-medium hover:bg-forest-600">
              Save enquiry
            </button>
          </form>
        </Modal>
      )}

      {selectedLead && (
        <Modal title={selectedLead.student_name} onClose={() => setSelectedLead(null)}>
          <div className="space-y-1 text-sm text-ink/70 mb-4">
            <p>Parent: {selectedLead.parent_name || '—'}</p>
            <p>Phone: {selectedLead.phone || '—'}</p>
            <p>Email: {selectedLead.email || '—'}</p>
            <p>Interested class: {selectedLead.interested_class || '—'}</p>
          </div>

          <label className="block text-xs uppercase tracking-wide text-ink/50 mb-1">Move stage</label>
          <div className="flex flex-wrap gap-2 mb-5">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => updateStatus(selectedLead, s)}
                className={`px-3 py-1.5 rounded-full text-xs capitalize border ${
                  selectedLead.status === s
                    ? 'bg-forest-700 text-white border-forest-700'
                    : 'border-ink/15 text-ink/60 hover:border-forest-400'
                }`}
              >
                {s.replace('_', ' ')}
              </button>
            ))}
          </div>

          <label className="block text-xs uppercase tracking-wide text-ink/50 mb-2">Follow-up notes</label>
          <div className="space-y-2 max-h-40 overflow-y-auto mb-3">
            {selectedLead.notes.length === 0 && (
              <p className="text-sm text-ink/40">No notes logged yet.</p>
            )}
            {selectedLead.notes.map((n) => (
              <div key={n.id} className="text-sm bg-forest-50 rounded-md px-3 py-2">
                <p>{n.note}</p>
                <p className="text-xs text-ink/40 mt-1">{new Date(n.created_at).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <form onSubmit={addNote} className="flex gap-2">
            <input
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Log a call, visit, or update..."
              className="flex-1 border border-ink/15 rounded-md px-3 py-2 text-sm"
            />
            <button className="bg-forest-700 text-white rounded-md px-4 text-sm font-medium hover:bg-forest-600">
              Add
            </button>
          </form>
        </Modal>
      )}
    </div>
  )
}
