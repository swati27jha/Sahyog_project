// ===== CORE ROUTING & UTILITIES =====

let pageHistory = [];
function navigate(page, goBackFlag = false) {
  if (!goBackFlag) {
    const currentActive = document.querySelector('.page.active');
    if (currentActive && currentActive.id) {
      pageHistory.push(currentActive.id.replace('page-', ''));
    }
  }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const el = document.getElementById('page-' + page);
  if (el) { el.classList.add('active'); window.scrollTo(0, 0); }
  if (page !== 'home') {
  document.body.classList.add("logged-in");
} else {
  document.body.classList.remove("logged-in");
}
  updateNavRight(page);
  if (page === 'ngo-dash') initNgoDash();
  if (page === 'vol-dash') initVolDash();
  if (page === 'ben-dash') initBenDash();
  if (page === 'donor-dash') initDonorDash();
  document.querySelectorAll('.sidebar').forEach(s => s.classList.remove('open'));
}

function goBack() {
  if (pageHistory.length > 0) {
    const prevPage = pageHistory.pop();
    navigate(prevPage, true);
  }
}

function refreshData() {
  if (ngoDashInit) { renderChart(); renderBenTable(); renderVolTable(); renderDonTable(); renderAnnouncements(); renderVolRequests(); }
  if (volDashInit) { renderVolNgos(); renderMyNgos(); renderVolUpdates(); renderVolAlerts(); }
  if (benDashInit) { renderBenNgoSearch(); renderMyRequests(); }
  if (donorDashInit) { renderDonorNgos(); renderMyDonations(); }
  if (DATA.currentRole) updateNavRight(DATA.currentRole + '-dash');
}

function getNotificationCount() {
  if (!DATA.currentRole) return 0;
  if (DATA.currentRole === 'ngo') return DATA.volRequests.length;
  if (DATA.currentRole === 'vol') {
    const volName = (DATA.currentUser && DATA.currentUser.name) ? DATA.currentUser.name : '';
    return DATA.alerts.filter(a => (!a.assignedTo || a.assignedTo === volName) && !a.responded).length;
  }
  if (DATA.currentRole === 'ben') return DATA.myRequests.filter(r => r.status === 'Help Dispatched' || r.status === 'Resolved').length;
  if (DATA.currentRole === 'donor') return 1;
  return 0;
}

function showNotifications() {
  let count = getNotificationCount();
  let content = '<h3>🔔 Notifications</h3>';
  if (count === 0) {
    content += '<p style="color:var(--text-muted);margin-top:16px">No new notifications.</p>';
  } else {
    if (DATA.currentRole === 'ngo') {
       content += `<div class="card mt-16" style="border-left:4px solid var(--orange)"><p>You have <strong>${count}</strong> pending volunteer requests.</p><button class="btn btn-sm btn-primary mt-16" onclick="switchPanel('ngo','vol-requests', document.querySelector('#ngoSidebar .sidebar-item:nth-child(6)')); closeSidePanel();">View Requests</button></div>`;
    } else if (DATA.currentRole === 'vol') {
       content += `<div class="card mt-16" style="border-left:4px solid var(--danger)"><p>You have <strong>${count}</strong> new alerts in your area.</p><button class="btn btn-sm btn-primary mt-16" onclick="switchPanel('vol','alerts', document.querySelector('#volSidebar .sidebar-item:nth-child(5)')); closeSidePanel();">View Alerts</button></div>`;
    } else if (DATA.currentRole === 'ben') {
       content += `<div class="card mt-16" style="border-left:4px solid var(--success)"><p>You have <strong>${count}</strong> updates on your requests.</p><button class="btn btn-sm btn-primary mt-16" onclick="switchPanel('ben','my-requests', document.querySelector('#benSidebar .sidebar-item:nth-child(2)')); closeSidePanel();">View Requests</button></div>`;
    } else if (DATA.currentRole === 'donor') {
       content += `<div class="card mt-16" style="border-left:4px solid var(--teal)"><p>An NGO you donated to recently updated their impact report.</p><button class="btn btn-sm btn-primary mt-16" onclick="switchPanel('donor','impact', document.querySelector('#donorSidebar .sidebar-item:nth-child(3)')); closeSidePanel();">View Impact</button></div>`;
    }
  }
  openSidePanel(content);
}

