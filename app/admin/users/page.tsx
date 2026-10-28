'use client';

import React, { useState, useEffect } from 'react';
import { StaffUser, StaffRole, StaffPermissions } from '@/lib/types';

export default function AdminStaffUsersPage() {
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // New staff form state
  const [newStaff, setNewStaff] = useState<{
    display_name: string;
    email: string;
    role: StaffRole;
    permissions: StaffPermissions;
  }>({
    display_name: '',
    email: '',
    role: 'author',
    permissions: {
      can_publish: false,
      can_manage_ads: false,
      can_manage_categories: false,
      can_manage_users: false,
      can_moderate_comments: true,
      can_manage_business: false,
    },
  });

  const fetchUsers = () => {
    fetch('/api/v1/staff')
      .then((res) => res.json())
      .then((data) => {
        if (data.users) setUsers(data.users);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Failed to load staff users:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleTogglePermission = async (userId: string, permKey: keyof StaffPermissions, currentVal: boolean) => {
    const user = users.find((u) => u.id === userId);
    if (!user) return;

    const updatedPermissions = {
      ...user.permissions,
      [permKey]: !currentVal,
    };

    // Optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, permissions: updatedPermissions } : u))
    );

    try {
      await fetch('/api/v1/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          permissions: updatedPermissions,
        }),
      });
      setSuccessMsg('അനുമതി വിജയകരമായി അപ്ഡേറ്റ് ചെയ്തു!');
      setTimeout(() => setSuccessMsg(''), 2500);
    } catch (err) {
      console.error('Failed to update permission:', err);
      fetchUsers(); // Revert on error
    }
  };

  const handleToggleStatus = async (userId: string, currentActive: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, is_active: !currentActive } : u))
    );

    try {
      await fetch('/api/v1/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: userId,
          is_active: !currentActive,
        }),
      });
      setSuccessMsg('സ്റ്റാഫ് സ്റ്റാറ്റസ് മാറ്റി!');
      setTimeout(() => setSuccessMsg(''), 2000);
    } catch (err) {
      console.error('Failed to toggle status:', err);
      fetchUsers();
    }
  };

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/v1/staff', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newStaff),
      });

      if (res.ok) {
        setShowAddModal(false);
        setNewStaff({
          display_name: '',
          email: '',
          role: 'author',
          permissions: {
            can_publish: false,
            can_manage_ads: false,
            can_manage_categories: false,
            can_manage_users: false,
            can_moderate_comments: true,
            can_manage_business: false,
          },
        });
        setSuccessMsg('പുതിയ സ്റ്റാഫ് യൂസറെ ചേർത്തു!');
        setTimeout(() => setSuccessMsg(''), 3000);
        fetchUsers();
      }
    } catch (err) {
      console.error('Failed to create staff:', err);
      alert('സ്റ്റാഫിനെ ചേർക്കുന്നതിൽ പിശക് സംഭവിച്ചു.');
    } finally {
      setSaving(false);
    }
  };

  const permissionLabels: Record<keyof StaffPermissions, string> = {
    can_publish: 'വാർത്ത പബ്ലിഷ് ചെയ്യാം (Publish)',
    can_manage_ads: 'പരസ്യങ്ങൾ ക്രമീകരിക്കാം (Ads)',
    can_manage_categories: 'വിഭാഗങ്ങൾ മാറ്റാം (Categories)',
    can_manage_users: 'യൂസേഴ്സ് അനുമതികൾ (Users)',
    can_moderate_comments: 'കമന്റുകൾ മോഡറേറ്റ് ചെയ്യാം (Comments)',
    can_manage_business: 'ഡയറക്ടറി / ജോബ്സ് (Business Hub)',
  };

  return (
    <div className="space-y-6">
      {/* Title & Action Bar */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-black font-reading text-text flex items-center gap-2">
            <span>👥</span>
            <span>സ്റ്റാഫ് യൂസേഴ്സ് &amp; അനുമതികൾ (Staff &amp; Permissions)</span>
          </h1>
          <p className="text-xs text-text-muted mt-1">
            എഡിറ്റർമാർക്കും ലേഖകർക്കും പരസ്യ മാനേജർമാർക്കും വ്യക്തിഗത അനുമതികൾ നിർണ്ണയിക്കുക.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-accent hover:opacity-90 text-white font-bold px-4 py-2 rounded-lg text-xs transition-all shadow-sm flex items-center space-x-1.5"
        >
          <span>✨</span>
          <span>+ പുതിയ സ്റ്റാഫിനെ ചേർക്കുക</span>
        </button>
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 px-4 py-2.5 rounded-lg text-xs font-bold flex items-center space-x-2">
          <span>✅</span>
          <span>{successMsg}</span>
        </div>
      )}

      {/* Staff Members Table */}
      <div className="bg-surface border border-border rounded-xl shadow-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <span className="text-xs font-bold text-text uppercase tracking-wider">
            ആകെ സ്റ്റാഫ് അംഗങ്ങൾ ({users.length})
          </span>
          <span className="text-[11px] text-text-muted">
            തത്സമയം അനുമതികൾ മാറ്റാൻ ചെക്ക്‌ബോക്സുകൾ ക്ലിക്ക് ചെയ്യുക
          </span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-text-muted">ഡാറ്റ ലഭ്യമാക്കുന്നു...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-surface-raised text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
                <tr>
                  <th className="py-3 px-4">സ്റ്റാഫ് പ്രൊഫൈൽ</th>
                  <th className="py-3 px-3">റോൾ</th>
                  <th className="py-3 px-3 text-center">പബ്ലിഷ്</th>
                  <th className="py-3 px-3 text-center">പരസ്യങ്ങൾ</th>
                  <th className="py-3 px-3 text-center">വിഭാഗങ്ങൾ</th>
                  <th className="py-3 px-3 text-center">യൂസേഴ്സ്</th>
                  <th className="py-3 px-3 text-center">ബിസിനസ്സ്</th>
                  <th className="py-3 px-4 text-right">സ്റ്റാറ്റസ്</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-surface-raised/50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-bold text-text font-reading">{u.display_name}</div>
                      <div className="text-[11px] text-text-muted font-mono">{u.email}</div>
                    </td>

                    <td className="py-3 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'super_admin'
                          ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                          : u.role === 'editor'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20'
                          : u.role === 'ad_manager'
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                          : 'bg-surface-raised text-text-muted border border-border'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={u.permissions?.can_publish || false}
                        onChange={() => handleTogglePermission(u.id, 'can_publish', u.permissions?.can_publish || false)}
                        className="rounded text-accent focus:ring-accent cursor-pointer"
                        title={permissionLabels.can_publish}
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={u.permissions?.can_manage_ads || false}
                        onChange={() => handleTogglePermission(u.id, 'can_manage_ads', u.permissions?.can_manage_ads || false)}
                        className="rounded text-accent focus:ring-accent cursor-pointer"
                        title={permissionLabels.can_manage_ads}
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={u.permissions?.can_manage_categories || false}
                        onChange={() => handleTogglePermission(u.id, 'can_manage_categories', u.permissions?.can_manage_categories || false)}
                        className="rounded text-accent focus:ring-accent cursor-pointer"
                        title={permissionLabels.can_manage_categories}
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={u.permissions?.can_manage_users || false}
                        onChange={() => handleTogglePermission(u.id, 'can_manage_users', u.permissions?.can_manage_users || false)}
                        className="rounded text-accent focus:ring-accent cursor-pointer"
                        title={permissionLabels.can_manage_users}
                      />
                    </td>

                    <td className="py-3 px-3 text-center">
                      <input
                        type="checkbox"
                        checked={u.permissions?.can_manage_business || false}
                        onChange={() => handleTogglePermission(u.id, 'can_manage_business', u.permissions?.can_manage_business || false)}
                        className="rounded text-accent focus:ring-accent cursor-pointer"
                        title={permissionLabels.can_manage_business}
                      />
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(u.id, !!u.is_active)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded transition-colors ${
                          u.is_active
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20'
                            : 'bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20'
                        }`}
                      >
                        {u.is_active ? 'Active (സജീവം)' : 'Suspended'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-surface border border-border rounded-xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-bold font-reading text-base text-text">
                പുതിയ സ്റ്റാഫ് യൂസറെ ചേർക്കുക (Add Staff User)
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-text-muted hover:text-text p-1 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateStaff} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-text mb-1">പൂർണ്ണ നാമം (Full Name)</label>
                <input
                  type="text"
                  required
                  value={newStaff.display_name}
                  onChange={(e) => setNewStaff({ ...newStaff, display_name: e.target.value })}
                  placeholder="ഉദാ: അഞ്ജലി നായർ"
                  className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">ഇമെയിൽ വിലാസം (Email)</label>
                <input
                  type="email"
                  required
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })}
                  placeholder="name@theprofit.in"
                  className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text focus:outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="block font-bold text-text mb-1">ഔദ്യോഗിക റോൾ (Role)</label>
                <select
                  value={newStaff.role}
                  onChange={(e) => {
                    const role = e.target.value as StaffRole;
                    const isSuper = role === 'super_admin';
                    const isEditor = role === 'editor';
                    setNewStaff({
                      ...newStaff,
                      role,
                      permissions: {
                        can_publish: isSuper || isEditor,
                        can_manage_ads: isSuper || role === 'ad_manager',
                        can_manage_categories: isSuper || isEditor,
                        can_manage_users: isSuper,
                        can_moderate_comments: true,
                        can_manage_business: isSuper || isEditor,
                      },
                    });
                  }}
                  className="w-full bg-surface-raised border border-border-input rounded-lg px-3 py-2 text-text font-semibold focus:outline-none focus:border-accent"
                >
                  <option value="author">ലേഖകൻ (Author / Reporter)</option>
                  <option value="editor">എഡിറ്റർ (Senior Editor)</option>
                  <option value="ad_manager">പരസ്യ മാനേജർ (Ad Operations Manager)</option>
                  <option value="super_admin">സൂപ്പർ അഡ്മിൻ (Super Admin)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-border">
                <label className="block font-bold text-text">അനുമതികൾ ക്രമീകരിക്കുക (Permissions):</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(Object.keys(permissionLabels) as (keyof StaffPermissions)[]).map((key) => (
                    <label key={key} className="flex items-center space-x-2 cursor-pointer bg-surface-raised p-2 rounded border border-border">
                      <input
                        type="checkbox"
                        checked={newStaff.permissions[key]}
                        onChange={(e) =>
                          setNewStaff({
                            ...newStaff,
                            permissions: {
                              ...newStaff.permissions,
                              [key]: e.target.checked,
                            },
                          })
                        }
                        className="rounded text-accent focus:ring-accent"
                      />
                      <span className="text-[11px] text-text font-medium">{permissionLabels[key]}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-lg bg-surface-raised hover:bg-border text-text font-semibold"
                >
                  റദ്ദാക്കുക
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-5 py-2 rounded-lg bg-accent hover:opacity-90 text-white font-bold"
                >
                  {saving ? 'ചേർക്കുന്നു...' : 'ചേർക്കുക'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
