import { getAllMissingPerson } from "../../firebase/firebaseDb.js";

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

function statusClass(status) {
  if (status === 'Found') return 'found';
  if (status === 'Closed') return 'closed';
  return 'still-missing';
}

function fullPhotoUrl(photo) {
  if (photo) return photo;
  return 'https://placehold.co/300x300?text=No+Photo';
}


const fetchAllMissingPersons = await getAllMissingPerson();
const allMissingPersons = Object.values(fetchAllMissingPersons)

const SAMPLE_PERSONS =  [
  {
    id: '1',
    name: 'Maria Santos',
    age: 24,
    sex: 'Female',
    location: 'Quezon City',
    status: 'Still Missing',
    lastSeen: '2026-05-12',
    photo: '',
    description: 'Last seen wearing a blue jacket near Commonwealth Avenue.'
  },
  {
    id: '2',
    name: 'Juan Dela Cruz',
    age: 35,
    sex: 'Male',
    location: 'Cebu City',
    status: 'Found',
    lastSeen: '2026-03-02',
    photo: '',
    description: 'Found safe with relatives in Mandaue.'
  },
  {
    id: '3',
    name: 'Angela Reyes',
    age: 17,
    sex: 'Female',
    location: 'Davao City',
    status: 'Closed',
    lastSeen: '2025-11-20',
    photo: '',
    description: 'Case closed after confirmation from local authorities.'
  }
];
console.log(SAMPLE_PERSONS)

// FEED logic
// Sample data lives here directly so the page works as pure frontend,
// with no fetch/API call and nothing that can throw a "backend" error.
// Replace this array (or the team's eventual data source) as needed.

let allPersons = [];
let activeStatus = 'All';

function loadPersons() {
  const grid = document.getElementById('cardsGrid');

  // safely read optional filter inputs (may not exist on every page)
  const searchEl = document.getElementById('searchInput');
  const locationEl = document.getElementById('locationInput');
  const sortEl = document.getElementById('sortInput');
  const search = searchEl ? String(searchEl.value).trim() : '';
  const location = locationEl ? String(locationEl.value) : '';
  const sort = sortEl ? String(sortEl.value) : '';

  if (!allPersons.length) {
    allPersons = SAMPLE_PERSONS;
  }

  let filtered = [...allPersons];
  if (search) {
    const query = search.toLowerCase();
    filtered = filtered.filter(p =>
      String(p.name || '').toLowerCase().includes(query) ||
      String(p.description || '').toLowerCase().includes(query) ||
      String(p.location || '').toLowerCase().includes(query)
    );
  }
  if (location) filtered = filtered.filter(p => p.location === location);
  if (activeStatus !== 'All') filtered = filtered.filter(p => p.status === activeStatus);
  if (sort === 'age') filtered.sort((a, b) => (Number(a.age) || 0) - (Number(b.age) || 0));
  else if (sort === 'lastSeen') filtered.sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen));

  renderCards(filtered);
  populateLocations(allPersons);
}

function populateLocations(persons) {
  const select = document.getElementById('locationInput');
  if (!select) return; // nothing to populate on pages without the location filter
  const current = select.value;
  const locations = [...new Set(persons.map(p => p.location).filter(Boolean))];
  select.innerHTML = '<option value="">Location</option>' +
    locations.map(loc => `<option value="${loc}">${loc}</option>`).join('');
  select.value = current;
}

function renderCards(persons) {
  const grid = document.getElementById('cardsGrid');
  if (persons.length === 0) {
    grid.innerHTML = '<div class="empty-state">No missing person reports found.</div>';
    return;
  }
  grid.innerHTML = persons.map(p => `
    <div class="person-card">
      <div class="person-photo-wrap">
        <img class="person-photo" src="${fullPhotoUrl(p.photo)}" alt="${p.name}">
        <span class="status-badge ${statusClass(p.status)}">${p.status}</span>
      </div>
      <div class="person-info">
        <h4>${p.name}</h4>
        <div class="meta">${p.age ? p.age + ' years old, ' : ''}${p.sex}</div>
        <div class="loc">📍 ${p.location}</div>
        <div class="seen">🕒 Last Seen: ${formatDate(p.lastSeen)}</div>
        <button class="view-btn" onclick="openModal('${p.id}')">View Details</button>
      </div>
    </div>
  `).join('');

  // animate cards 
  const cards = grid.querySelectorAll('.person-card');
  cards.forEach((c, i) => {

    c.classList.remove('is-visible');
    setTimeout(() => c.classList.add('is-visible'), 100 + i * 90);
  });
}

