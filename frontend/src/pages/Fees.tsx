import { FormEvent, useEffect, useState } from 'react'
import { api } from '../api/client'
import Modal from '../components/Modal'
import StatusBadge from '../components/StatusBadge'
import type { FeePayment, FeeStructure, SchoolClass, Student } from '../types'

const emptyStructure = { class_id: '', term: '', amount: '', due_date: '' }
const emptyPayment = { student_id: '', amount: '', status: 'pending', method: '', payment_date: '' }

export default function Fees() {
  const [structures, setStructures] = useState<FeeStructure[]>([])
  const [payments, setPayments] = useState<FeePayment[]>([])
  const [classes, setClasses] = useState<SchoolClass[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [showStructureModal, setShowStructureModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [structureForm, setStructureForm] = useState(emptyStructure)
  const [paymentForm, setPaymentForm] = useState(emptyPayment)

  async function load() {
    const [s, p, c, st] = await Promise.all([
      api.get('/fees/structures'),
      api.get('/fees/payments'),
      api.get('/classes'),
      api.get('/students'),
    ])
    setStructures(s.data)
    setPayments(p.data)
    setClasses(c.data)
    setStudents(st.data)
  }

  useEffect(() => { load() }, [])

  function studentName(id: number) {
    return students.find((s) => s.id === id)?.name || `#${id}`
  }

  function className(id: number) {
    const c = classes.find((cl) => cl.id === id)
    return c ? `${c.name}${c.section ? ' - ' + c.section : ''}` : `#${id}`
  }

  async function createStructure(e: FormEvent) {
    e.preventDefault()
    await api.post('/fees/structures', {
      class_id: Number(structureForm.class_id),
      term: structureForm.term,
      amount: Number(structureForm.amount),
      due_date: structureForm.due_date || null,
    })
    setShowStructureModal(false)
    setStructureForm(emptyStructure)
    load()
  }

  async function createPayment(e: FormEvent) {
    e.preventDefault()
    await api.post('/fees/payments', {
      student_id: Number(paymentForm.student_id),
      amount: Number(paymentForm.amount),
      status: paymentForm.status,
      method: paymentForm.method || null,
      payment_date: paymentForm.payment_date || null,
    })
    setShowPaymentModal(false)
    setPaymentForm(emptyPayment)
    load()
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl">Fees</h1>
          <p className="text-ink/50 mt-1">Fee structures and payment tracking.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowStructureModal(true)} className="border border-forest-700 text-forest-700 rounded-md px-4 py-2 text-sm font-medium hover:bg-forest-50">
            New structure
          </button>
          <button onClick={() => setShowPaymentModal(true)} className="bg-forest-700 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-forest-600">
            Record payment
          </button>
        </div>
      </div>

      <h2 className="font-display text-lg mt-8 mb-3">Fee structures</h2>
      <div className="bg-white border border-forest-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forest-50 text-ink/60 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Class</th>
              <th className="text-left px-4 py-3">Term</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Due date</th>
            </tr>
          </thead>
          <tbody>
            {structures.map((s) => (
              <tr key={s.id} className="border-t border-forest-50">
                <td className="px-4 py-3">{className(s.class_id)}</td>
                <td className="px-4 py-3">{s.term}</td>
                <td className="px-4 py-3">${Number(s.amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-ink/60">{s.due_date || '—'}</td>
              </tr>
            ))}
            {structures.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-ink/40">No fee structures defined yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <h2 className="font-display text-lg mt-8 mb-3">Payments</h2>
      <div className="bg-white border border-forest-100 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-forest-50 text-ink/60 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-4 py-3">Student</th>
              <th className="text-left px-4 py-3">Amount</th>
              <th className="text-left px-4 py-3">Method</th>
              <th className="text-left px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((p) => (
              <tr key={p.id} className="border-t border-forest-50">
                <td className="px-4 py-3">{studentName(p.student_id)}</td>
                <td className="px-4 py-3">${Number(p.amount).toLocaleString()}</td>
                <td className="px-4 py-3 text-ink/60 capitalize">{p.method?.replace('_', ' ') || '—'}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
            {payments.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-ink/40">No payments recorded yet.</td></tr>}
          </tbody>
        </table>
      </div>

      {showStructureModal && (
        <Modal title="New fee structure" onClose={() => setShowStructureModal(false)}>
          <form onSubmit={createStructure} className="space-y-3">
            <select required value={structureForm.class_id} onChange={(e) => setStructureForm({ ...structureForm, class_id: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm">
              <option value="">Select class</option>
              {classes.map((c) => <option key={c.id} value={c.id}>{c.name}{c.section ? ' - ' + c.section : ''}</option>)}
            </select>
            <input required placeholder="Term (e.g. Term 1)" value={structureForm.term} onChange={(e) => setStructureForm({ ...structureForm, term: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input required type="number" placeholder="Amount" value={structureForm.amount} onChange={(e) => setStructureForm({ ...structureForm, amount: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <input type="date" value={structureForm.due_date} onChange={(e) => setStructureForm({ ...structureForm, due_date: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <button className="w-full bg-forest-700 text-white rounded-md py-2.5 font-medium hover:bg-forest-600">Save structure</button>
          </form>
        </Modal>
      )}

      {showPaymentModal && (
        <Modal title="Record payment" onClose={() => setShowPaymentModal(false)}>
          <form onSubmit={createPayment} className="space-y-3">
            <select required value={paymentForm.student_id} onChange={(e) => setPaymentForm({ ...paymentForm, student_id: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm">
              <option value="">Select student</option>
              {students.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.admission_no})</option>)}
            </select>
            <input required type="number" placeholder="Amount" value={paymentForm.amount} onChange={(e) => setPaymentForm({ ...paymentForm, amount: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <select value={paymentForm.status} onChange={(e) => setPaymentForm({ ...paymentForm, status: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm">
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
            <select value={paymentForm.method} onChange={(e) => setPaymentForm({ ...paymentForm, method: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm">
              <option value="">Payment method</option>
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="bank_transfer">Bank transfer</option>
              <option value="online">Online</option>
            </select>
            <input type="date" value={paymentForm.payment_date} onChange={(e) => setPaymentForm({ ...paymentForm, payment_date: e.target.value })} className="w-full border border-ink/15 rounded-md px-3 py-2 text-sm" />
            <button className="w-full bg-forest-700 text-white rounded-md py-2.5 font-medium hover:bg-forest-600">Save payment</button>
          </form>
        </Modal>
      )}
    </div>
  )
}