function updateNavRight(page) {
  const nr = document.getElementById('navRight');
  if (page.includes('dash')) {
    const user = DATA.currentUser;
    const name = user ? (user.name || 'User') : 'User';
    let html = '';
    
    const notifCount = getNotificationCount();
    const badgeHtml = notifCount > 0 ? `<span class="notif-badge">${notifCount}</span>` : '';
    html += `<div class="nav-icon" onclick="showNotifications()" style="position:relative;cursor:pointer;font-size:18px;margin-right:8px;display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:var(--bg-input);">🔔${badgeHtml}</div>`;

    if (page === 'vol-dash') {
      const isActive = user && user.active !== undefined ? user.active : true;
      html += `<div class="toggle-wrap"><span>Away</span><div class="toggle ${isActive?'active':''}" onclick="this.classList.toggle('active')"></div><span>Active</span></div>`;
    }
    html += `<button class="btn btn-orange btn-sm" onclick="openPaymentModal()">Donate</button>`;
    html += `<span style="color:var(--teal-light);font-size:13px;font-weight:600;cursor:pointer" onclick="showProfileCredentials()">👤 ${name}</span>`;
    html += ` <button class="btn btn-outline btn-sm" onclick="logoutUser()">Logout</button>`;
    nr.innerHTML = html;
  } else {
    nr.innerHTML = '';
  }
}

function showProfileCredentials() {
  const user = DATA.currentUser;
  if (!user) return;
  
  let html = `<h3>👤 Profile & Credentials</h3>
    <div style="margin-top:16px;background:var(--bg-light);padding:16px;border-radius:8px">
      <p><strong>Name:</strong> ${user.name}</p>
      <p><strong>Email:</strong> ${user.email}</p>
      <p><strong>Phone:</strong> ${user.phone}</p>`;
      
  if (DATA.currentRole === 'ngo') {
    html += `<p><strong>PAN:</strong> ${user.pan}</p>
             <p><strong>Status:</strong> <span class="badge badge-success">Verified</span></p>`;
  } else if (DATA.currentRole === 'vol') {
    html += `<p><strong>Skills:</strong> ${user.skills.join(', ')}</p>
             <p><strong>Joined:</strong> ${user.joined}</p>`;
  } else if (DATA.currentRole === 'ben') {
    html += `<p><strong>Location:</strong> ${user.location}</p>`;
  } else if (DATA.currentRole === 'donor') {
    html += `<p><strong>Donor Level:</strong> Premium</p>`;
  }
  
  html += `</div>`;
  openSidePanel(html);
}

function logoutUser() {
  DATA.currentUser = null;
  DATA.currentRole = null;
  // Reset dashboard init flags
  ngoDashInit = false;
  volDashInit = false;
  benDashInit = false;
  donorDashInit = false;
  // Clear dashboard content
  ['ngoPanels','volPanels','benPanels','donorPanels'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '';
  });
  navigate('landing');
}

