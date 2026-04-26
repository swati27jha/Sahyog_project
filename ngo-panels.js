// ===== NGO DASHBOARD INIT =====
let ngoDashInit = false;
function initNgoDash() {
  if (ngoDashInit) return; ngoDashInit = true;
  const c = document.getElementById('ngoPanels');
  c.innerHTML = `
  <div class="panel active" id="ngo-overview">
    <h2 class="section-title">Overview</h2>
    <div class="stat-cards">
      <div class="stat-card" style="cursor:pointer" onclick="switchPanel('ngo','donations', document.querySelector('#ngoSidebar .sidebar-item:nth-child(4)'))"><div class="val">₹12,40,000</div><div class="lbl">Total Donations</div></div>
      <div class="stat-card" style="cursor:pointer" onclick="switchPanel('ngo','beneficiaries', document.querySelector('#ngoSidebar .sidebar-item:nth-child(2)'))"><div class="val">340</div><div class="lbl">Beneficiaries Helped</div></div>
      <div class="stat-card" style="cursor:pointer" onclick="switchPanel('ngo','volunteers', document.querySelector('#ngoSidebar .sidebar-item:nth-child(3)'))"><div class="val">58</div><div class="lbl">Active Volunteers</div></div>
      <div class="stat-card" style="cursor:pointer" onclick="switchPanel('ngo','vol-requests', document.querySelector('#ngoSidebar .sidebar-item:nth-child(6)'))"><div class="val">12</div><div class="lbl">Pending Requests</div></div>
    </div>
    <div class="chart-container">
      <h3>Monthly Donations (Last 6 Months)</h3>
      <div class="bar-chart" id="donationChart"></div>
    </div>
  </div>
  <div class="panel" id="ngo-beneficiaries">
    <h2 class="section-title">Beneficiaries</h2>
    <div class="tabs mb-16"><button class="tab active" onclick="switchBenTab(this,'active')">Active Requests</button><button class="tab" onclick="switchBenTab(this,'history')">History (Resolved)</button></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Contact</th><th>Location</th><th>Problem</th><th>Urgency</th><th>Proof</th><th>Date</th><th>Action</th></tr></thead><tbody id="benTable"></tbody></table></div>
  </div>
  <div class="panel" id="ngo-volunteers">
    <h2 class="section-title">Volunteers</h2>
    <div class="table-wrap"><table class="data-table"><thead><tr><th>Name</th><th>Contact</th><th>Skills</th><th>Location</th><th>Status</th><th>Joined</th></tr></thead><tbody id="volTable"></tbody></table></div>
  </div>
  <div class="panel" id="ngo-donations">
    <h2 class="section-title">Donations</h2>
    <div class="stat-cards mb-24"><div class="stat-card"><div class="val">₹${DATA.donations.reduce((s,d)=>s+d.amount,0).toLocaleString('en-IN')}</div><div class="lbl">Total Received</div></div></div>
    <div class="table-wrap"><table class="data-table"><thead><tr><th>Donor</th><th>Location</th><th>Amount</th><th>Date</th><th>Message</th></tr></thead><tbody id="donTable"></tbody></table></div>
  </div>
  <div class="panel" id="ngo-announcements">
    <h2 class="section-title">Announcements</h2>
    <div class="form-group"><textarea id="annText" placeholder="Write an announcement..."></textarea></div>
    <div class="flex-between mb-24">
      <div class="pill-group"><button class="pill active" onclick="selectPriority(this)" data-p="normal">Normal</button><button class="pill" onclick="selectPriority(this)" data-p="urgent">Urgent</button><button class="pill" onclick="selectPriority(this)" data-p="critical">Critical</button></div>
      <button class="btn btn-primary btn-sm" onclick="postAnnouncement()">Post</button>
    </div>
    <div id="annList"></div>
  </div>
  <div class="panel" id="ngo-vol-requests">
    <h2 class="section-title">Volunteer Requests</h2>
    <div class="tabs"><button class="tab active" onclick="switchTab(this,'incoming')">Incoming Requests</button><button class="tab" onclick="switchTab(this,'send-inv')">Send Invitations</button></div>
    <div class="tab-content active" id="tab-incoming"><div id="incomingList"></div></div>
    <div class="tab-content" id="tab-send-inv">
      <div class="panel-search"><input type="text" placeholder="Search volunteers to invite..."></div>
      <div id="inviteList"></div>
    </div>
  </div>
  <div class="panel" id="ngo-settings">
    <h2 class="section-title">Settings</h2>
    <div class="card" style="max-width:600px">
      <h3 style="margin-bottom:16px">Account Settings</h3>
      <div class="form-group"><label>Email Address</label><input type="email" value="ngo@example.com"></div>
      <div class="form-group"><label>Change Password</label><input type="password" placeholder="New Password"></div>
      <hr style="margin:24px 0;border:none;border-top:1px solid var(--border-color)">
      <h3 style="margin-bottom:16px">Privacy & Notifications</h3>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><strong>Profile Visibility</strong><p style="font-size:12px;color:var(--text-muted)">Make profile visible to volunteers & donors</p></div>
        <input type="checkbox" checked style="width:20px;height:20px;cursor:pointer">
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:16px">
        <div><strong>Email Notifications</strong><p style="font-size:12px;color:var(--text-muted)">Receive alerts for donations and requests</p></div>
        <input type="checkbox" checked style="width:20px;height:20px;cursor:pointer">
      </div>
      <button class="btn btn-primary mt-16" onclick="this.textContent='Settings Saved ✓';setTimeout(()=>this.textContent='Save Settings',2000)">Save Settings</button>
    </div>
  </div>`;
  renderChart();
  renderBenTable();
  renderVolTable();
  renderDonTable();
  renderAnnouncements();
  renderVolRequests();
}

