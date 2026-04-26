// ===== VOLUNTEER DASHBOARD =====
let volDashInit = false;
function initVolDash() {
  if (volDashInit) return; volDashInit = true;
  const c = document.getElementById('volPanels');
  const u = DATA.currentUser || {name:'Volunteer',email:'—',phone:'—',location:'—',age:'—',skills:['General Helper'],joinedNgos:[]};
  c.innerHTML = `
  <div class="panel active" id="vol-profile">
    <h2 class="section-title">My Profile</h2>
    <div class="card" style="max-width:500px">
      <div class="flex-between mb-16"><h4>${u.name}</h4><button class="btn btn-sm btn-outline" onclick="this.textContent=this.textContent==='Edit'?'Save ✓':'Edit'">Edit</button></div>
      <p><strong>Email:</strong> ${u.email}</p>
      <p><strong>Phone:</strong> ${u.phone}</p>
      <p><strong>Location:</strong> ${u.location}</p>
      <p><strong>Age:</strong> ${u.age}</p>
      <p class="mt-16"><strong>Skills:</strong></p>
      <div class="tags mt-16">${u.skills.map(s=>'<span class="badge-tag">'+s+'</span>').join('')}</div>
    </div>
  </div>
  <div class="panel" id="vol-find-ngos">
    <h2 class="section-title">Find NGOs</h2>
    <div class="panel-search"><input type="text" placeholder="Search NGOs by name or keyword..." oninput="filterVolNgos(this.value)"></div>
    <div class="card-list" id="volNgoList"></div>
  </div>
  <div class="panel" id="vol-my-ngos">
    <h2 class="section-title">My NGOs</h2>
    <div class="card-list" id="myNgosList"></div>
  </div>
  <div class="panel" id="vol-updates">
    <h2 class="section-title">Updates</h2>
    <div id="volUpdatesList"></div>
  </div>
  <div class="panel" id="vol-alerts">
    <h2 class="section-title">Alerts & Requests</h2>
    <div class="card-list" id="volAlertsList"></div>
  </div>
  <div class="panel" id="vol-settings">
    <h2 class="section-title">Settings</h2>
    <div class="card" style="max-width:600px">
      <h3 style="margin-bottom:16px">Account Settings</h3>
      <div class="form-group"><label>Email Address</label><input type="email" value="${u.email}"></div>
      <div class="form-group"><label>Change Password</label><input type="password" placeholder="New Password"></div>
      <hr style="margin:24px 0;border:none;border-top:1px solid var(--border-color)">
      <h3 style="margin-bottom:16px">Privacy & Notifications</h3>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><strong>Profile Visibility</strong><p style="font-size:12px;color:var(--text-muted)">Allow NGOs to find and invite you</p></div>
        <input type="checkbox" checked style="width:20px;height:20px;cursor:pointer">
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><strong>Email Notifications</strong><p style="font-size:12px;color:var(--text-muted)">Receive email alerts for urgent help</p></div>
        <input type="checkbox" checked style="width:20px;height:20px;cursor:pointer">
      </div>
      <button class="btn btn-primary mt-16" onclick="this.textContent='Settings Saved ✓';setTimeout(()=>this.textContent='Save Settings',2000)">Save Settings</button>
    </div>
  </div>`;
  renderVolNgos();
  renderMyNgos();
  renderVolUpdates();
  renderVolAlerts();
}

function renderVolNgos(filter = '') {
  const el = document.getElementById('volNgoList');
  if (!el) return;
  const ngos = DATA.ngoAccounts;
  const filtered = ngos.filter(n => !filter || n.name.toLowerCase().includes(filter.toLowerCase()) || n.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));
  el.innerHTML = filtered.map(n =>
    `<div class="card"><h4>${n.name}</h4><div class="tags">${n.tags.map(t=>'<span class="badge-tag">'+t+'</span>').join('')}</div><p>${n.desc}</p><p style="font-size:12px;color:var(--text-muted)">${n.beneficiaries} helped · ₹${n.donations.toLocaleString('en-IN')} donated</p><div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-sm btn-primary" onclick="this.textContent='Request Sent — Pending';this.classList.remove('btn-primary');this.classList.add('btn-gray');this.disabled=true">Send Join Request</button><a href="https://mail.google.com/mail/?view=cm&fs=1&to=${n.email}" target="_blank" class="btn btn-sm btn-outline">Contact via Mail</a></div></div>`
  ).join('');
}
function filterVolNgos(v) { renderVolNgos(v); }