// ===== LOGIN SYSTEM =====
async function loginAs(role) {
  const emailInput = document.getElementById(role + 'LoginEmail');
  const passInput = document.getElementById(role + 'LoginPass');
  const errorDiv = document.getElementById(role + 'LoginError');

  if (!emailInput || !passInput) return;
  const email = emailInput.value.trim();
  const pass = passInput.value.trim();

  if (!email || !pass) {
    showLoginError(errorDiv, 'Please enter both email and password.');
    return;
  }

  console.log(`[Firebase Auth] Authenticating user ${email} via Firebase Identity...`);

  // Get correct account list
  let accounts;
  let dashPage;
  if (role === 'ngo') { accounts = DATA.ngoAccounts; dashPage = 'ngo-dash'; }
  else if (role === 'vol') { accounts = DATA.volunteerAccounts; dashPage = 'vol-dash'; }
  else if (role === 'ben') { accounts = DATA.beneficiaryAccounts; dashPage = 'ben-dash'; }
  else if (role === 'donor') { accounts = DATA.donorAccounts; dashPage = 'donor-dash'; }

  const btn = emailInput.closest('.form-container').querySelector('.btn');
  const originalText = btn ? btn.textContent : 'Login';
  if (btn) { btn.textContent = 'Authenticating...'; btn.disabled = true; }

  try {
    if (window.firebaseAuth && window.firebaseSignInWithEmailAndPassword) {
      await window.firebaseSignInWithEmailAndPassword(window.firebaseAuth, email, pass);
    } else {
      console.warn("Firebase Auth not loaded. Please configure Firebase.");
      throw new Error("Firebase Auth SDK not initialized.");
    }

    // Retrieve user profile from our mock data or create a default one
    const user = accounts.find(a => a.email === email) || { email: email, name: email.split('@')[0] };
    DATA.currentUser = user;
    DATA.currentRole = role;
    errorDiv.classList.add('hidden');
    navigate(dashPage);

  } catch (error) {
    console.error("Authentication Error:", error);
    // Fallback for hackathon demo if Firebase API key is not configured
    if (error.code === 'auth/api-key-not-valid' || error.message.includes('api-key')) {
      console.warn("Firebase API key not configured. Falling back to local demo authentication.");
      const demoUser = accounts.find(a => a.email === email && a.password === pass);
      if (demoUser) {
        DATA.currentUser = demoUser;
        DATA.currentRole = role;
        errorDiv.classList.add('hidden');
        navigate(dashPage);
        return;
      } else {
        showLoginError(errorDiv, 'Invalid credentials.');
        return;
      }
    }
    showLoginError(errorDiv, 'Authentication Failed: ' + (error.message || 'Invalid credentials.'));
  } finally {
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
  }
}

function showLoginError(el, msg) {
  el.textContent = msg;
  el.classList.remove('hidden');
  // Re-trigger shake animation
  el.style.animation = 'none';
  el.offsetHeight; // force reflow
  el.style.animation = '';
}

function fillCredentials(role, email, pass) {
  document.getElementById(role + 'LoginEmail').value = email;
  document.getElementById(role + 'LoginPass').value = pass;
}

