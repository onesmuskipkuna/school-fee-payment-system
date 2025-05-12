import React, { useEffect, useState } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const educationLevels = ['Primary', 'Junior Secondary'];
const primaryClasses = ['PG', 'PP1', 'PP2', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
const juniorHighClasses = ['Grade 7', 'Grade 8', 'Grade 9', 'Grade 10'];

function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    parentGuardianName: '',
    phoneNumber: '',
    educationLevel: '',
    className: '',
  });
  const [filteredClasses, setFilteredClasses] = useState([]);

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    if (form.educationLevel === 'Primary') {
      setFilteredClasses(primaryClasses);
      setForm(prev => ({ ...prev, className: '' }));
    } else if (form.educationLevel === 'Junior Secondary') {
      setFilteredClasses(juniorHighClasses);
      setForm(prev => ({ ...prev, className: '' }));
    } else {
      setFilteredClasses([]);
      setForm(prev => ({ ...prev, className: '' }));
    }
  }, [form.educationLevel]);

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/students');
      setStudents(res.data);
    } catch (error) {
      alert('Failed to fetch students');
    }
  };

  const handleInputChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      await axios.post('/api/students', form);
      fetchStudents();
      setForm({
        firstName: '',
        lastName: '',
        parentGuardianName: '',
        phoneNumber: '',
        educationLevel: '',
        className: '',
      });
    } catch (error) {
      alert('Failed to add student');
    }
  };

  const handleDelete = async admissionNumber => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;
    try {
      await axios.delete(\`/api/students/\${admissionNumber}\`);
      fetchStudents();
    } catch (error) {
      alert('Failed to delete student');
    }
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(students);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students.xlsx');
  };

  const handleImport = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async evt => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      try {
        for (const student of jsonData) {
          await axios.post('/api/students', student);
        }
        fetchStudents();
      } catch (error) {
        alert('Failed to import students');
      }
    };
    reader.readAsArrayBuffer(file);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Students</h1>

      <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            value={form.firstName}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            value={form.lastName}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="parentGuardianName"
            placeholder="Parent/Guardian Name"
            value={form.parentGuardianName}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={form.phoneNumber}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          />
          <select
            name="educationLevel"
            value={form.educationLevel}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
          >
            <option value="">Select Education Level</option>
            {educationLevels.map(level => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
          <select
            name="className"
            value={form.className}
            onChange={handleInputChange}
            required
            className="border p-2 rounded"
            disabled={!form.educationLevel}
          >
            <option value="">Select Class</option>
            {filteredClasses.map(cls => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        <div className="mt-4">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Add Student
          </button>
        </div>
      </form>

      <div className="mb-4 flex justify-between items-center">
        <div>
          <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition">
            Import Excel
            <input type="file" accept=".xlsx,.xls" onChange={handleImport} className="hidden" />
          </label>
        </div>
        <button
          onClick={handleExport}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          Export Excel
        </button>
      </div>

      <table className="w-full bg-white rounded shadow overflow-hidden">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3 text-left">Admission Number</th>
            <th className="p-3 text-left">First Name</th>
            <th className="p-3 text-left">Last Name</th>
            <th className="p-3 text-left">Parent/Guardian</th>
            <th className="p-3 text-left">Phone Number</th>
            <th className="p-3 text-left">Education Level</th>
            <th className="p-3 text-left">Class</th>
            <th className="p-3 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => (
            <tr key={student.admissionNumber} className="border-t">
              <td className="p-3">{student.admissionNumber}</td>
              <td className="p-3">{student.firstName}</td>
              <td className="p-3">{student.lastName}</td>
              <td className="p-3">{student.parentGuardianName}</td>
              <td className="p-3">{student.phoneNumber}</td>
              <td className="p-3">{student.educationLevel}</td>
              <td className="p-3">{student.className}</td>
              <td className="p-3">
                <button
                  onClick={() => handleDelete(student.admissionNumber)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {students.length === 0 && (
            <tr>
              <td colSpan="8" className="p-3 text-center text-gray-500">
                No students found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Students;