function renderChart() {
  const ch = document.getElementById('donationChart');
  if (!ch) return;
  const max = Math.max(...DATA.monthlyDonations.map(d => d.amount));
  ch.innerHTML = DATA.monthlyDonations.map(d =>
    `<div class="bar-group"><div class="bar-val">₹${(d.amount/1000).toFixed(0)}K</div><div class="bar" style="height:${(d.amount/max)*100}%"></div><div class="bar-label">${d.month}</div></div>`
  ).join('');
}

let currentBenTab = 'active';
function switchBenTab(el, tab) {
  el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  currentBenTab = tab;
  renderBenTable();
}

function renderBenTable() {
  const tb = document.getElementById('benTable');
  if (!tb) return;
  let filtered = DATA.beneficiaries;
  if (currentBenTab === 'active') {
    filtered = filtered.filter(b => b.status !== 'Resolved');
  } else {
    filtered = filtered.filter(b => b.status === 'Resolved');
  }
  
  tb.innerHTML = filtered.map((b, i) => {
    let actionBtn = '';
    if (b.status === 'Resolved') {
      actionBtn = `<span style="color:var(--text-muted)">Resolved</span>`;
    } else {
      if (b.problem === 'Financial') actionBtn = `<button class="btn btn-sm btn-primary" onclick="openFundsModal('${b.name}')">Send Funds</button>`;
      else actionBtn = `<button class="btn btn-sm btn-primary" onclick="openDispatch('${b.problem}', '${b.name}')">Dispatch</button>`;
      actionBtn += ` <button class="btn btn-sm btn-success" onclick="markResolved('${b.name}')">Resolve</button>`;
    }
    const contact = `<div>${b.email || 'N/A'}</div><div style="font-size:12px;color:var(--text-muted)">${b.phone || ''}</div>`;
    let proofBtn = 'None';
    if (b.proof && b.proof !== 'None') {
      proofBtn = `<a href="#" onclick="alert('Viewing proof: ${b.proof}')">View Proof</a>`;
    }
    return `<tr><td>${b.name}</td><td>${contact}</td><td>${b.location}</td><td>${problemBadge(b.problem)}</td><td>${urgencyBadge(b.urgency)}</td><td>${proofBtn}</td><td>${b.date}</td><td><div style="display:flex;gap:4px;flex-wrap:wrap">${actionBtn}</div></td></tr>`;
  }).join('');
}

function markResolved(name) {
  const ben = DATA.beneficiaries.find(b => b.name === name);
  if (ben) { ben.status = 'Resolved'; renderBenTable(); }
}

