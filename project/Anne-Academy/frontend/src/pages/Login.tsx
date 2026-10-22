import { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('admin@school.com')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Unable to sign in. Check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-forest-800 px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <p className="font-display text-4xl text-white">Brightleaf</p>
          <p className="text-forest-300 text-sm mt-1 uppercase tracking-wide">School Records &amp; CRM</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-8 shadow-xl">
          <h1 className="font-display text-xl mb-6">Sign in to your workspace</h1>
          {error && (
            <p className="mb-4 text-sm text-brick bg-brick/10 rounded px-3 py-2">{error}</p>
          )}
          <label className="block text-sm mb-1 text-ink/70">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/15 rounded-md px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <label className="block text-sm mb-1 text-ink/70">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/15 rounded-md px-3 py-2 mb-6 focus:outline-none focus:ring-2 focus:ring-forest-500"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-forest-700 text-white rounded-md py-2.5 font-medium hover:bg-forest-600 transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
          <p className="text-xs text-ink/40 mt-4 text-center">
            Default admin: admin@school.com / Admin@123
          </p>
        </form>
      </div>
    </div>
  )
}
