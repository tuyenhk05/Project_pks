import React from 'react';
import Navbar from './Navbar';

const ClientLayout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4">
          <p>© 2026 PKS Course & Enrollment Portal. Intern Fullstack Developer Test Application.</p>
        </div>
      </footer>
    </div>
  );
};

export default ClientLayout;
