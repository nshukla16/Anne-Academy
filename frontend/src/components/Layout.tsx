import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const navItems = [
  { to: '/', label: 'Overview', end: true },
  { to: '/leads', label: 'Admissions Pipeline' },
  { to: '/students', label: 'Students' },
  { to: '/teachers', label: 'Faculty' },
  { to: '/classes', label: 'Classes' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/fees', label: 'Fees' },
]

export default function Layout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 shrink-0 bg-forest-800 text-forest-50 flex flex-col">
        <div className="px-6 py-7 border-b border-forest-700">
          <p className="font-display text-2xl leading-tight">Brightleaf</p>
          <p className="text-xs uppercase tracking-wide text-forest-300 mt-1">School Records &amp; CRM</p>
        </div>
        <nav className="flex-1 px-3 py-5 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-sm transition-colors ${
                  isActive
                    ? 'bg-forest-700 text-white'
                    : 'text-forest-200 hover:bg-forest-700/60 hover:text-white'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-4 border-t border-forest-700 text-sm">
          <p className="text-forest-100">{user?.name}</p>
          <p className="text-forest-400 text-xs capitalize">{user?.role}</p>
          <button
            onClick={handleLogout}
            className="mt-3 text-xs text-forest-300 hover:text-white underline underline-offset-2"
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="flex-1 bg-paper">
        <div className="max-w-6xl mx-auto px-8 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