function openModal(id) {
  const p = allPersons.find(x => x.id === id);
  if (!p) return;
  document.getElementById('modalBox').innerHTML = `
    <span class="modal-close" onclick="closeModal()">✕</span>
    <img src="${fullPhotoUrl(p.photo)}" alt="${p.name}">
    <span class="status-badge ${statusClass(p.status)}" style="position:static;display:inline-block;margin-bottom:10px;">${p.status}</span>
    <h2 style="color:#0b1f4d;">${p.name}</h2>
    <p style="color:#6b7280;margin:6px 0;">${p.age ? p.age + ' years old, ' : ''}${p.sex}</p>
    <p style="margin:6px 0;">📍 ${p.location}</p>
    <p style="margin:6px 0;">🕒 Last Seen: ${formatDate(p.lastSeen)}</p>
    <p style="margin-top:14px;color:#333;">${p.description || 'No additional details provided.'}</p>
    <a href="contact.html"><button class="btn" style="margin-top:18px;width:100%;">Report a Tip about ${p.name}</button></a>
  `;
  document.getElementById('modalOverlay').classList.add('active');
}
function closeModal() {
  document.getElementById('modalOverlay').classList.remove('active');
}
const modalOverlay = document.getElementById('modalOverlay');
if (modalOverlay) {
  modalOverlay.addEventListener('click', (e) => {
    if (e.target.id === 'modalOverlay') closeModal();
  });
}

const tabBtns = document.querySelectorAll('.tab-btn');
if (tabBtns && tabBtns.length) {
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeStatus = btn.dataset.status;
      loadPersons();
    });
  });
}

const searchBtn = document.getElementById('searchBtn');
if (searchBtn) searchBtn.addEventListener('click', loadPersons);
const searchInput = document.getElementById('searchInput');
if (searchInput) searchInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') loadPersons(); });
const locationInput = document.getElementById('locationInput');
if (locationInput) locationInput.addEventListener('change', loadPersons);
const sortInput = document.getElementById('sortInput');
if (sortInput) sortInput.addEventListener('change', loadPersons);

//  (feed/index pages)
if (document.getElementById('cardsGrid')) {
  loadPersons();
}

// FEED SECTION END

// Add page-load class after DOM ready to trigger CSS animations
document.addEventListener('DOMContentLoaded', () => {
  // small timeout to ensure styles are applied
  setTimeout(() => document.body.classList.add('is-loaded'), 60);
});


// Contact Section - only wire up if the form exists on the page
const form = document.getElementById('tipForm');
if (form) {
  const msg = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (msg) { msg.textContent = ''; msg.className = ''; }

    const payload = {
      fullName: document.getElementById('fullName') ? document.getElementById('fullName').value.trim() : '',
      email: document.getElementById('email') ? document.getElementById('email').value.trim() : '',
      phone: document.getElementById('phone') ? document.getElementById('phone').value.trim() : '',
      relatedPerson: document.getElementById('relatedPerson') ? document.getElementById('relatedPerson').value.trim() : '',
      tipInfo: document.getElementById('tipInfo') ? document.getElementById('tipInfo').value.trim() : ''
    };

    if (!payload.tipInfo) {
      if (msg) { msg.textContent = 'Please provide the tip / information.'; msg.className = 'error'; }
      return;
    }

    if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Submitting...'; }

    // TODO: wire this up to the backend, e.g.:
    // const res = await fetch('https://your-api.example.com/tips', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(payload)
    // });
    // const data = await res.json();
    // if (!res.ok) throw new Error(data.error || 'Something went wrong.');

    if (msg) {
      msg.textContent = '⚠️ Tip submission isn\'t connected to a backend yet.';
      msg.className = 'error';
    }
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = '✈ Submit'; }
  });
}