// ===== RENDER DEMO CREDENTIAL LISTS =====
function renderDemoCreds() {
  // NGO creds
  const ngoCreds = document.getElementById('ngoDemoCreds');
  if (ngoCreds) {
    ngoCreds.innerHTML = DATA.ngoAccounts.map(a =>
      `<div class="cred-item" onclick="fillCredentials('ngo','${a.email}','${a.password}')">
        <div class="cred-info"><span class="cred-name">${a.name}</span><span class="cred-email">${a.email}</span></div>
        <span class="cred-pass">${a.password}</span>
        <button class="use-btn" onclick="event.stopPropagation();fillCredentials('ngo','${a.email}','${a.password}')">Use</button>
      </div>`
    ).join('');
  }
  // Volunteer creds
  const volCreds = document.getElementById('volDemoCreds');
  if (volCreds) {
    volCreds.innerHTML = DATA.volunteerAccounts.map(a =>
      `<div class="cred-item" onclick="fillCredentials('vol','${a.email}','${a.password}')">
        <div class="cred-info"><span class="cred-name">${a.name}</span><span class="cred-email">${a.email}</span></div>
        <span class="cred-pass">${a.password}</span>
        <button class="use-btn" onclick="event.stopPropagation();fillCredentials('vol','${a.email}','${a.password}')">Use</button>
      </div>`
    ).join('');
  }
  // Beneficiary creds
  const benCreds = document.getElementById('benDemoCreds');
  if (benCreds) {
    benCreds.innerHTML = DATA.beneficiaryAccounts.map(a =>
      `<div class="cred-item" onclick="fillCredentials('ben','${a.email}','${a.password}')">
        <div class="cred-info"><span class="cred-name">${a.name}</span><span class="cred-email">${a.email}</span></div>
        <span class="cred-pass">${a.password}</span>
        <button class="use-btn" onclick="event.stopPropagation();fillCredentials('ben','${a.email}','${a.password}')">Use</button>
      </div>`
    ).join('');
  }
  // Donor creds
  const donorCreds = document.getElementById('donorDemoCreds');
  if (donorCreds) {
    donorCreds.innerHTML = DATA.donorAccounts.map(a =>
      `<div class="cred-item" onclick="fillCredentials('donor','${a.email}','${a.password}')">
        <div class="cred-info"><span class="cred-name">${a.name}</span><span class="cred-email">${a.email}</span></div>
        <span class="cred-pass">${a.password}</span>
        <button class="use-btn" onclick="event.stopPropagation();fillCredentials('donor','${a.email}','${a.password}')">Use</button>
      </div>`
    ).join('');
  }
}

// ===== MODALS =====
function openPaymentModal() {
  document.getElementById('paymentForm').classList.remove('hidden');
  document.getElementById('paymentSuccess').classList.add('hidden');
  document.getElementById('paymentModal').classList.add('active');
  const btn = document.getElementById('paySubmitBtn');
  if(btn) { btn.disabled = false; btn.textContent = 'Pay Securely'; }
}

function openFundsModal(benName) {
  document.getElementById('fundsForm').classList.remove('hidden');
  document.getElementById('fundsSuccess').classList.add('hidden');
  const nameEl = document.getElementById('fundBenName');
  if(nameEl) nameEl.textContent = benName;
  document.getElementById('fundsModal').classList.add('active');
  const btn = document.getElementById('fundSubmitBtn');
  if(btn) { btn.disabled = false; btn.textContent = 'Authorize Transfer'; }
}

function processFundsTransfer(btn) {
  btn.textContent = 'Processing Transfer...';
  btn.disabled = true;
  
  // Simulate bank/API delay
  setTimeout(() => {
    document.getElementById('fundsForm').classList.add('hidden');
    document.getElementById('fundsSuccess').classList.remove('hidden');
    
    const benName = document.getElementById('fundBenName').textContent;
    // Mark beneficiary as resolved
    const ben = DATA.beneficiaries.find(b => b.name === benName);
    if (ben) {
      ben.status = 'Resolved';
    }
    
    // Add a notification/update to "myRequests" if it matches
    // For realism, let's just push a dummy notification
    DATA.myRequests.unshift({
      ngo: (DATA.currentUser && DATA.currentUser.name) ? DATA.currentUser.name : 'Your NGO',
      problem: 'Financial Aid Received',
      date: new Date().toISOString().split('T')[0],
      status: 'Resolved'
    });
    
    refreshData();
  }, 1500);
}

function closeModal(id) { document.getElementById(id).classList.remove('active'); }
function processPayment() {
  document.getElementById('paymentForm').classList.add('hidden');
  document.getElementById('paymentSuccess').classList.remove('hidden');
  
  // Update donation data
  const amount = parseInt(document.getElementById('payAmount').value) || 0;
  const ngo = document.getElementById('payNgoSelect') ? document.getElementById('payNgoSelect').value : 'General Fund';
  const location = document.getElementById('payLocation') ? document.getElementById('payLocation').value : 'Unknown';
  const message = document.getElementById('payMsg') ? document.getElementById('payMsg').value : '';
  const donorName = (DATA.currentUser && DATA.currentUser.name) ? DATA.currentUser.name : 'Guest Donor';
  
  if (amount > 0) {
    DATA.donations.unshift({ donor: donorName, location: location, amount: amount, date: new Date().toISOString().split('T')[0], message: message });
    if (DATA.currentUser && DATA.currentRole === 'donor') {
      DATA.myDonations.unshift({ ngo: ngo, amount: amount, date: new Date().toISOString().split('T')[0], message: message });
    }
    // Update target NGO received amount
    const targetNgo = DATA.ngoAccounts.find(n => n.name === ngo);
    if (targetNgo) targetNgo.donations += amount;
    
    refreshData();
  }
}

