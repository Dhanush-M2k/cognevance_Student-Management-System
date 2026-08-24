
const API_BASE = '/api/students';

const form = document.getElementById('studentForm');
const formTitle = document.getElementById('formTitle');
const studentIdField = document.getElementById('studentId');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const tableBody = document.getElementById('studentTableBody');
const emptyState = document.getElementById('emptyState');
const alertBox = document.getElementById('alertBox');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const refreshBtn = document.getElementById('refreshBtn');

const fields = ['firstName', 'lastName', 'email', 'phone', 'course', 'dateOfBirth', 'yearOfStudy', 'gpa'];

document.addEventListener('DOMContentLoaded', loadStudents);
form.addEventListener('submit', handleSubmit);
cancelBtn.addEventListener('click', resetForm);
searchBtn.addEventListener('click', handleSearch);
refreshBtn.addEventListener('click', () => { searchInput.value = ''; loadStudents(); });
searchInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); handleSearch(); } });

async function loadStudents() {
  try {
    const res = await fetch(API_BASE);
    if (!res.ok) throw new Error('Failed to load students');
    const students = await res.json();
    renderTable(students);
  } catch (err) {
    showAlert(err.message, true);
  }
}

async function handleSearch() {
  const keyword = searchInput.value.trim();
  if (!keyword) { loadStudents(); return; }
  try {
    const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(keyword)}`);
    if (!res.ok) throw new Error('Search failed');
    const students = await res.json();
    renderTable(students);
  } catch (err) {
    showAlert(err.message, true);
  }
}

function renderTable(students) {
  tableBody.innerHTML = '';

  if (!students || students.length === 0) {
    emptyState.classList.remove('hidden');
    return;
  }
  emptyState.classList.add('hidden');

  students.forEach((s) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${s.id}</td>
      <td>${escapeHtml(s.firstName)} ${escapeHtml(s.lastName)}</td>
      <td>${escapeHtml(s.email)}</td>
      <td>${escapeHtml(s.phone || '—')}</td>
      <td>${escapeHtml(s.course)}</td>
      <td>${s.dateOfBirth || '—'}</td>
      <td>${s.yearOfStudy ?? '—'}</td>
      <td>${s.gpa ?? '—'}</td>
      <td class="actions-cell">
        <button class="btn-edit" data-id="${s.id}">Edit</button>
        <button class="btn-danger" data-id="${s.id}">Delete</button>
      </td>
    `;
    tr.querySelector('.btn-edit').addEventListener('click', () => editStudent(s));
    tr.querySelector('.btn-danger').addEventListener('click', () => deleteStudent(s.id));
    tableBody.appendChild(tr);
  });
}

async function handleSubmit(e) {
  e.preventDefault();
  clearFieldErrors();

  const payload = {
    firstName: val('firstName'),
    lastName: val('lastName'),
    email: val('email'),
    phone: val('phone'),
    course: val('course'),
    dateOfBirth: val('dateOfBirth'),
    yearOfStudy: val('yearOfStudy') ? Number(val('yearOfStudy')) : null,
    gpa: val('gpa') ? Number(val('gpa')) : null,
  };

  const id = studentIdField.value;
  const isEdit = !!id;
  const url = isEdit ? `${API_BASE}/${id}` : API_BASE;
  const method = isEdit ? 'PUT' : 'POST';

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      if (errBody.fields) {
        showFieldErrors(errBody.fields);
        showAlert('Please fix the highlighted fields.', true);
      } else {
        showAlert(errBody.message || 'Request failed', true);
      }
      return;
    }

    showAlert(isEdit ? 'Student updated successfully.' : 'Student added successfully.');
    resetForm();
    loadStudents();
  } catch (err) {
    showAlert(err.message, true);
  }
}

function editStudent(s) {
  studentIdField.value = s.id;
  document.getElementById('firstName').value = s.firstName || '';
  document.getElementById('lastName').value = s.lastName || '';
  document.getElementById('email').value = s.email || '';
  document.getElementById('phone').value = s.phone || '';
  document.getElementById('course').value = s.course || '';
  document.getElementById('dateOfBirth').value = s.dateOfBirth || '';
  document.getElementById('yearOfStudy').value = s.yearOfStudy ?? '';
  document.getElementById('gpa').value = s.gpa ?? '';

  formTitle.textContent = `Edit Student #${s.id}`;
  submitBtn.textContent = 'Save Changes';
  cancelBtn.classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function deleteStudent(id) {
  if (!confirm('Delete this student record? This cannot be undone.')) return;
  try {
    const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
    if (!res.ok && res.status !== 204) throw new Error('Delete failed');
    showAlert('Student deleted.');
    loadStudents();
  } catch (err) {
    showAlert(err.message, true);
  }
}

function resetForm() {
  form.reset();
  studentIdField.value = '';
  formTitle.textContent = 'Add New Student';
  submitBtn.textContent = 'Add Student';
  cancelBtn.classList.add('hidden');
  clearFieldErrors();
}

function val(id) { return document.getElementById(id).value.trim(); }

function showAlert(message, isError = false) {
  alertBox.textContent = message;
  alertBox.classList.remove('hidden', 'error');
  if (isError) alertBox.classList.add('error');
  clearTimeout(showAlert._t);
  showAlert._t = setTimeout(() => alertBox.classList.add('hidden'), 4000);
}

function showFieldErrors(fieldErrors) {
  Object.entries(fieldErrors).forEach(([field, message]) => {
    const el = document.getElementById(`err-${field}`);
    if (el) el.textContent = message;
  });
}

function clearFieldErrors() {
  fields.forEach((f) => {
    const el = document.getElementById(`err-${f}`);
    if (el) el.textContent = '';
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}
