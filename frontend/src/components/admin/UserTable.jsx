import React, { useState } from 'react';

const allUsers = [
  { id: 1, name: 'Priya Sharma',    email: 'priya@dev.io',    role: 'Developer', score: 920, status: 'Active'    },
  { id: 2, name: 'Arjun Mehta',     email: 'arjun@dev.io',    role: 'Developer', score: 870, status: 'Active'    },
  { id: 3, name: 'Sara El-Amin',    email: 'sara@hire.io',    role: 'Recruiter', score: null, status: 'Active'   },
  { id: 4, name: 'Carlos Ruiz',     email: 'carlos@dev.io',   role: 'Developer', score: 695, status: 'Suspended' },
  { id: 5, name: 'Emily Zhang',     email: 'emily@dev.io',    role: 'Developer', score: 885, status: 'Active'    },
  { id: 6, name: 'Omar Farooq',     email: 'omar@dev.io',     role: 'Developer', score: 740, status: 'Active'    },
  { id: 7, name: 'Nadia Petrov',    email: 'nadia@hire.io',   role: 'Recruiter', score: null, status: 'Active'   },
  { id: 8, name: 'Liu Wei',         email: 'liu@dev.io',      role: 'Developer', score: 760, status: 'Suspended' },
];

const UserTable = () => {
  const [users, setUsers] = useState(allUsers);
  const [roleFilter, setRoleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');

  const toggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' }
          : u
      )
    );
  };

  const deleteUser = (id) => setUsers((prev) => prev.filter((u) => u.id !== id));

  const filtered = users.filter((u) => {
    const roleMatch   = roleFilter   === 'All' || u.role   === roleFilter;
    const statusMatch = statusFilter === 'All' || u.status === statusFilter;
    return roleMatch && statusMatch;
  });

  return (
    <div className="bg-[#111] border border-white/10 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-white/5">
        <div>
          <h2 className="text-sm font-semibold text-white">User Management</h2>
          <p className="text-xs text-gray-600 mt-0.5">{filtered.length} users</p>
        </div>
        <div className="flex gap-2">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-[#0d0d0d] border border-white/10 text-gray-400 text-xs rounded-md px-3 py-1.5 outline-none"
          >
            {['All', 'Developer', 'Recruiter'].map((r) => (
              <option key={r} value={r}>{r === 'All' ? 'All Roles' : r}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#0d0d0d] border border-white/10 text-gray-400 text-xs rounded-md px-3 py-1.5 outline-none"
          >
            {['All', 'Active', 'Suspended'].map((s) => (
              <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs min-w-[600px]">
          <thead>
            <tr className="text-gray-600 border-b border-white/5">
              <th className="py-2.5 pl-5 pr-4 text-left font-medium">Name</th>
              <th className="py-2.5 pr-4 text-left font-medium">Role</th>
              <th className="py-2.5 pr-4 text-left font-medium">Status</th>
              <th className="py-2.5 pr-4 text-left font-medium hidden md:table-cell">Score</th>
              <th className="py-2.5 pr-5 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((user) => (
              <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                <td className="py-3 pl-5 pr-4">
                  <p className="text-gray-200 font-medium">{user.name}</p>
                  <p className="text-gray-600">{user.email}</p>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    user.role === 'Developer'
                      ? 'bg-blue-400/10 text-blue-400'
                      : 'bg-purple-400/10 text-purple-400'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 pr-4">
                  <span className={`text-xs px-2 py-0.5 rounded font-medium ${
                    user.status === 'Active'
                      ? 'bg-green-400/10 text-green-400'
                      : 'bg-red-400/10 text-red-400'
                  }`}>
                    {user.status}
                  </span>
                </td>
                <td className="py-3 pr-4 hidden md:table-cell text-gray-400">
                  {user.score ?? '—'}
                </td>
                <td className="py-3 pr-5">
                  <div className="flex items-center justify-end gap-2">
                    <button className="text-xs text-blue-400 hover:underline">View</button>
                    <button
                      onClick={() => toggleStatus(user.id)}
                      className={`text-xs hover:underline ${
                        user.status === 'Active' ? 'text-yellow-400' : 'text-green-400'
                      }`}
                    >
                      {user.status === 'Active' ? 'Suspend' : 'Restore'}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="text-xs text-red-400 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserTable;