function processPaymentWithSpinner(btn) {
  btn.textContent = 'Processing API Payment...';
  btn.disabled = true;
  
  const amount = document.getElementById('payAmount') ? document.getElementById('payAmount').value : 0;
  const method = document.getElementById('payMethod') ? document.getElementById('payMethod').value : 'Unknown';
  
  // Dummy API call to simulate payment gateway integration (e.g. Stripe, Razorpay)
  fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Payment Processed',
      amount: amount,
      method: method,
      userId: 1,
    }),
    headers: {
      'Content-type': 'application/json; charset=UTF-8',
    },
  })
  .then(response => response.json())
  .then(json => {
    console.log('Payment API Response:', json);
    processPayment();
  })
  .catch(error => {
    console.error('Payment Error:', error);
    btn.textContent = 'Payment Failed';
    btn.disabled = false;
  });
}

function closeSidePanel() { document.getElementById('sidePanel').classList.remove('open'); }
function openSidePanel(html) {
  document.getElementById('sidePanelContent').innerHTML = html;
  document.getElementById('sidePanel').classList.add('open');
}

// ===== REGISTRATION SUBMISSIONS =====
function submitNgoReg() {
  document.getElementById('ngoRegForm').classList.add('hidden');
  document.getElementById('ngoRegSuccess').classList.remove('hidden');
}
function submitVolReg() {
  document.getElementById('volRegForm').classList.add('hidden');
  document.getElementById('volRegSuccess').classList.remove('hidden');
}
function submitBenReg() {
  document.getElementById('benRegForm').classList.add('hidden');
  document.getElementById('benRegSuccess').classList.remove('hidden');
}
function submitDonorReg() {
  document.getElementById('donorRegForm').classList.add('hidden');
  document.getElementById('donorRegSuccess').classList.remove('hidden');
}

// ===== PILL CHECKBOXES INIT =====
function initPills() {
  const ngoTags = document.getElementById('ngoTags');
  if (ngoTags && !ngoTags.hasChildNodes()) {
    DATA.ngoTags.forEach(t => { const b = document.createElement('button'); b.className = 'pill'; b.type = 'button'; b.textContent = t; b.onclick = () => b.classList.toggle('active'); ngoTags.appendChild(b); });
  }
  const volSkills = document.getElementById('volSkills');
  if (volSkills && !volSkills.hasChildNodes()) {
    DATA.volSkills.forEach(t => { const b = document.createElement('button'); b.className = 'pill'; b.type = 'button'; b.textContent = t; b.onclick = () => b.classList.toggle('active'); volSkills.appendChild(b); });
  }
}

// ===== HAMBURGER =====
document.getElementById('hamburgerBtn').addEventListener('click', () => {
  const activePage = document.querySelector('.page.active');
  const sidebar = activePage ? activePage.querySelector('.sidebar') : null;
  if (sidebar) sidebar.classList.toggle('open');
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
  document.querySelectorAll('.stat-item .num[data-count]').forEach(el => {
    const target = parseInt(el.dataset.count);
    let current = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      current += step;
      if (current >= target) { current = target; clearInterval(timer); }
      el.textContent = current.toLocaleString('en-IN');
    }, 25);
  });
}