function renderMyNgos() {
  const el = document.getElementById('myNgosList');
  if (!el) return;
  const u = DATA.currentUser;
  const joinedIds = (u && u.joinedNgos) ? u.joinedNgos : [];
  const joined = joinedIds.length > 0 ? DATA.ngoAccounts.filter(n => joinedIds.includes(n.id)) : DATA.ngoAccounts.slice(0,2);
  if (joined.length === 0) { el.innerHTML = '<p style="color:var(--text-muted)">You haven\'t joined any NGOs yet. Go to Find NGOs to get started.</p>'; return; }
  el.innerHTML = joined.map(n =>
    `<div class="card"><h4>${n.name}</h4><div class="tags">${n.tags.map(t=>'<span class="badge-tag">'+t+'</span>').join('')}</div><p style="font-size:12px;color:var(--text-muted)">${n.location} · ${n.beneficiaries} helped</p><div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-sm btn-outline">View</button><a href="https://mail.google.com/mail/?view=cm&fs=1&to=${n.email}" target="_blank" class="btn btn-sm btn-outline">Contact via Mail</a></div></div>`
  ).join('');
}

function renderVolUpdates() {
  const el = document.getElementById('volUpdatesList');
  if (!el) return;
  const sorted = [...DATA.announcements].sort((a, b) => (a.priority === 'critical' ? -1 : 1));
  el.innerHTML = sorted.map(a =>
    `<div class="announcement-card ${a.priority}"><div class="flex-between"><strong>${a.ngo}</strong><span class="badge badge-${a.priority==='critical'?'critical':a.priority==='urgent'?'urgent':'normal'}">${a.priority}</span></div><p style="margin-top:8px">${a.message}</p><div class="meta">${a.time}</div></div>`
  ).join('');
}

function renderVolAlerts() {
  const el = document.getElementById('volAlertsList');
  if (!el) return;
  const volName = (DATA.currentUser && DATA.currentUser.name) ? DATA.currentUser.name : '';
  const myAlerts = DATA.alerts.filter(a => !a.assignedTo || a.assignedTo === volName);
  
  if (myAlerts.length === 0) {
    el.innerHTML = '<p style="color:var(--text-muted)">No new alerts.</p>';
    return;
  }
  
  el.innerHTML = myAlerts.map((a, i) =>
    `<div class="card"><h4>${a.type==='Invitation'?'💌':'🚨'} ${a.title}</h4><p><strong>Location:</strong> ${a.location} · <strong>Type:</strong> <span class="badge badge-${a.type==='Medical'?'critical':a.type==='Disaster'?'urgent':'info'}">${a.type}</span></p>${a.skills.length ? `<p style="margin-top:8px"><strong>Skills needed:</strong> ${a.skills.map(s=>'<span class="badge-tag">'+s+'</span>').join(' ')}</p>` : ''}${a.workDetails ? `<div style="margin-top:10px; padding:10px; background:rgba(13,115,119,0.1); border-left:3px solid var(--teal); border-radius:4px;"><p style="font-size:13px; margin:0;"><strong>Task Details:</strong> ${a.workDetails}</p></div>` : ''}<p style="font-size:13px;color:var(--text-muted);margin-top:8px">${a.distance} km away</p><div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-sm btn-success" onclick="acceptAlert(this, '${a.title.replace(/'/g, "\\'")}')">Accept</button><button class="btn btn-sm btn-danger" onclick="rejectAlert(this, '${a.title.replace(/'/g, "\\'")}')">Reject</button></div></div>`
  ).join('');
}

window.acceptAlert = function(btn, title) {
  btn.parentElement.innerHTML = '<span class="badge badge-success">Accepted ✓</span>';
  const alert = DATA.alerts.find(a => a.title === title);
  if (alert) alert.responded = true;
  if(DATA.currentRole) updateNavRight(DATA.currentRole+'-dash');
}

window.rejectAlert = function(btn, title) {
  btn.closest('.card').style.display = 'none';
  const alert = DATA.alerts.find(a => a.title === title);
  if (alert) alert.responded = true;
  if(DATA.currentRole) updateNavRight(DATA.currentRole+'-dash');
}

