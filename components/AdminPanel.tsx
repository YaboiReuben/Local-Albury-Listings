
import React, { useState, useEffect } from 'react';
import { db } from '../services/database';
import { BusinessListing, TierPassword, TierType } from '../types';
import { ADMIN_PASSWORD } from '../constants';
import { useNavigate } from 'react-router-dom';

const AdminPanel: React.FC = () => {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'passwords'>('pending');
  const [pending, setPending] = useState<BusinessListing[]>([]);
  const [approved, setApproved] = useState<BusinessListing[]>([]);
  const [passwords, setPasswords] = useState<TierPassword[]>([]);
  const navigate = useNavigate();

  // New Password State
  const [newUsername, setNewUsername] = useState('');
  const [newTier, setNewTier] = useState<TierType>(TierType.MEDIUM);
  const [newUserPass, setNewUserPass] = useState('');

  const loadData = async () => {
    const [p, a, pw] = await Promise.all([
      db.getPendingListings(), 
      db.getApprovedListings(true), // Include private listings for admin
      db.getUserPasswords()
    ]);
    setPending(p);
    setApproved(a);
    setPasswords(pw);
  };

  useEffect(() => {
    if (authed) loadData();
  }, [authed, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
    } else {
      alert("Unauthorized Access");
      navigate('/');
    }
  };

  const approveListing = async (id: string) => {
    await db.approveListing(id);
    loadData();
  };

  const togglePrivateStatus = async (id: string) => {
    await db.togglePrivate(id);
    loadData();
  };

  const rejectListing = async (id: string) => {
    await db.rejectListing(id);
    loadData();
  };

  const deleteApprovedListing = async (id: string) => {
    if (window.confirm("Are you sure you want to remove this approved listing?")) {
      await db.deleteListing(id);
      loadData();
    }
  };

  const createPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername || !newUserPass) return;
    await db.addPassword({
      username: newUsername,
      tier: newTier,
      password: newUserPass
    });
    setNewUsername('');
    setNewUserPass('');
    loadData();
  };

  const deletePassword = async (id: string) => {
    await db.deletePassword(id);
    loadData();
  };

  if (!authed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 w-full max-w-md">
          <h2 className="text-2xl font-bold mb-6 text-center">Admin Portal</h2>
          <input 
            autoFocus
            type="password"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all outline-none mb-4"
            placeholder="Enter Admin Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-black transition-all">
            Unlock Dashboard
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500">Manage your local business ecosystem.</p>
        </div>
        <div className="flex bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${activeTab === 'pending' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Pending ({pending.length})
          </button>
          <button 
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${activeTab === 'approved' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Approved ({approved.length})
          </button>
          <button 
            onClick={() => setActiveTab('passwords')}
            className={`px-4 py-2 rounded-lg font-medium transition-all text-sm sm:text-base ${activeTab === 'passwords' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500'}`}
          >
            Passwords
          </button>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="text-gray-400 hover:text-red-500 font-medium"
        >
          Exit Dashboard
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="grid grid-cols-1 gap-6">
          {pending.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 text-gray-400">
              No pending listings to review.
            </div>
          ) : (
            pending.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                <img src={item.logo} className="w-32 h-32 rounded-2xl object-cover" />
                <div className="flex-grow">
                  <div className="flex justify-between">
                    <h3 className="text-xl font-bold">{item.name}</h3>
                    <span className="px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit">{item.tier}</span>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{item.email} • {item.address}</p>
                  <p className="text-gray-600 mt-3 text-sm line-clamp-2">{item.description}</p>
                </div>
                <div className="flex md:flex-col gap-2 justify-center">
                  <button 
                    onClick={() => approveListing(item.id)}
                    className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm transition-all"
                  >
                    Approve
                  </button>
                  <button 
                    onClick={() => rejectListing(item.id)}
                    className="px-6 py-2 bg-red-100 hover:bg-red-200 text-red-600 rounded-xl font-bold text-sm transition-all"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'approved' && (
        <div className="grid grid-cols-1 gap-6">
          {approved.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 text-gray-400">
              No approved listings found.
            </div>
          ) : (
            approved.map(item => (
              <div key={item.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-6">
                <img src={item.logo} className="w-32 h-32 rounded-2xl object-cover" />
                <div className="flex-grow">
                  <div className="flex justify-between items-start">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-xl font-bold">{item.name}</h3>
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit">{item.tier}</span>
                        {item.isPrivate && (
                          <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit">Private</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm mt-1">{item.email} • {item.address}</p>
                  <p className="text-gray-400 text-xs mt-1">Expires: {new Date(item.expiresAt).toLocaleDateString()}</p>
                  <p className="text-gray-600 mt-3 text-sm line-clamp-2">{item.description}</p>
                </div>
                <div className="flex md:flex-col gap-2 justify-center min-w-[140px]">
                  <button 
                    onClick={() => togglePrivateStatus(item.id)}
                    className={`px-4 py-2 rounded-xl font-bold text-sm transition-all border ${
                      item.isPrivate 
                        ? 'bg-purple-600 text-white hover:bg-purple-700' 
                        : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-200'
                    }`}
                  >
                    {item.isPrivate ? 'Make Public' : 'Make Private'}
                  </button>
                  <button 
                    onClick={() => deleteApprovedListing(item.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm transition-all shadow-sm"
                  >
                    Delete Post
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'passwords' && (
        <div className="space-y-8">
          <form onSubmit={createPassword} className="bg-blue-600 p-8 rounded-3xl text-white">
            <h3 className="text-xl font-bold mb-4">Assign New Tier Password</h3>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <input 
                placeholder="Username (e.g. John Doe)"
                className="px-4 py-2 bg-white/10 rounded-xl outline-none focus:bg-white/20 transition-all placeholder:text-white/50"
                value={newUsername}
                onChange={e => setNewUsername(e.target.value)}
              />
              <select 
                className="px-4 py-2 bg-white/10 rounded-xl outline-none focus:bg-white/20 transition-all text-white"
                value={newTier}
                onChange={e => setNewTier(e.target.value as TierType)}
              >
                <option value={TierType.MEDIUM} className="text-gray-900">Medium</option>
                <option value={TierType.BIG} className="text-gray-900">Big</option>
                <option value={TierType.MASSIVE} className="text-gray-900">Massive</option>
              </select>
              <input 
                placeholder="Assign Password"
                className="px-4 py-2 bg-white/10 rounded-xl outline-none focus:bg-white/20 transition-all placeholder:text-white/50"
                value={newUserPass}
                onChange={e => setNewUserPass(e.target.value)}
              />
              <button className="bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all">
                Add User Access
              </button>
            </div>
          </form>

          <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 font-bold text-sm text-gray-900">User</th>
                    <th className="px-6 py-4 font-bold text-sm text-gray-900">Tier</th>
                    <th className="px-6 py-4 font-bold text-sm text-gray-900">Password</th>
                    <th className="px-6 py-4 font-bold text-sm text-gray-900">Status</th>
                    <th className="px-6 py-4 font-bold text-sm text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {passwords.map(pw => (
                    <tr key={pw.id}>
                      <td className="px-6 py-4 text-sm">{pw.username}</td>
                      <td className="px-6 py-4 text-sm font-bold text-blue-600">{pw.tier}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-400">{pw.password}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-[10px] font-black uppercase">Active</span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button 
                          onClick={() => deletePassword(pw.id)}
                          className="text-red-400 hover:text-red-600 font-bold"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                  {passwords.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-6 py-10 text-center text-gray-400">No passwords assigned.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