function openDispatch(type, benName) {
  const vols = DATA.volunteerAccounts.filter(v => {
    if (type === 'Medical') return v.skills.some(s => ['Doctor','Nurse','Counselor'].includes(s));
    return true;
  }).slice(0, 3);
  document.getElementById('dispatchContent').innerHTML = `
    <h3>${type === 'Medical' ? '🏥 Dispatch Medical Volunteer' : '🚨 Dispatch Disaster Volunteer'}</h3>
    <p style="color:var(--text-muted);margin-bottom:16px">Top matched volunteers by proximity:</p>
    ${vols.map(v => `
      <div class="vol-dispatch-card">
        <div class="info">
          <h4><span class="dot ${v.active?'dot-active':'dot-away'}"></span>${v.name}</h4>
          <p>${v.skills.map(s=>'<span class="badge-tag">'+s+'</span>').join(' ')} · ${v.distance} km · ${v.active?'Active':'Away'}</p>
        </div>
        <div class="actions">
          <button class="btn btn-sm btn-success" onclick="dispatchVolunteer(this, '${v.name}', '${type}', '${benName}')">Dispatch</button>
          <button class="btn btn-sm btn-gray" onclick="this.closest('.vol-dispatch-card').style.opacity='0.4'">Skip</button>
        </div>
      </div>
    `).join('')}`;
  document.getElementById('dispatchModal').classList.add('active');
}

function dispatchVolunteer(btn, volName, type, benName) {
  btn.textContent = 'Dispatched ✓';
  btn.disabled = true;
  DATA.alerts.unshift({
    title: 'Dispatched: ' + type + ' for ' + (benName || 'Beneficiary'),
    location: 'Assigned Location',
    type: type,
    skills: [],
    distance: '0.0',
    responded: false,
    assignedTo: volName
  });
  if (typeof volDashInit !== 'undefined' && volDashInit) {
     if (typeof renderVolAlerts === 'function') renderVolAlerts();
  }
}

function renderVolTable() {
  const tb = document.getElementById('volTable');
  if (!tb) return;
  tb.innerHTML = DATA.volunteerAccounts.map(v => {
    const contact = `<div>${v.email || 'N/A'}</div><div style="font-size:12px;color:var(--text-muted)">${v.phone || ''}</div>`;
    return `<tr><td><span class="dot ${v.active?'dot-active':'dot-away'}"></span>${v.name}</td><td>${contact}</td><td>${v.skills.map(s=>'<span class="badge-tag">'+s+'</span>').join(' ')}</td><td>${v.location}</td><td>${v.active?'<span class="badge badge-success">Active</span>':'<span class="badge badge-pending">Away</span>'}</td><td>${v.joined}</td></tr>`;
  }).join('');
}

function renderDonTable() {
  const tb = document.getElementById('donTable');
  if (!tb) return;
  tb.innerHTML = DATA.donations.map(d =>
    `<tr><td>${d.donor}</td><td>${d.location || 'Unknown'}</td><td>₹${d.amount.toLocaleString('en-IN')}</td><td>${d.date}</td><td>${d.message||'—'}</td></tr>`
  ).join('');
}

let selectedPriority = 'normal';
function selectPriority(el) {
  el.closest('.pill-group').querySelectorAll('.pill').forEach(p => p.classList.remove('active'));
  el.classList.add('active');
  selectedPriority = el.dataset.p;
}

function postAnnouncement() {
  const text = document.getElementById('annText').value.trim();
  if (!text) return;
  DATA.announcements.unshift({ngo:'Your NGO',priority:selectedPriority,message:text,time:'Just now'});
  document.getElementById('annText').value = '';
  renderAnnouncements();
}

function renderAnnouncements() {
  const el = document.getElementById('annList');
  if (!el) return;
  el.innerHTML = DATA.announcements.map(a =>
    `<div class="announcement-card ${a.priority}"><div class="flex-between"><strong>${a.ngo}</strong><span class="badge badge-${a.priority==='critical'?'critical':a.priority==='urgent'?'urgent':'normal'}">${a.priority}</span></div><p style="margin-top:8px">${a.message}</p><div class="meta">${a.time}</div></div>`
  ).join('');
}

