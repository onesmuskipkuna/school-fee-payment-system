import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import FeeStructure from './pages/FeeStructure';
import Invoices from './pages/Invoices';
import Payments from './pages/Payments';
import Expenses from './pages/Expenses';
import Payroll from './pages/Payroll';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Dashboard />} />
        <Route path="/students" element={<Students />} />
        <Route path="/fee-structure" element={<FeeStructure />} />
        <Route path="/invoices" element={<Invoices />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/users" element={<Users />} />
      </Routes>
    </Router>
  );
}

export default App;