// ===== BENEFICIARY DASHBOARD =====
let benDashInit = false;
function initBenDash() {
  if (benDashInit) return; benDashInit = true;
  const c = document.getElementById('benPanels');
  c.innerHTML = `
  <div class="panel active" id="ben-request-help">
    <h2 class="section-title">Request Help</h2>
    <p style="color:var(--text-muted);margin-bottom:16px">Step 1: Search for an NGO</p>
    <div class="panel-search"><input type="text" placeholder="Search NGOs by name or keyword..." oninput="filterBenNgos(this.value)"></div>
    <div class="card-list mb-24" id="benNgoSearch"></div>
    <div id="helpFormWrap" class="hidden">
      <p style="color:var(--text-muted);margin-bottom:16px">Step 2: Describe your need</p>
      <div class="form-container" style="max-width:100%">
        <div class="form-group"><label>Selected NGO</label><input type="text" id="selectedNgoName" readonly></div>
        <div class="form-group"><label>Problem Type</label>
          <select id="benProblemType" onchange="document.getElementById('amountField').style.display=this.value==='Financial Aid'?'block':'none'">
            <option>Financial Aid</option><option>Medical Emergency</option><option>Disaster Relief</option><option>Education</option>
            <option>Food & Nutrition</option><option>Child Welfare</option><option>Elderly Care</option>
            <option>Housing / Shelter</option><option>Legal Aid</option><option>Women Empowerment</option>
            <option>Mental Health Support</option><option>Other</option>
          </select>
        </div>
        <div class="form-group"><label>Description</label><textarea id="benDesc" placeholder="Describe your situation..."></textarea></div>
        <div class="form-group"><label>Upload Proof (Medical PDF / Calamity JPG)</label><input type="file" id="benProofFile" accept=".pdf,.jpg,.jpeg"></div>
        <div class="form-group" id="amountField"><label>Amount Needed (₹)</label><input type="number" placeholder="Enter amount"></div>
        <div class="form-group"><label>Urgency</label>
          <select id="benUrgency"><option>MODERATE</option><option>CRITICAL</option><option>PENDING</option></select>
        </div>
        <button class="btn btn-primary" onclick="submitHelpRequest()">Submit Request</button>
      </div>
    </div>
    <div id="helpSuccess" class="success-screen hidden">
      <div class="check">✓</div>
      <h2>Request Submitted!</h2>
      <p>Your request has been submitted to <span id="helpNgoName"></span>. You will be contacted shortly.</p>
      <button class="btn btn-primary mt-16" onclick="document.getElementById('helpSuccess').classList.add('hidden');document.getElementById('benNgoSearch').innerHTML='';document.getElementById('helpFormWrap').classList.add('hidden')">Submit Another</button>
    </div>
  </div>
  <div class="panel" id="ben-my-requests">
    <h2 class="section-title">My Requests</h2>
    <div class="table-wrap"><table class="data-table"><thead><tr><th>NGO</th><th>Problem</th><th>Date</th><th>Status</th></tr></thead><tbody id="myReqTable"></tbody></table></div>
  </div>
  <div class="panel" id="ben-settings">
    <h2 class="section-title">Settings</h2>
    <div class="card" style="max-width:600px">
      <h3 style="margin-bottom:16px">Account Settings</h3>
      <div class="form-group"><label>Email Address</label><input type="email" value="beneficiary@example.com"></div>
      <div class="form-group"><label>Change Password</label><input type="password" placeholder="New Password"></div>
      <hr style="margin:24px 0;border:none;border-top:1px solid var(--border-color)">
      <h3 style="margin-bottom:16px">Privacy & Notifications</h3>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><strong>Email Notifications</strong><p style="font-size:12px;color:var(--text-muted)">Receive updates on your help requests</p></div>
        <input type="checkbox" checked style="width:20px;height:20px;cursor:pointer">
      </div>
      <button class="btn btn-primary mt-16" onclick="this.textContent='Settings Saved ✓';setTimeout(()=>this.textContent='Save Settings',2000)">Save Settings</button>
    </div>
  </div>`;
  renderBenNgoSearch();
  renderMyRequests();
}