function renderVolRequests() {
  const il = document.getElementById('incomingList');
  if (il) {
    il.innerHTML = DATA.volRequests.map(v =>
      `<div class="card" style="margin-bottom:12px"><div class="flex-between"><div><h4 style="cursor:pointer" onclick="openSidePanel('<h3>${v.name}</h3><p style=\\'margin:12px 0;color:var(--text-muted)\\'>Skills: ${v.skills.join(', ')}</p><p style=\\'color:var(--text-muted)\\'>Location: ${v.location}</p><p style=\\'margin-top:12px;color:var(--text-muted)\\'>Phone: +91 98765 XXXXX</p><p style=\\'color:var(--text-muted)\\'>Age: 28</p>')">${v.name}</h4><p>${v.skills.map(s=>'<span class="badge-tag">'+s+'</span>').join(' ')} · ${v.location}</p></div><div style="display:flex;gap:8px" class="action-btns"><button class="btn btn-sm btn-success" onclick="handleRequestAction(this, 'accept')">Accept</button><button class="btn btn-sm btn-danger" onclick="handleRequestAction(this, 'decline')">Decline</button></div></div></div>`
    ).join('');
  }
  const invl = document.getElementById('inviteList');
  if (invl) {
    invl.innerHTML = DATA.volunteerAccounts.slice(0,4).map(v =>
      `<div class="card" style="margin-bottom:12px"><div class="flex-between"><div><h4>${v.name}</h4><p>${v.skills.map(s=>'<span class="badge-tag">'+s+'</span>').join(' ')} · ${v.location}</p></div><button class="btn btn-sm btn-primary" onclick="handleInviteAction(this, '${v.name}')">Send Request</button></div></div>`
    ).join('');
  }
}

function switchTab(el, id) {
  el.closest('.tabs').querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  el.closest('.panel').querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
}

function handleRequestAction(btn, type) {
  const container = btn.closest('.action-btns');
  const card = btn.closest('.card');
  
  // Show spinner state
  container.innerHTML = `<span style="color:var(--text-muted);font-size:14px">Processing...</span>`;
  
  setTimeout(() => {
    if (type === 'accept') {
      container.innerHTML = `<span class="badge badge-success" style="padding:6px 12px">Accepted ✓</span>`;
      
      // Update volunteer accounts
      const volName = card.querySelector('h4').textContent;
      const volReq = DATA.volRequests.find(v => v.name === volName);
      if (volReq) {
        DATA.volunteerAccounts.push({
          id: DATA.volunteerAccounts.length + 1,
          name: volReq.name,
          email: volReq.name.split(' ')[0].toLowerCase() + '@vol.com',
          phone: '+91 99999 00000',
          skills: volReq.skills,
          location: volReq.location,
          age: 28,
          active: true,
          joined: new Date().toISOString().split('T')[0],
          distance: 5.0,
          joinedNgos: []
        });
        DATA.volRequests = DATA.volRequests.filter(v => v.name !== volName);
        renderVolTable(); // re-render the volunteer list
      }

      // Update stats if needed
      const volStat = document.querySelector('.stat-card:nth-child(3) .val');
      if(volStat) volStat.textContent = parseInt(volStat.textContent) + 1;
      const reqStat = document.querySelector('.stat-card:nth-child(4) .val');
      if(reqStat && parseInt(reqStat.textContent) > 0) reqStat.textContent = parseInt(reqStat.textContent) - 1;
      if (DATA.currentRole) updateNavRight(DATA.currentRole + '-dash');
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {
        card.remove();
        const reqStat = document.querySelector('.stat-card:nth-child(4) .val');
        if(reqStat && parseInt(reqStat.textContent) > 0) reqStat.textContent = parseInt(reqStat.textContent) - 1;
        if (DATA.currentRole) updateNavRight(DATA.currentRole + '-dash');
      }, 300);
    }
  }, 800);
}

function handleInviteAction(btn, volName) {
  const workDetails = prompt(`What work needs to be done by ${volName}?`, `We need your expertise for an upcoming project.`);
  if (!workDetails) return; // Cancelled

  btn.textContent = 'Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.textContent = 'Invite Sent ✓';
    btn.classList.remove('btn-primary');
    btn.classList.add('btn-gray');
    
    // Create connection to the volunteer dashboard
    const ngoName = (DATA.currentUser && DATA.currentUser.name) ? DATA.currentUser.name : 'Your NGO';
    DATA.alerts.unshift({
      title: 'Invitation from ' + ngoName,
      location: 'Online',
      type: 'Invitation',
      skills: [],
      workDetails: workDetails,
      distance: '0.0',
      responded: false,
      assignedTo: volName
    });
  }, 800);
}
