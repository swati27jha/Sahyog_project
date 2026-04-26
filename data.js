// ===== MOCK DATA =====
const DATA = {
  ngoTags: ['Health','Education','Financial Aid','Women Empowerment','Disaster Relief','Child Welfare','Environment','Elder Care'],
  volSkills: ['Doctor','Nurse','Teacher','Counselor','Driver','Carpenter','Electrician','Cook','Legal Aid','Translator','General Helper'],

  // ===== PRE-EXISTING ACCOUNTS =====
  ngoAccounts: [
    {id:1,name:'Asha Foundation',email:'asha@ngo.org',password:'asha123',phone:'+91 98765 43210',pan:'AABCT1234A',tags:['Health','Education'],location:'Mumbai',desc:'Providing healthcare and education to underprivileged communities in Mumbai since 2008.',beneficiaries:120,donations:540000,impact:82,verified:true},
    {id:2,name:'Sahara Trust',email:'sahara@ngo.org',password:'sahara123',phone:'+91 87654 32109',pan:'BBCST5678B',tags:['Disaster Relief','Environment'],location:'Pune',desc:'Disaster response and environmental conservation across Maharashtra.',beneficiaries:85,donations:320000,impact:71,verified:true},
    {id:3,name:'Disha Welfare Society',email:'disha@ngo.org',password:'disha123',phone:'+91 76543 21098',pan:'CCDWS9012C',tags:['Women Empowerment','Financial Aid'],location:'Delhi',desc:'Empowering women through skill development and financial support in North India.',beneficiaries:95,donations:410000,impact:78,verified:true},
    {id:4,name:'Prayas NGO',email:'prayas@ngo.org',password:'prayas123',phone:'+91 65432 10987',pan:'DDPNG3456D',tags:['Child Welfare','Education'],location:'Bengaluru',desc:'Child welfare and education programs across rural Karnataka and Rajasthan.',beneficiaries:200,donations:680000,impact:88,verified:true},
    {id:5,name:'Karuna Foundation',email:'karuna@ngo.org',password:'karuna123',phone:'+91 54321 09876',pan:'EEKFN7890E',tags:['Elder Care','Health'],location:'Chennai',desc:'Elder care and health services for senior citizens in Tamil Nadu.',beneficiaries:60,donations:250000,impact:45,verified:true},
    {id:6,name:'Green Earth Initiative',email:'green@ngo.org',password:'green123',phone:'+91 43210 98765',pan:'FFGEI2345F',tags:['Environment','Disaster Relief'],location:'Hyderabad',desc:'Environmental protection and sustainable development in Telangana.',beneficiaries:150,donations:390000,impact:65,verified:true}
  ],

  volunteerAccounts: [
    {id:1,name:'Dr. Ananya Mehta',email:'ananya@vol.com',password:'ananya123',phone:'+91 99001 12233',skills:['Doctor'],location:'Mumbai',age:34,active:true,joined:'2025-11-01',distance:2.3,joinedNgos:[1,5]},
    {id:2,name:'Rahul Deshmukh',email:'rahul@vol.com',password:'rahul123',phone:'+91 88002 23344',skills:['Driver','General Helper'],location:'Pune',age:29,active:true,joined:'2025-10-15',distance:5.1,joinedNgos:[2]},
    {id:3,name:'Sneha Iyer',email:'sneha@vol.com',password:'sneha123',phone:'+91 77003 34455',skills:['Nurse','Counselor'],location:'Chennai',age:27,active:false,joined:'2025-12-20',distance:8.7,joinedNgos:[5]},
    {id:4,name:'Amit Tiwari',email:'amit@vol.com',password:'amit123',phone:'+91 66004 45566',skills:['Teacher','Translator'],location:'Delhi',age:31,active:true,joined:'2026-01-05',distance:3.2,joinedNgos:[3,4]},
    {id:5,name:'Priya Nair',email:'priya@vol.com',password:'priya123',phone:'+91 55005 56677',skills:['Cook','General Helper'],location:'Bengaluru',age:25,active:true,joined:'2026-02-10',distance:1.8,joinedNgos:[4]},
    {id:6,name:'Dr. Vikram Rao',email:'vikram@vol.com',password:'vikram123',phone:'+91 44006 67788',skills:['Doctor','Counselor'],location:'Hyderabad',age:42,active:true,joined:'2025-09-22',distance:4.5,joinedNgos:[1,6]},
    {id:7,name:'Kavita Sharma',email:'kavita@vol.com',password:'kavita123',phone:'+91 33007 78899',skills:['Legal Aid','Counselor'],location:'Mumbai',age:36,active:false,joined:'2026-03-01',distance:6.3,joinedNgos:[3]},
    {id:8,name:'Ravi Kumar',email:'ravi@vol.com',password:'ravi123',phone:'+91 22008 89900',skills:['Electrician','Carpenter'],location:'Delhi',age:33,active:true,joined:'2026-01-18',distance:9.1,joinedNgos:[]}
  ],

  beneficiaryAccounts: [
    {id:1,name:'Bhavesh Sharma',email:'bhavesh@ben.com',password:'bhavesh123',phone:'+91 91001 11222',location:'Mumbai'},
    {id:2,name:'Rekha Patel',email:'rekha@ben.com',password:'rekha123',phone:'+91 92002 22333',location:'Delhi'},
    {id:3,name:'Suresh Gupta',email:'suresh@ben.com',password:'suresh123',phone:'+91 93003 33444',location:'Bengaluru'},
    {id:4,name:'Meher Khan',email:'meher@ben.com',password:'meher123',phone:'+91 94004 44555',location:'Hyderabad'},
    {id:5,name:'Anjali Reddy',email:'anjali@ben.com',password:'anjali123',phone:'+91 95005 55666',location:'Chennai'}
  ],

  donorAccounts: [
    {id:1,name:'Arun Kapoor',email:'arun@donor.com',password:'arun123',phone:'+91 81001 11222'},
    {id:2,name:'Sunita Malhotra',email:'sunita@donor.com',password:'sunita123',phone:'+91 82002 22333'},
    {id:3,name:'Rajesh Agarwal',email:'rajesh@donor.com',password:'rajesh123',phone:'+91 83003 33444'},
    {id:4,name:'Neha Jain',email:'neha@donor.com',password:'neha123',phone:'+91 84004 44555'},
    {id:5,name:'Pankaj Choudhary',email:'pankaj@donor.com',password:'pankaj123',phone:'+91 85005 55666'}
  ],

  // Current logged-in user (set on login)
  currentUser: null,
  currentRole: null,

  // ===== EXISTING MOCK DATA =====
  beneficiaries: [
    {name:'B. Sharma', email:'b.sharma@ben.com', phone:'+91 9100111222', location:'Mumbai',problem:'Financial',urgency:'CRITICAL',date:'2026-04-15',status:'Submitted',proof:'None'},
    {name:'R. Patel', email:'r.patel@ben.com', phone:'+91 9200222333', location:'Delhi',problem:'Medical',urgency:'CRITICAL',date:'2026-04-14',status:'Under Review',proof:'medical_report.pdf'},
    {name:'S. Gupta', email:'s.gupta@ben.com', phone:'+91 9300333444', location:'Bengaluru',problem:'Disaster',urgency:'MODERATE',date:'2026-04-13',status:'Help Dispatched',proof:'house_damage.jpg'},
    {name:'M. Khan', email:'m.khan@ben.com', phone:'+91 9400444555', location:'Hyderabad',problem:'Financial',urgency:'PENDING',date:'2026-04-12',status:'Submitted',proof:'None'},
    {name:'A. Reddy', email:'a.reddy@ben.com', phone:'+91 9500555666', location:'Chennai',problem:'Medical',urgency:'MODERATE',date:'2026-04-11',status:'Resolved',proof:'prescription.pdf'},
    {name:'P. Singh', email:'p.singh@ben.com', phone:'+91 9600666777', location:'Pune',problem:'Disaster',urgency:'CRITICAL',date:'2026-04-10',status:'Under Review',proof:'flood_photo.jpg'},
    {name:'K. Joshi', email:'k.joshi@ben.com', phone:'+91 9700777888', location:'Mumbai',problem:'Financial',urgency:'PENDING',date:'2026-04-09',status:'Submitted',proof:'None'},
    {name:'L. Verma', email:'l.verma@ben.com', phone:'+91 9800888999', location:'Delhi',problem:'Medical',urgency:'MODERATE',date:'2026-04-08',status:'Help Dispatched',proof:'medical_bill.pdf'}
  ],
  donations: [
    {donor:'A. Kapoor', location: 'Mumbai', amount:50000,date:'2026-04-18',message:'Keep up the great work!'},
    {donor:'S. Malhotra', location: 'Delhi', amount:25000,date:'2026-04-15',message:'For education programs'},
    {donor:'R. Agarwal', location: 'Bengaluru', amount:100000,date:'2026-04-12',message:''},
    {donor:'N. Jain', location: 'Hyderabad', amount:15000,date:'2026-04-10',message:'Monthly contribution'},
    {donor:'P. Choudhary', location: 'Chennai', amount:75000,date:'2026-04-08',message:'Disaster relief fund'},
    {donor:'M. Sinha', location: 'Pune', amount:30000,date:'2026-04-05',message:''},
    {donor:'K. Bhat', location: 'Kolkata', amount:45000,date:'2026-04-01',message:'For children welfare'}
  ],
  announcements: [
    {ngo:'Asha Foundation',priority:'critical',message:'URGENT: Medical camp in Dharavi needs 10 more volunteers by tomorrow. Contact immediately.',time:'2 hours ago'},
    {ngo:'Sahara Trust',priority:'urgent',message:'Flood relief supplies needed in Kolhapur. Accepting donations and volunteer sign-ups.',time:'5 hours ago'},
    {ngo:'Prayas NGO',priority:'normal',message:'Monthly review meeting scheduled for April 25th. All volunteers welcome.',time:'1 day ago'},
    {ngo:'Disha Welfare Society',priority:'normal',message:'New skill development batch starting May 1st. Registration open.',time:'2 days ago'},
    {ngo:'Karuna Foundation',priority:'urgent',message:'Elder care home in T. Nagar needs medical supplies urgently.',time:'3 days ago'}
  ],
  alerts: [
    {title:'Medical Emergency — Dharavi',location:'Mumbai',type:'Medical',skills:['Doctor','Nurse'],distance:2.1,responded:false},
    {title:'Flood Relief — Kolhapur',location:'Pune',type:'Disaster',skills:['Driver','General Helper'],distance:12.5,responded:false},
    {title:'Financial Aid — Andheri Family',location:'Mumbai',type:'Financial',skills:['Counselor','Legal Aid'],distance:4.3,responded:false},
    {title:'Earthquake Response — Joshimath',location:'Delhi',type:'Disaster',skills:['Doctor','Driver','Cook'],distance:45.0,responded:false},
    {title:'Child Nutrition Camp',location:'Bengaluru',type:'Medical',skills:['Doctor','Cook'],distance:7.8,responded:false}
  ],
  volRequests: [
    {name:'Deepak Menon',skills:['Teacher','Translator'],location:'Mumbai',status:'pending'},
    {name:'Fatima Sheikh',skills:['Nurse'],location:'Delhi',status:'pending'},
    {name:'Arjun Nair',skills:['Driver','Cook'],location:'Chennai',status:'pending'}
  ],
  sentInvites: [
    {name:'Sanjay Patil',skills:['Electrician'],location:'Pune',status:'Pending'},
    {name:'Meera Das',skills:['Counselor'],location:'Bengaluru',status:'Accepted'}
  ],
  myRequests: [
    {ngo:'Asha Foundation',problem:'Medical Emergency',date:'2026-04-16',status:'Under Review'},
    {ngo:'Disha Welfare Society',problem:'Financial Aid',date:'2026-04-10',status:'Help Dispatched'},
    {ngo:'Prayas NGO',problem:'Education',date:'2026-03-28',status:'Resolved'}
  ],
  myDonations: [
    {ngo:'Asha Foundation',amount:25000,date:'2026-04-18',message:'For medical camp'},
    {ngo:'Prayas NGO',amount:50000,date:'2026-04-05',message:'Education fund'},
    {ngo:'Sahara Trust',amount:15000,date:'2026-03-20',message:'Disaster relief'},
    {ngo:'Disha Welfare Society',amount:30000,date:'2026-03-10',message:'Women empowerment'}
  ],
  monthlyDonations: [{month:'Nov',amount:180000},{month:'Dec',amount:220000},{month:'Jan',amount:150000},{month:'Feb',amount:280000},{month:'Mar',amount:310000},{month:'Apr',amount:200000}]
};