function renderBenNgoSearch(filter = '') {
  const el = document.getElementById('benNgoSearch');
  if (!el) return;
  if (!filter) { el.innerHTML = '<p style="color:var(--text-muted);font-size:14px">Type to search NGOs...</p>'; return; }
  const ngos = DATA.ngoAccounts;
  const filtered = ngos.filter(n => n.name.toLowerCase().includes(filter.toLowerCase()) || n.tags.some(t => t.toLowerCase().includes(filter.toLowerCase())));
  el.innerHTML = filtered.map(n =>
    `<div class="card"><div class="flex-between"><div><h4>${n.name}</h4><div class="tags">${n.tags.map(t=>'<span class="badge-tag">'+t+'</span>').join('')}</div></div><div style="display:flex;gap:8px;flex-direction:column"><button class="btn btn-sm btn-primary" onclick="selectNgoForHelp('${n.name}')">Select</button><a href="https://mail.google.com/mail/?view=cm&fs=1&to=${n.email}" target="_blank" class="btn btn-sm btn-outline">Contact via Mail</a></div></div></div>`
  ).join('');
}
function filterBenNgos(v) { renderBenNgoSearch(v); }

function selectNgoForHelp(name) {
  document.getElementById('selectedNgoName').value = name;
  document.getElementById('helpFormWrap').classList.remove('hidden');
}

function submitHelpRequest() {
  const ngoName = document.getElementById('selectedNgoName').value;
  const problemType = document.getElementById('benProblemType').value;
  const urgency = document.getElementById('benUrgency').value;
  const proofFile = document.getElementById('benProofFile').files[0];
  const proofName = proofFile ? proofFile.name : 'None';
  const benUser = DATA.currentUser || { name: 'Current User', email: 'user@ben.com', phone: '+91 00000', location: 'Unknown' };

  DATA.beneficiaries.unshift({
    name: benUser.name,
    email: benUser.email,
    phone: benUser.phone,
    location: benUser.location,
    problem: problemType === 'Medical Emergency' ? 'Medical' : problemType === 'Disaster Relief' ? 'Disaster' : problemType === 'Financial Aid' ? 'Financial' : problemType,
    urgency: urgency,
    date: new Date().toISOString().split('T')[0],
    status: 'Submitted',
    proof: proofName
  });

  DATA.myRequests.unshift({
    ngo: ngoName,
    problem: problemType,
    date: new Date().toISOString().split('T')[0],
    status: 'Submitted'
  });

  document.getElementById('helpNgoName').textContent = ngoName;
  document.getElementById('helpFormWrap').classList.add('hidden');
  document.getElementById('helpSuccess').classList.remove('hidden');
  renderMyRequests();
  if (typeof ngoDashInit !== 'undefined' && ngoDashInit) {
     if (typeof renderBenTable === 'function') renderBenTable();
  }
}

function renderMyRequests() {
  const tb = document.getElementById('myReqTable');
  if (!tb) return;
  tb.innerHTML = DATA.myRequests.map(r =>
    `<tr><td>${r.ngo}</td><td>${r.problem}</td><td>${r.date}</td><td>${statusBadge(r.status)}</td></tr>`
  ).join('');
}

