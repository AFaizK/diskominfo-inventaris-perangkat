import React from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from '@idds/react';
import { IconLogout } from '@tabler/icons-react';

const linkClass = ({ isActive }) =>
  `rounded-md px-3 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
    isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
  }`;

export default function Layout({ onLogout, children }) {
  return (
    <div className="min-h-screen bg-gray-50 text-left">
      <nav className="bg-white border-b shadow-sm">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-lg font-bold text-gray-800">Diskominfo CRUD</span>
            <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
            <NavLink to="/inventaris" className={linkClass}>Inventaris</NavLink>
          </div>
          <Button hierarchy="secondary" size="sm" onClick={onLogout} prefixIcon={<IconLogout size={16} />}>
            Keluar
          </Button>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}