// ===== PANEL SWITCHING =====
function switchPanel(role, panel, el) {
  const container = document.getElementById(role === 'ngo' ? 'ngoPanels' : role === 'vol' ? 'volPanels' : role === 'ben' ? 'benPanels' : 'donorPanels');
  const sidebar = el.closest('.sidebar');
  sidebar.querySelectorAll('.sidebar-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');
  container.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
  const target = container.querySelector('#' + role + '-' + panel);
  if (target) target.classList.add('active');
  sidebar.classList.remove('open');
}

// ===== HELPERS =====
function urgencyBadge(u) {
  const cls = u === 'CRITICAL' ? 'badge-critical' : u === 'MODERATE' ? 'badge-urgent' : 'badge-pending';
  return `<span class="badge ${cls}">${u}</span>`;
}
function problemBadge(p) {
  const cls = p === 'Financial' ? 'badge-info' : p === 'Medical' ? 'badge-critical' : 'badge-urgent';
  return `<span class="badge ${cls}">${p}</span>`;
}
function statusBadge(s) {
  const cls = s === 'Resolved' ? 'badge-success' : s === 'Help Dispatched' ? 'badge-info' : s === 'Under Review' ? 'badge-urgent' : 'badge-pending';
  return `<span class="badge ${cls}">${s}</span>`;
}
function impactBar(score) {
  const cls = score > 70 ? 'green' : score >= 40 ? 'orange' : 'red';
  return `<div class="progress"><div class="progress-fill ${cls}" style="width:${score}%"></div></div>`;
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  initPills();
  animateCounters();
  renderDemoCreds();
  initSearch();
});

// ===== SEARCH LOGIC =====
function initSearch() {
  const searchInput = document.getElementById('globalSearch');
  const searchResults = document.getElementById('searchResults');
  
  if (!searchInput || !searchResults) return;
  
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    if (query.length < 2) {
      searchResults.classList.add('hidden');
      return;
    }
    
    const results = DATA.ngoAccounts.filter(ngo => 
      ngo.name.toLowerCase().includes(query) || 
      ngo.tags.some(tag => tag.toLowerCase().includes(query)) ||
      ngo.location.toLowerCase().includes(query)
    );
    
    if (results.length > 0) {
      searchResults.innerHTML = results.map(ngo => `
        <div class="search-dropdown-item" onclick="showNgoDetails(${ngo.id})">
          <h4>${ngo.name}</h4>
          <p>${ngo.location}</p>
          <div class="tags">${ngo.tags.map(t => `<span class="badge badge-tag">${t}</span>`).join('')}</div>
        </div>
      `).join('');
      searchResults.classList.remove('hidden');
    } else {
      searchResults.innerHTML = '<div class="search-dropdown-item"><p>No NGOs found matching your keywords.</p></div>';
      searchResults.classList.remove('hidden');
    }
  });

  document.addEventListener('click', (e) => {
    if (!searchInput.contains(e.target) && !searchResults.contains(e.target)) {
      searchResults.classList.add('hidden');
    }
  });
}

function showNgoDetails(id) {
  const ngo = DATA.ngoAccounts.find(n => n.id === id);
  if (!ngo) return;
  let html = `<h3>${ngo.name}</h3>
    <p style="color:var(--text-muted);margin-bottom:16px">${ngo.location}</p>
    <p>${ngo.desc}</p>
    <div style="margin-top:16px">
      <p><strong>Beneficiaries Helped:</strong> ${ngo.beneficiaries}</p>
      <p><strong>Impact Score:</strong> ${ngo.impact}/100</p>
    </div>
    <div style="margin-top:16px;display:flex;gap:10px">
       <button class="btn btn-primary" onclick="openPaymentModal()">Donate Now</button>
    </div>`;
  openSidePanel(html);
  document.getElementById('searchResults').classList.add('hidden');
  document.getElementById('globalSearch').value = '';
}