// ===== DONOR DASHBOARD =====
let donorDashInit = false;
function initDonorDash() {
  if (donorDashInit) return; donorDashInit = true;
  const c = document.getElementById('donorPanels');
  const totalDonated = DATA.myDonations.reduce((s, d) => s + d.amount, 0);
  c.innerHTML = `
  <div class="panel active" id="donor-browse-ngos">
    <h2 class="section-title">Browse NGOs</h2>
    <div class="panel-search mb-16"><input type="text" placeholder="Search NGOs..." oninput="filterDonorNgos(this.value)"></div>
    <div class="pill-group mb-24" id="donorTagFilter">${DATA.ngoTags.map(t=>'<button class="pill" onclick="toggleDonorTag(this)">'+t+'</button>').join('')}</div>
    <div class="card-list" id="donorNgoList"></div>
  </div>
  <div class="panel" id="donor-my-donations">
    <h2 class="section-title">My Donations</h2>
    <div class="stat-cards mb-24"><div class="stat-card"><div class="val">₹${totalDonated.toLocaleString('en-IN')}</div><div class="lbl">Total Donated</div></div></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th>NGO</th><th>Amount</th><th>Date</th><th>Message</th></tr></thead><tbody id="myDonTable"></tbody></table></div>
  </div>
  <div class="panel" id="donor-impact">
    <h2 class="section-title">Your Impact</h2>
    <div class="card text-center" style="max-width:600px;margin:0 auto;padding:40px">
      <h3 style="color:var(--teal-light);font-size:24px;margin-bottom:16px">Your ₹${totalDonated.toLocaleString('en-IN')} has helped</h3>
      <p style="font-size:18px;margin-bottom:24px"><strong>47 beneficiaries</strong> across <strong>4 NGOs</strong></p>
      <div class="donut-wrap">
        <div class="donut" style="background:conic-gradient(#0D7377 0% 30%, #E8590C 30% 50%, #22C55E 50% 72%, #F59E0B 72% 100%)"><div class="donut-center"><div class="val">₹${(totalDonated/1000).toFixed(0)}K</div><div class="lbl">Total</div></div></div>
        <div class="donut-legend">
          <div class="item"><div class="swatch" style="background:#0D7377"></div>Health — 30%</div>
          <div class="item"><div class="swatch" style="background:#E8590C"></div>Education — 20%</div>
          <div class="item"><div class="swatch" style="background:#22C55E"></div>Women Empowerment — 22%</div>
          <div class="item"><div class="swatch" style="background:#F59E0B"></div>Disaster Relief — 28%</div>
        </div>
      </div>
    </div>
  </div>
  <div class="panel" id="donor-settings">
    <h2 class="section-title">Settings</h2>
    <div class="card" style="max-width:600px">
      <h3 style="margin-bottom:16px">Account Settings</h3>
      <div class="form-group"><label>Email Address</label><input type="email" value="donor@example.com"></div>
      <div class="form-group"><label>Change Password</label><input type="password" placeholder="New Password"></div>
      <hr style="margin:24px 0;border:none;border-top:1px solid var(--border-color)">
      <h3 style="margin-bottom:16px">Privacy & Notifications</h3>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><strong>Anonymous Donations</strong><p style="font-size:12px;color:var(--text-muted)">Hide my name when donating</p></div>
        <input type="checkbox" style="width:20px;height:20px;cursor:pointer">
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><strong>Email Receipts</strong><p style="font-size:12px;color:var(--text-muted)">Receive donation receipts via email</p></div>
        <input type="checkbox" checked style="width:20px;height:20px;cursor:pointer">
      </div>
      <button class="btn btn-primary mt-16" onclick="this.textContent='Settings Saved ✓';setTimeout(()=>this.textContent='Save Settings',2000)">Save Settings</button>
    </div>
  </div>`;
  renderDonorNgos();
  renderMyDonations();
}

let donorTagFilters = [];
function toggleDonorTag(el) {
  el.classList.toggle('active');
  donorTagFilters = [...document.querySelectorAll('#donorTagFilter .pill.active')].map(p => p.textContent);
  renderDonorNgos();
}

function renderDonorNgos(filter = '') {
  const el = document.getElementById('donorNgoList');
  if (!el) return;
  let filtered = DATA.ngoAccounts;
  if (filter) filtered = filtered.filter(n => n.name.toLowerCase().includes(filter.toLowerCase()));
  if (donorTagFilters.length) filtered = filtered.filter(n => n.tags.some(t => donorTagFilters.includes(t)));
  el.innerHTML = filtered.map(n =>
    `<div class="card"><h4>${n.name}</h4><div class="tags">${n.tags.map(t=>'<span class="badge-tag">'+t+'</span>').join('')}</div><p style="font-size:13px;margin:8px 0"><strong>Impact Score:</strong> ${n.impact}%</p>${impactBar(n.impact)}<p style="font-size:12px;color:var(--text-muted);margin-top:8px">₹${n.donations.toLocaleString('en-IN')} received · ${n.beneficiaries} helped</p><div style="display:flex;gap:8px;margin-top:16px"><button class="btn btn-sm btn-orange" onclick="openPaymentModal()">Donate Now</button><a href="https://mail.google.com/mail/?view=cm&fs=1&to=${n.email}" target="_blank" class="btn btn-sm btn-outline">Contact via Mail</a></div></div>`
  ).join('');
}
function filterDonorNgos(v) { renderDonorNgos(v); }

function renderMyDonations() {
  const tb = document.getElementById('myDonTable');
  if (!tb) return;
  tb.innerHTML = DATA.myDonations.map(d =>
    `<tr><td>${d.ngo}</td><td>₹${d.amount.toLocaleString('en-IN')}</td><td>${d.date}</td><td>${d.message||'—'}</td></tr>`
  ).join('');
}
