'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';

export default function AdminRolesPage() {
  const { user, setRole } = useAuth();

  const [staffList, setStaffList] = useState([
    { id: '1', name: 'അരുൺ കുമാർ', email: 'arun@theprofit.in', role: 'admin', designation: 'ചീഫ് എഡിറ്റർ' },
    { id: '2', name: 'പ്രിയ നായർ', email: 'priya@theprofit.in', role: 'editor', designation: 'സീനിയർ ബിസിനസ് എഡിറ്റർ' },
    { id: '3', name: 'രേഷ്മ ജോർജ്ജ്', email: 'reshma@theprofit.in', role: 'author', designation: 'ടെക് & സ്റ്റാർട്ടപ്പ് കറസ്‌പോണ്ടന്റ്' },
    { id: '4', name: 'ഡെസ്ക് ടീം', email: 'desk@theprofit.in', role: 'editor', designation: 'ന്യൂസ് ഡെസ്ക്' },
  ]);

  const auditLogs = [
    { time: '10 മിനിറ്റ് മുൻപ്', user: 'അരുൺ കുമാർ', action: 'പുതിയ ലേഖനം പ്രസിദ്ധീകരിച്ചു ("കേരള സ്വർണവില പുതിയ റെക്കോർഡിൽ")' },
    { time: '1 മണിക്കൂർ മുൻപ്', user: 'പ്രിയ നായർ', action: 'ഹോം സ്ലോട്ട് അപ്ഡേറ്റ് ചെയ്തു (Hero -> art-1)' },
    { time: '3 മണിക്കൂർ മുൻപ്', user: 'രേഷ്മ ജോർജ്ജ്', action: 'പുതിയ ഡ്രാഫ്റ്റ് സമർപ്പിച്ചു ("ഐടി കയറ്റുമതി റിപ്പോർട്ട്")' },
    { time: 'ഇന്നലെ വൈകുന്നേരം', user: 'അരുൺ കുമാർ', action: 'സ്വർണ നിരക്ക് അപ്ഡേറ്റ് ചെയ്തു (22K: ₹7,350/g)' },
  ];

  const handleRoleChange = (id: string, newRole: string) => {
    setStaffList(prev => prev.map(s => s.id === id ? { ...s, role: newRole } : s));
  };

  return (
    <div className="space-y-8">
      <div className="border-b border-border pb-4">
        <h1 className="text-xl md:text-2xl font-bold font-reading text-text">
          സ്റ്റാഫ് റോളുകളും ഓഡിറ്റ് ലോഗും (Roles &amp; Editorial Workflow)
        </h1>
        <p className="text-xs text-text-muted">
          എഡിറ്റോറിയൽ ടീമിലെ അംഗങ്ങളുടെ അധികാര പരിധികളും (Admin, Editor, Author) സമീപകാല നടപടികളും.
        </p>
      </div>

      {/* Role Definitions Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">👑</span>
            <span className="text-sm font-bold text-accent">Admin (അഡ്മിൻ)</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            പൂർണ്ണ നിയന്ത്രണം: പുതിയ വിഭാഗങ്ങൾ ഉണ്ടാക്കുക, റോളുകൾ നൽകുക, സ്വർണ നിരക്കുകൾ നിശ്ചയിക്കുക, എല്ലാ ലേഖനങ്ങളും തിരുത്തുക.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">✍️</span>
            <span className="text-sm font-bold text-text">Editor (എഡിറ്റർ)</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            ലേഖനങ്ങൾ പരിശോധിക്കുക, അന്തിമ അംഗീകാരം നൽകി പ്രസിദ്ധീകരിക്കുക, ഹോം സ്ലോട്ടുകൾ മാറ്റുക, കമന്റുകൾ മോഡറേറ്റ് ചെയ്യുക.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-4 shadow-card">
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-lg">📝</span>
            <span className="text-sm font-bold text-text">Author (ലേഖകൻ)</span>
          </div>
          <p className="text-xs text-text-muted leading-relaxed">
            വാർത്തകളും റിപ്പോർട്ടുകളും എഴുതുക, സ്വന്തം ഡ്രാഫ്റ്റുകൾ എഡിറ്റ് ചെയ്യുക, എഡിറ്റർ പരിശോധനയ്ക്കായി സമർപ്പിക്കുക.
          </p>
        </div>
      </div>

      {/* Staff Management Table */}
      <div className="bg-surface border border-border rounded-xl overflow-hidden shadow-card">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-bold font-reading text-text">
            എഡിറ്റോറിയൽ ടീം അംഗങ്ങൾ (Team Members)
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-surface-raised text-text-muted uppercase text-[10px] tracking-wider border-b border-border">
              <tr>
                <th className="py-3 px-4">പേര് (Name)</th>
                <th className="py-3 px-4">ഇമെയിൽ</th>
                <th className="py-3 px-4">പദവി (Designation)</th>
                <th className="py-3 px-4">റോൾ (Permission)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {staffList.map((staff) => (
                <tr key={staff.id} className="hover:bg-surface-raised/50">
                  <td className="py-3 px-4 font-bold text-text font-reading">
                    {staff.name}
                  </td>
                  <td className="py-3 px-4 text-text-muted font-mono">
                    {staff.email}
                  </td>
                  <td className="py-3 px-4 text-text">
                    {staff.designation}
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={staff.role}
                      onChange={(e) => handleRoleChange(staff.id, e.target.value)}
                      className="bg-surface-raised border border-border-input rounded px-2.5 py-1 text-xs font-semibold text-text"
                    >
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="author">Author</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Audit Log */}
      <div className="bg-surface border border-border rounded-xl p-5 shadow-card space-y-3">
        <h2 className="text-sm font-bold font-reading text-text border-b border-border pb-2">
          📋 എഡിറ്റോറിയൽ ആക്ഷൻ ലോഗ് (Audit Log)
        </h2>
        <div className="space-y-2.5 text-xs">
          {auditLogs.map((log, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-1.5 px-3 rounded bg-surface-raised border border-border/60 gap-1">
              <div className="flex items-center space-x-2">
                <span className="font-bold text-accent font-reading">{log.user}:</span>
                <span className="text-text">{log.action}</span>
              </div>
              <span className="text-[10px] text-text-muted font-mono whitespace-nowrap">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
