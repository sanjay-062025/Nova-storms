import {
  ScholarshipScheme,
  Application,
  PaymentRecord,
  DocumentItem,
  NotificationItem,
  GrievanceRecord,
  Mentor,
  StudentProfile,
  PaymentMethod,
  VerificationModuleStatus,
  EntitlementWalletData,
  GovApiKeyConfig,
  GovPipelineStage,
  InactiveUserStatus,
  InactiveUserMentorshipPlan
} from '../types';
import { getDocumentPreviewUrl } from '../utils/documentPreviews';

export const OFFICIAL_MOTA_URL = 'https://tribal.nic.in/ScholarshiP.aspx';

export const SCHOLARSHIP_SCHEMES: ScholarshipScheme[] = [
  {
    id: 'pre-matric',
    schemeCode: 'MOTA-SCH-01',
    schemeName: 'Pre-Matric Scholarship for ST Students',
    shortName: 'Pre-Matric Scholarship',
    category: 'School',
    pillar: 'national',
    annualSlots: 250000,
    description: 'Centrally sponsored financial assistance for Scheduled Tribe students studying in classes IX and X to minimize drop-out rates in secondary education.',
    eligibility: 'ST students in Classes 9th & 10th in government or recognized schools with parental annual income not exceeding ₹2.5 Lakhs.',
    benefitAmount: 8000,
    formattedBenefit: '₹8,000 / year',
    targetGroup: 'ST Day Scholars & Hostellers (Classes IX & X)',
    annualIncomeCeiling: 250000,
    academicLevel: 'Class 9-10',
    applicationPeriod: 'Aug 1, 2026 – Oct 31, 2026',
    deadlineDate: '31 Oct 2026',
    sourceUrl: OFFICIAL_MOTA_URL,
    guidelinesUrl: 'https://tribal.nic.in/writereaddata/Schemes/Pre-Matric-Guidelines.pdf',
    keyBenefitsList: [
      'Day Scholars: ₹3,500/year maintenance allowance',
      'Hostellers: ₹7,000/year maintenance allowance',
      'Books and ad-hoc grant: ₹1,000/year'
    ],
    mandatoryDocuments: [
      'ST Caste Certificate from competent revenue authority',
      'Income Certificate (under ₹2.5 Lakhs)',
      'Previous Class VIII/IX Passing Marksheet',
      'Aadhaar seeded bank account passbook'
    ]
  },
  {
    id: 'post-matric',
    schemeCode: 'MOTA-SCH-02',
    schemeName: 'Post-Matric Scholarship for ST Students',
    shortName: 'Post-Matric Scholarship',
    category: 'Higher Education',
    pillar: 'national',
    annualSlots: 500000,
    description: 'Flagship centrally sponsored scheme providing comprehensive financial assistance to ST students studying at post-matriculation or post-secondary stages.',
    eligibility: 'ST students pursuing recognized post-matric or post-secondary courses (11th, 12th, ITI, Diploma, Graduation, Post Graduation) with family annual income <= ₹2.5 Lakhs.',
    benefitAmount: 12000,
    formattedBenefit: '₹12,000 / year',
    targetGroup: 'ST Students in XI, XII, UG, PG, Polytechnic & Professional courses',
    annualIncomeCeiling: 250000,
    academicLevel: 'Undergraduate',
    applicationPeriod: 'Jul 15, 2026 – Nov 15, 2026',
    deadlineDate: '15 Nov 2026',
    sourceUrl: OFFICIAL_MOTA_URL,
    guidelinesUrl: 'https://tribal.nic.in/writereaddata/Schemes/Post-Matric-Guidelines.pdf',
    keyBenefitsList: [
      '100% compulsory non-refundable fees reimbursed directly to institute',
      'Maintenance allowance: ₹1,200/month (Hostellers) or ₹550/month (Day scholars)',
      'Study tour allowances and thesis typing charges for postgraduate scholars',
      'Special disability allowance for differently abled ST scholars'
    ],
    mandatoryDocuments: [
      'Verified ST Certificate',
      'Income Certificate issued by Tehsildar/SDM',
      'Fee receipt of current academic year',
      'College Bonafide Certificate'
    ]
  },
  {
    id: 'top-class',
    schemeCode: 'MOTA-SCH-03',
    schemeName: 'National Fellowship & Scholarship for Higher Education (Top Class)',
    shortName: 'Top Class Scholarship',
    category: 'Higher Technical',
    pillar: 'national',
    annualSlots: 1000,
    description: 'Central Sector Scheme to encourage meritorious ST students to pursue studies in identified premier institutions of excellence (IITs, NITs, IIMs, AIIMS, NLUs, etc.).',
    eligibility: 'ST students admitted to notified Top Class Institutions across India with family annual income <= ₹6.0 Lakhs.',
    benefitAmount: 86000,
    formattedBenefit: '₹86,000 / year',
    targetGroup: 'ST Undergraduates & Postgraduates in premier notified institutes (IIT/IIM/NIT/AIIMS)',
    annualIncomeCeiling: 600000,
    academicLevel: 'Undergraduate',
    applicationPeriod: 'Aug 15, 2026 – Dec 15, 2026',
    deadlineDate: '15 Dec 2026',
    sourceUrl: OFFICIAL_MOTA_URL,
    guidelinesUrl: 'https://tribal.nic.in/writereaddata/Schemes/TopClass-ST-Guidelines.pdf',
    keyBenefitsList: [
      'Full tuition fee and non-refundable charges (capped up to ₹2.5 Lakhs in private or full in govt)',
      'Living expenses: ₹3,000/month (₹36,000/annum)',
      'Books and stationery allowance: ₹5,000/annum',
      'One-time computer/laptop allowance: ₹45,000'
    ],
    mandatoryDocuments: [
      'Allotment letter / Admission card of notified Top Class Institute',
      'ST Certificate verified with state registry',
      'Income Certificate under ₹6.0 Lakhs',
      'Hostel verification certificate'
    ]
  },
  {
    id: 'national-fellowship',
    schemeCode: 'MOTA-SCH-04',
    schemeName: 'National Fellowship for ST Students (NFST)',
    shortName: 'National Fellowship (NFST)',
    category: 'Research',
    pillar: 'fellowship',
    annualSlots: 750,
    description: 'Central Sector Fellowship scheme providing 750 fellowships annually to ST scholars pursuing regular, full-time M.Phil. and Ph.D. degrees in Indian universities.',
    eligibility: 'ST candidates qualifying UGC-NET / CSIR-NET / GATE and registered for regular M.Phil or Ph.D. with no income ceiling limitation.',
    benefitAmount: 384000,
    formattedBenefit: '₹3,84,000 / year (₹32,000/mo JRF)',
    targetGroup: 'ST Research Scholars registered for full-time M.Phil/Ph.D.',
    annualIncomeCeiling: 99999999,
    academicLevel: 'MPhil/PhD',
    applicationPeriod: 'Sep 1, 2026 – Dec 31, 2026',
    deadlineDate: '31 Dec 2026',
    sourceUrl: OFFICIAL_MOTA_URL,
    guidelinesUrl: 'https://tribal.nic.in/writereaddata/Schemes/NFST-Fellowship-Guidelines.pdf',
    keyBenefitsList: [
      'JRF: ₹37,000/month + HRA for initial 2 years',
      'SRF: ₹42,000/month + HRA for remaining 3 years',
      'Contingency grant: ₹10,000 to ₹25,000/annum',
      'Escort/Reader assistance for visually or physically challenged scholars'
    ],
    mandatoryDocuments: [
      'UGC-NET / CSIR-NET or GATE scorecard',
      'Ph.D./M.Phil University Registration letter',
      'ST Community Certificate',
      'Research Supervisor joining report'
    ]
  },
  {
    id: 'national-overseas',
    schemeCode: 'MOTA-SCH-05',
    schemeName: 'National Overseas Scholarship for ST Students (NOS)',
    shortName: 'National Overseas (NOS)',
    category: 'International',
    pillar: 'overseas',
    annualSlots: 20,
    description: 'Prestigious Central Sector Scheme providing financial support to 20 selected ST candidates annually for pursuing Master level, Ph.D. and Post-Doctoral research abroad in top 500 QS world-ranked universities.',
    eligibility: 'ST candidates below 35 years with minimum 55% marks, unconditional admission offer from top 500 QS world-ranked universities, and family income <= ₹6.0 Lakhs.',
    benefitAmount: 1850000,
    formattedBenefit: '₹18,50,000+ (Full Tuition + Living)',
    targetGroup: 'ST Scholars pursuing Masters/Ph.D. in recognized international universities',
    annualIncomeCeiling: 600000,
    academicLevel: 'Overseas Master/PhD',
    applicationPeriod: 'Jun 1, 2026 – Sep 30, 2026',
    deadlineDate: '30 Sep 2026',
    sourceUrl: OFFICIAL_MOTA_URL,
    guidelinesUrl: 'https://tribal.nic.in/writereaddata/Schemes/NOS-ST-Guidelines.pdf',
    keyBenefitsList: [
      'Actual tuition fees paid directly to international university',
      'Annual maintenance allowance: £9,900 (UK) or $15,400 (USA & other countries)',
      'Economy airfare to destination and return after course completion',
      'Contingency allowance and health insurance coverage'
    ],
    mandatoryDocuments: [
      'Unconditional offer letter from QS top 500 foreign university',
      'Valid Indian Passport',
      'ST Community Certificate from District Magistrate',
      'Income Certificate (<= ₹6.0 Lakhs/annum)'
    ],
    isUpcoming: false
  },
  {
    id: 'emrs-fellowship',
    schemeCode: 'MOTA-SCH-06',
    schemeName: 'Eklavya Model Residential Schools (EMRS) National Merit Fellowship',
    shortName: 'EMRS National Fellowship',
    category: 'School',
    pillar: 'national',
    annualSlots: 5000,
    description: 'Prestigious central fellowship recognizing academic excellence and STEM innovation across 400+ Eklavya Model Residential Schools for Scheduled Tribe scholars.',
    eligibility: 'Class 10th and 12th meritorious ST scholars enrolled in notified EMRS institutions across India with >= 75% marks in board examinations.',
    benefitAmount: 25000,
    formattedBenefit: '₹25,000 / year',
    targetGroup: 'EMRS Board Rankers & STEM Innovators (Classes X & XII)',
    annualIncomeCeiling: 350000,
    academicLevel: 'Class 11-12',
    applicationPeriod: 'Nov 1, 2026 – Jan 15, 2027 (Opening Soon)',
    deadlineDate: '15 Jan 2027',
    openingDate: '01 Nov 2026',
    daysUntilOpen: 42,
    isUpcoming: true,
    sourceUrl: OFFICIAL_MOTA_URL,
    guidelinesUrl: 'https://tribal.nic.in/writereaddata/Schemes/EMRS-Guidelines.pdf',
    keyBenefitsList: [
      'Direct annual merit fellowship of ₹25,000 disbursed via APBS',
      'Sponsored delegation participation in National Tribal Youth Science Congress',
      'High-performance tablet and digital science learning grant'
    ],
    mandatoryDocuments: [
      'EMRS Principal Bonafide & Recommendation Certificate',
      'ST Tribe Certificate verified by District Magistrate',
      'Class 10th Marksheet from recognized state/central board'
    ]
  },
  {
    id: 'stem-aviation-girls',
    schemeCode: 'MOTA-SCH-07',
    schemeName: 'MoTA Special Incentive for ST Girls in STEM & Aviation',
    shortName: 'ST Girls in STEM & Aviation',
    category: 'Higher Technical',
    pillar: 'national',
    annualSlots: 500,
    description: 'Targeted central empowerment grant for Scheduled Tribe female students admitted to Commercial Pilot Training (CPT), Aeronautical Engineering, and frontier STEM disciplines.',
    eligibility: 'ST female students admitted to DGCA-approved Flying Training Organisations (FTO) or premier STEM degree programs with parental annual income <= ₹6.0 Lakhs.',
    benefitAmount: 150000,
    formattedBenefit: '₹1,50,000 / year',
    targetGroup: 'ST Female Scholars in Pilot Training & Frontier STEM',
    annualIncomeCeiling: 600000,
    academicLevel: 'Undergraduate',
    applicationPeriod: 'Dec 1, 2026 – Feb 28, 2027 (Opening Soon)',
    deadlineDate: '28 Feb 2027',
    openingDate: '01 Dec 2026',
    daysUntilOpen: 72,
    isUpcoming: true,
    sourceUrl: OFFICIAL_MOTA_URL,
    guidelinesUrl: 'https://tribal.nic.in/writereaddata/Schemes/ST-Girls-STEM-Guidelines.pdf',
    keyBenefitsList: [
      'Full simulator training and flying equipment fee coverage up to ₹1.5 Lakhs/year',
      'Specialized aviation flight kit and safety equipment stipend',
      'Direct one-on-one mentorship with senior DGCA and ISRO tribal scientists'
    ],
    mandatoryDocuments: [
      'Admission / Registration letter from DGCA-approved FTO or STEM Institute',
      'Verified ST Tribe Certificate',
      'Family Income Certificate (<= ₹6.0 Lakhs/annum)',
      'Class 12th Physics & Mathematics passing certificate'
    ]
  }
];

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: 'Sanjay Kumar',
  studentId: 'ST-2026-JH-8831',
  id: 'ST-2026-JH-8831',
  stRegNumber: 'JH/RNC/ST/2024/0942',
  category: 'Scheduled Tribe (ST)',
  tribe: 'Santhal / Oraon',
  subTribe: 'Santhal / Oraon Group',
  stCertificateStatus: 'Verified (Govt Tribal Database)',
  stCertificateNumberMask: 'JH-TRB-XXXX-4912',
  academicYear: '2026–2027',
  currentCourse: 'B.Tech in Computer Science & Engineering',
  currentYear: 3,
  institution: 'National Institute of Technology (NIT) Jamshedpur',
  college: 'National Institute of Technology (NIT) Jamshedpur',
  state: 'Jharkhand',
  domicile: 'Jharkhand',
  district: 'Ranchi',
  profileCompletion: 85,
  annualFamilyIncome: 180000,
  annualIncome: 180000,
  marksPercentage: 84.6,
  phoneMask: '+91 98XXX-XX412',
  emailMask: 'sanjay.***@gmail.com',
  aadhaarMask: 'XXXX-XXXX-8924',
  dbtLinked: true
};

export const INITIAL_PAYMENT_METHOD: PaymentMethod = {
  accountHolder: 'Sanjay Kumar',
  bankName: 'State Bank of India (Demo DBT Account)',
  accountNumberMask: 'XXXX XXXX 4521',
  ifsc: 'SBIN0001234',
  branch: 'Ranchi Main Branch, Jharkhand',
  verificationStatus: 'Verified',
  aadhaarDbtLinked: true,
  npciStatus: 'Active',
  lastValidated: '12 Sep 2026, 11:30 AM via NPCI APBS'
};

export const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: 'doc-st',
    name: 'Scheduled Tribe Certificate',
    category: 'Caste Proof',
    verificationStatus: 'verified',
    uploadedDate: '10 Aug 2026',
    source: 'Government Tribal Welfare Database (Jharkhand e-District)',
    docNumberMask: 'JH/TRB/2022/XXXX-4912',
    fileSize: '1.2 MB PDF',
    digiLockerVerified: true,
    previewUrl: getDocumentPreviewUrl('doc-st', 'Scheduled Tribe Certificate', 'JH/TRB/2022/XXXX-4912')
  },
  {
    id: 'doc-income',
    name: 'Annual Family Income Certificate',
    category: 'Income Proof',
    verificationStatus: 'verified',
    uploadedDate: '14 Aug 2026',
    source: 'Revenue Department (Tehsildar Ranchi)',
    docNumberMask: 'REV/INC/2026/XXXX-8821',
    fileSize: '840 KB PDF',
    digiLockerVerified: true,
    previewUrl: getDocumentPreviewUrl('doc-income', 'Annual Family Income Certificate', 'REV/INC/2026/XXXX-8821')
  },
  {
    id: 'doc-domicile',
    name: 'State Domicile Certificate',
    category: 'Residence Proof',
    verificationStatus: 'verified',
    uploadedDate: '10 Aug 2026',
    source: 'District Administration Ranchi',
    docNumberMask: 'JH/DOM/2023/XXXX-1029',
    fileSize: '950 KB PDF',
    digiLockerVerified: true,
    previewUrl: getDocumentPreviewUrl('doc-domicile', 'State Domicile Certificate', 'JH/DOM/2023/XXXX-1029')
  },
  {
    id: 'doc-aadhaar',
    name: 'Aadhaar Card / UIDAI Identity',
    category: 'Identity Proof',
    verificationStatus: 'verified',
    uploadedDate: '01 Aug 2026',
    source: 'UIDAI e-KYC Verification',
    docNumberMask: 'XXXXXXXX8924',
    fileSize: '512 KB PDF',
    digiLockerVerified: true,
    previewUrl: getDocumentPreviewUrl('doc-aadhaar', 'Aadhaar Card / UIDAI Identity', 'XXXXXXXX8924')
  },
  {
    id: 'doc-marksheet',
    name: 'Class 12th & Previous Semester Marksheet',
    category: 'Academic Proof',
    verificationStatus: 'verified',
    uploadedDate: '18 Aug 2026',
    source: 'DigiLocker / CBSE National Academic Depository',
    docNumberMask: 'CBSE/2024/XXXX-5931',
    fileSize: '1.8 MB PDF',
    digiLockerVerified: true,
    previewUrl: getDocumentPreviewUrl('doc-marksheet', 'Class 12th & Previous Semester Marksheet', 'CBSE/2024/XXXX-5931')
  },
  {
    id: 'doc-disability',
    name: 'Disability Certificate (UDID)',
    category: 'Special Allowance',
    verificationStatus: 'manual_review',
    uploadedDate: '20 Aug 2026',
    source: 'Swavlamban Card Portal (Pending Nodal Match)',
    docNumberMask: 'UDID/2025/XXXX-0012',
    fileSize: '720 KB PDF',
    digiLockerVerified: false,
    previewUrl: getDocumentPreviewUrl('doc-disability', 'Disability Certificate (UDID)', 'UDID/2025/XXXX-0012')
  },
  {
    id: 'doc-bank',
    name: 'Bank Passbook / Mandate with DBT Seed',
    category: 'Payment Proof',
    verificationStatus: 'verified',
    uploadedDate: '05 Aug 2026',
    source: 'PFMS Public Financial Management System',
    docNumberMask: 'SBI/XXXX-XXXX-4521',
    fileSize: '640 KB PDF',
    digiLockerVerified: true,
    previewUrl: getDocumentPreviewUrl('doc-bank', 'Bank Passbook / Mandate with DBT Seed', 'SBI/XXXX-XXXX-4521')
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-001',
    applicationNumber: 'MOTA202600123',
    schemeId: 'post-matric',
    schemeName: 'Post-Matric Scholarship for ST Students',
    academicYear: '2026–2027',
    submittedAt: Date.now() - 5000, // Submitted 5 seconds ago! Will escalate in ~25 seconds unless accelerated
    formattedSubmittedDate: '18 Sep 2026, 11:25 AM',
    status: 'Submitted',
    verificationStatus: 'Institute Verification In Progress',
    sanctionStatus: 'Awaiting District Scrutiny',
    disbursementStatus: 'Queued for Approval',
    lastUpdated: 'Just now',
    timeline: [
      {
        stage: 'Application Submitted',
        description: 'Submitted successfully through MoTA Unified Portal',
        completed: true,
        timestamp: '18 Sep 2026, 11:25 AM',
        current: false
      },
      {
        stage: 'Verification Pending',
        description: 'Pending institute and district nodal officer validation',
        completed: false,
        timestamp: 'In progress',
        current: true
      },
      {
        stage: 'Sanction Order Generated',
        description: 'MoTA scholarship sanction and budget allocation',
        completed: false
      },
      {
        stage: 'PFMS DBT Disbursement',
        description: 'Direct credit to student Aadhaar seeded bank account',
        completed: false
      }
    ]
  },
  {
    id: 'app-002',
    applicationNumber: 'MOTA202600089',
    schemeId: 'top-class',
    schemeName: 'National Fellowship & Scholarship for Higher Education (Top Class)',
    academicYear: '2026–2027',
    submittedAt: Date.now() - 86400000 * 12,
    formattedSubmittedDate: '06 Sep 2026, 03:15 PM',
    status: 'Under Review',
    verificationStatus: 'Verified by Institute Nodal Officer (NIT Jamshedpur)',
    sanctionStatus: 'Under State Level Scrutiny',
    disbursementStatus: 'Pending Final Allocation',
    lastUpdated: '14 Sep 2026',
    timeline: [
      {
        stage: 'Application Submitted',
        description: 'Application details & admission letter uploaded',
        completed: true,
        timestamp: '06 Sep 2026, 03:15 PM'
      },
      {
        stage: 'Institute Verified',
        description: 'NIT Jamshedpur verified enrollment and tuition dues',
        completed: true,
        timestamp: '10 Sep 2026, 10:00 AM'
      },
      {
        stage: 'State Nodal Scrutiny',
        description: 'State Tribal Welfare Department examining quota and income certificate',
        completed: false,
        current: true
      },
      {
        stage: 'MoTA Direct Sanction',
        description: 'Central release through PFMS portal',
        completed: false
      }
    ]
  },
  {
    id: 'app-003',
    applicationNumber: 'MOTA202600041',
    schemeId: 'pre-matric',
    schemeName: 'Pre-Matric Scholarship for ST Students',
    academicYear: '2025–2026',
    submittedAt: Date.now() - 86400000 * 240,
    formattedSubmittedDate: '15 Oct 2025, 09:30 AM',
    status: 'Disbursed',
    verificationStatus: 'Completely Verified',
    sanctionStatus: 'Sanctioned under MoTA State Grant',
    disbursementStatus: 'Transferred via PFMS APBS',
    lastUpdated: '15 Sep 2026',
    timeline: [
      {
        stage: 'Application Submitted',
        description: 'Pre-Matric scholarship renewal filed',
        completed: true,
        timestamp: '15 Oct 2025'
      },
      {
        stage: 'Institute & District Verified',
        description: 'School principal & District Welfare Officer approved',
        completed: true,
        timestamp: '12 Nov 2025'
      },
      {
        stage: 'Sanction Order Issued',
        description: 'Sanction Letter No. MOTA/JH/PM/2025/4412 approved',
        completed: true,
        timestamp: '02 Dec 2025'
      },
      {
        stage: 'DBT Disbursed',
        description: '₹8,000 credited to SBI Account XXXX-4521 (UTR: UTR202509159981)',
        completed: true,
        timestamp: '15 Sep 2026'
      }
    ]
  }
];

export const INITIAL_PAYMENTS: PaymentRecord[] = [
  {
    id: 'pay-001',
    applicationId: 'MOTA202600041',
    schemeName: 'Pre-Matric Scholarship for ST Students',
    amount: 8000,
    formattedAmount: '₹8,000',
    status: 'Disbursed',
    date: '15 Sep 2026',
    academicYear: '2025–2026',
    dbtStatus: 'DBT Success — PFMS Aadhaar Payment Bridge System (APBS)',
    transactionId: 'PFMS2026091500412891',
    bankName: 'State Bank of India',
    accountMask: 'XXXX-XXXX-4521',
    mode: 'Direct Benefit Transfer (DBT)'
  },
  {
    id: 'pay-002',
    applicationId: 'MOTA202600089',
    schemeName: 'Top Class Scholarship (Institute Fee & Maintenance)',
    amount: 50000,
    formattedAmount: '₹50,000',
    status: 'Processing',
    date: '16 Sep 2026 (Batch Queued)',
    academicYear: '2026–2027',
    dbtStatus: 'PFMS Bank Mandate Sent — Awaiting NPCI Clear',
    transactionId: 'TXN-PFMS-TOPCLASS-88412',
    bankName: 'State Bank of India',
    accountMask: 'XXXX-XXXX-4521',
    mode: 'Direct Benefit Transfer (DBT)'
  },
  {
    id: 'pay-003',
    applicationId: 'MOTA202600123',
    schemeName: 'Post-Matric Scholarship (Maintenance Grant)',
    amount: 12000,
    formattedAmount: '₹12,000',
    status: 'Pending',
    date: 'Estimated Oct 2026',
    academicYear: '2026–2027',
    dbtStatus: 'Sanction Pending District Review',
    transactionId: 'PENDING-SANCTION-PM26',
    bankName: 'State Bank of India',
    accountMask: 'XXXX-XXXX-4521',
    mode: 'Direct Benefit Transfer (DBT)'
  },
  {
    id: 'pay-004',
    applicationId: 'MOTA202500012',
    schemeName: 'Post-Matric Scholarship (Previous Academic Session)',
    amount: 17000,
    formattedAmount: '₹17,000',
    status: 'Disbursed',
    date: '28 Mar 2026',
    academicYear: '2025–2026',
    dbtStatus: 'DBT Success — Credited to Student Account',
    transactionId: 'PFMS2026032890048123',
    bankName: 'State Bank of India',
    accountMask: 'XXXX-XXXX-4521',
    mode: 'Direct Benefit Transfer (DBT)'
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Application Submitted',
    message: 'Your Post-Matric Scholarship application (#MOTA202600123) has been successfully recorded in the central repository.',
    type: 'info',
    timestamp: '18 Sep 2026, 11:25 AM',
    timeAgo: 'Just now',
    read: false,
    actionRoute: 'applications'
  },
  {
    id: 'notif-2',
    title: 'Documents Auto-Verified',
    message: 'Your ST Certificate and Domicile have been verified automatically via Jharkhand e-District database.',
    type: 'success',
    timestamp: '18 Sep 2026, 10:45 AM',
    timeAgo: '1 hour ago',
    read: false,
    actionRoute: 'profile'
  },
  {
    id: 'notif-3',
    title: 'Payment Disbursed — ₹8,000',
    message: 'Pre-Matric scholarship grant of ₹8,000 was successfully disbursed to your Aadhaar-linked SBI bank account.',
    type: 'success',
    timestamp: '15 Sep 2026, 02:20 PM',
    timeAgo: '3 days ago',
    read: true,
    actionRoute: 'payments'
  },
  {
    id: 'notif-4',
    title: 'Top Class Review Progress',
    message: 'NIT Jamshedpur institutional nodal officer has approved your course fee breakdown.',
    type: 'info',
    timestamp: '10 Sep 2026, 10:15 AM',
    timeAgo: '8 days ago',
    read: true,
    actionRoute: 'applications'
  }
];

export const INITIAL_MENTORS: Mentor[] = [
  {
    id: 'mentor-1',
    name: 'Asha Murmu',
    role: 'Senior Student & Academic Mentor',
    institution: 'IIT Delhi — B.Tech Computer Science (Final Year)',
    qualification: 'Top Class ST Scholar | JEE Advanced ST Rank 42',
    hometown: 'Dumka, Jharkhand',
    tribalGroup: 'Santhal Community',
    badge: 'Top Class Scholar',
    avatarBg: 'bg-emerald-600',
    initials: 'AM',
    languages: ['Hindi', 'English', 'Santhali'],
    scholarshipsReceived: ['Top Class Scholarship (Full IIT Delhi)', 'State Merit Grant']
  },
  {
    id: 'mentor-2',
    name: 'Ravi Kumar',
    role: 'Senior Student & Career Mentor',
    institution: 'IIM Bangalore — MBA Post-Graduate Programme',
    qualification: 'Alumnus BIT Mesra | CAT 99.1 Percentile',
    hometown: 'Ranchi, Jharkhand',
    tribalGroup: 'Munda Community',
    badge: 'IIM Scholar',
    avatarBg: 'bg-indigo-600',
    initials: 'RK',
    languages: ['Hindi', 'English', 'Mundari'],
    scholarshipsReceived: ['Post-Matric Scholarship', 'Corporate Social Tribal Fellowship']
  },
  {
    id: 'mentor-3',
    name: 'Meena Oraon',
    role: 'Research Scholar & Fellowship Mentor',
    institution: 'University of Hyderabad — M.Sc & Ph.D. Biotechnology',
    qualification: 'NFST Fellow | CSIR-UGC NET JRF Holder',
    hometown: 'Gumla, Jharkhand',
    tribalGroup: 'Oraon Community',
    badge: 'NFST Research Fellow',
    avatarBg: 'bg-amber-600',
    initials: 'MO',
    languages: ['Hindi', 'English', 'Kurukh'],
    scholarshipsReceived: ['National Fellowship for ST Students (NFST)', 'Post-Matric Scholarship']
  },
  {
    id: 'mentor-4',
    name: 'Rajesh Soren',
    role: 'National Overseas Scholar (NOS) Alumni',
    institution: 'Imperial College London & University of Manchester — M.Sc Data Science',
    qualification: 'NOS ST Scholar | MoTA 100% International Grantee (£9,900/yr)',
    hometown: 'Dumka, Jharkhand',
    tribalGroup: 'Santhal Community',
    badge: 'National Overseas Scholar',
    avatarBg: 'bg-blue-600',
    initials: 'RS',
    languages: ['Santhali', 'Hindi', 'English'],
    scholarshipsReceived: ['National Overseas Scholarship (NOS)', 'Top Class Scholarship']
  },
  {
    id: 'mentor-5',
    name: 'Priya Kerketta',
    role: 'Senior Engineer & Tribal Youth Mentor',
    institution: 'IIT Kharagpur — Dual Degree Computer Science',
    qualification: 'National Top Class ST Scholar | Ex-NITian',
    hometown: 'Ranchi, Jharkhand',
    tribalGroup: 'Oraon Community',
    badge: 'Top Class Alumni',
    avatarBg: 'bg-teal-600',
    initials: 'PK',
    languages: ['Hindi', 'English', 'Kurukh'],
    scholarshipsReceived: ['Top Class Scholarship (IIT KGP)', 'Post-Matric Scholarship']
  }
];

export const INITIAL_VERIFICATION_MODULES: VerificationModuleStatus[] = [
  {
    id: 'st-cert',
    name: 'ST Certificate Verification',
    service: 'State Tribal Welfare Database API',
    status: 'verified',
    statusLabel: 'Verified Online',
    detail: 'Certificate JH/TRB/2022/XXXX-4912 authenticated with State Registry',
    lastChecked: '18 Sep 2026'
  },
  {
    id: 'income',
    name: 'Income Verification',
    service: 'Revenue Dept e-District Integration',
    status: 'verified',
    statusLabel: 'Verified Online',
    detail: 'Annual Family Income ₹1,80,000 matches Tehsildar signed certificate',
    lastChecked: '18 Sep 2026'
  },
  {
    id: 'academic',
    name: 'Academic Verification',
    service: 'DigiLocker / National Academic Depository (NAD)',
    status: 'verified',
    statusLabel: 'Verified Online',
    detail: '12th Marks (84.6%) verified with CBSE digital depository',
    lastChecked: '18 Sep 2026'
  },
  {
    id: 'institution',
    name: 'Institution Verification',
    service: 'AISHE (All India Survey on Higher Education)',
    status: 'verified',
    statusLabel: 'Verified AISHE',
    detail: 'NIT Jamshedpur (AISHE: U-0205) is an accredited National Institute',
    lastChecked: '18 Sep 2026'
  },
  {
    id: 'identity',
    name: 'Identity Verification (Aadhaar e-KYC)',
    service: 'UIDAI Authentication Service',
    status: 'verified',
    statusLabel: 'Aadhaar e-KYC Verified',
    detail: 'Demographic match successful with UIDAI seed',
    lastChecked: '18 Sep 2026'
  },
  {
    id: 'bank-dbt',
    name: 'Bank / DBT Verification',
    service: 'PFMS - NPCI Aadhaar Mapper',
    status: 'verified',
    statusLabel: 'DBT Seed Active',
    detail: 'SBI Account XXXX-4521 active on Aadhaar Payment Bridge',
    lastChecked: '18 Sep 2026'
  },
  {
    id: 'doc-layer',
    name: 'Document Completeness Check',
    service: 'Unified OCR & Integrity Validator',
    status: 'manual_review',
    statusLabel: 'Manual Review (Disability)',
    detail: 'Optional UDID disability record flagged for manual nodal scrutiny',
    lastChecked: '18 Sep 2026'
  }
];

export const INITIAL_GRIEVANCES: GrievanceRecord[] = [
  {
    id: 'grv-sample-1',
    grievanceNumber: 'GRV-MOTA-2026-0491',
    applicationNumber: 'MOTA202600089',
    schemeName: 'Top Class Scholarship',
    subject: 'Verification clarification on hostel allowance',
    description: 'Hostel fee receipt discrepancy requested by district officer was re-uploaded.',
    assignedOfficer: 'Shri Manoj Tirkey, IAS',
    officeDesignation: 'District Nodal Officer (Tribal Welfare), Ranchi',
    district: 'Ranchi',
    state: 'Jharkhand',
    status: 'Resolved',
    createdAt: '12 Sep 2026',
    priority: 'Normal',
    timeline: [
      {
        stage: 'Grievance Registered',
        date: '12 Sep 2026, 10:00 AM',
        detail: 'Ticket generated in CPGRAMS-MoTA portal',
        active: true
      },
      {
        stage: 'Assigned to Nodal Officer',
        date: '12 Sep 2026, 02:30 PM',
        detail: 'Forwarded to District Welfare Office Ranchi',
        active: true
      },
      {
        stage: 'Clarification Received',
        date: '13 Sep 2026, 11:15 AM',
        detail: 'Institute warden submitted signed occupancy certificate',
        active: true
      },
      {
        stage: 'Resolved',
        date: '14 Sep 2026, 04:00 PM',
        detail: 'Hostel grant approved and added to sanction batch',
        active: true
      }
    ]
  }
];

export const MOCK_STUDENT_PROFILE = INITIAL_STUDENT_PROFILE;
export const MOCK_SCHEMES = SCHOLARSHIP_SCHEMES;
export const MOCK_APPLICATIONS = INITIAL_APPLICATIONS;
export const MOCK_PAYMENTS = INITIAL_PAYMENTS;
export const MOCK_GRIEVANCES = INITIAL_GRIEVANCES;
export const MOCK_NOTIFICATIONS = INITIAL_NOTIFICATIONS;
export const MOCK_VERIFICATION_MODULES = INITIAL_VERIFICATION_MODULES;
export const MOCK_MENTORS = INITIAL_MENTORS;

// Government Data Sources API Configuration
export const DEFAULT_GOV_API_CONFIGS: GovApiKeyConfig[] = [
  {
    source: 'UIDAI',
    label: 'UIDAI Aadhaar e-KYC & NPCI DBT Gateway',
    subLabel: 'Aadhaar Demographic Auth, Biometric OTP & Bank Seeding Mapper',
    apiKey: 'AUA-MOTA-SANDBOX-8921-X992',
    isCustomKey: false,
    isSandbox: true,
    endpointUrl: 'https://api.uidai.gov.in/auth/v2.5/kyc',
    status: 'connected',
    latencyMs: 94,
    lastTested: '19 Sep 2026, 12:45 PM',
    requiredScopes: ['aadhaar.demographic', 'npci.dbt.mapper', 'otp.validate']
  },
  {
    source: 'DigiLocker',
    label: 'DigiLocker National Depository API',
    subLabel: 'ST Caste Certificate, Income & PRTC Domicile XML Extraction',
    apiKey: 'DL-PARTNER-MOTA-PROD-4912-K8',
    isCustomKey: false,
    isSandbox: true,
    endpointUrl: 'https://api.digitallocker.gov.in/public/v3/pull/certificate',
    status: 'connected',
    latencyMs: 128,
    lastTested: '19 Sep 2026, 12:45 PM',
    requiredScopes: ['caste.st.verify', 'income.revenue.verify', 'domicile.state.prtc']
  },
  {
    source: 'AISHE',
    label: 'AISHE Higher Education Registry API',
    subLabel: 'Nodal Code, College Accreditation, Fee Structure & Bonafide Match',
    apiKey: 'AISHE-NODAL-INGRESS-TOKEN-2026',
    isCustomKey: false,
    isSandbox: true,
    endpointUrl: 'https://aishe.gov.in/api/v1/institution/verify',
    status: 'connected',
    latencyMs: 142,
    lastTested: '19 Sep 2026, 12:45 PM',
    requiredScopes: ['institution.accreditation', 'bonafide.student.match']
  },
  {
    source: 'UDISE',
    label: 'UDISE+ National School Education API',
    subLabel: 'School Code, PEN (Permanent Education Number) & Pre-Matric Enrollment',
    apiKey: 'UDISE-SCHOOL-VERIFY-KEY-8831',
    isCustomKey: false,
    isSandbox: true,
    endpointUrl: 'https://udiseplus.gov.in/api/v2/student/pen/verify',
    status: 'connected',
    latencyMs: 110,
    lastTested: '19 Sep 2026, 12:45 PM',
    requiredScopes: ['pen.student.verify', 'school.udise.validate']
  },
  {
    source: 'APAAR',
    label: 'APAAR / ABC Academic Bank of Credits',
    subLabel: 'One Nation One Student ID & Digital Degree Credit Vault',
    apiKey: 'APAAR-ABC-OAUTH2-GATEWAY-TOKEN',
    isCustomKey: false,
    isSandbox: true,
    endpointUrl: 'https://apaar.education.gov.in/api/v1/credits/academic-record',
    status: 'connected',
    latencyMs: 135,
    lastTested: '19 Sep 2026, 12:45 PM',
    requiredScopes: ['apaar.id.auth', 'abc.credit.transcript', 'ugc.nad.marks']
  }
];

// Initial Government Verification Pipeline Stages
export const INITIAL_GOV_PIPELINE_STAGES: GovPipelineStage[] = [
  {
    id: 'UIDAI',
    title: '1. UIDAI Aadhaar & NPCI DBT Seeding',
    authority: 'Unique Identification Authority of India & NPCI',
    status: 'success',
    progressPercentage: 100,
    latencyMs: 94,
    verifiedData: [
      { label: 'Aadhaar Mask', value: 'XXXX-XXXX-8924', verifiedBadge: 'e-KYC Valid' },
      { label: 'Demographic Match', value: 'Sanjay Kumar (100% Match)', verifiedBadge: 'Biometric OK' },
      { label: 'NPCI DBT Status', value: 'Active on SBI (XXXX-4521)', verifiedBadge: 'APB Seeded' }
    ],
    digitalSignatureHash: '0x8f2a991c4b72ef31b40289...',
    timestamp: '19 Sep 2026, 12:45 PM'
  },
  {
    id: 'DigiLocker',
    title: '2. DigiLocker Caste & Income Pull',
    authority: 'Ministry of Electronics & IT / State Revenue Dept',
    status: 'success',
    progressPercentage: 100,
    latencyMs: 128,
    verifiedData: [
      { label: 'ST Community', value: 'Santhal / Oraon (Recognized ST)', verifiedBadge: 'State Registry Verified' },
      { label: 'ST Cert No.', value: 'JH/TRB/2022/XXXX-4912', verifiedBadge: 'PKI Signed' },
      { label: 'Annual Income', value: '₹1,80,000 (Tehsildar Certified)', verifiedBadge: 'Within ₹2.5L & ₹6.0L' }
    ],
    digitalSignatureHash: '0x3d91b4097a84ce1129bc...',
    timestamp: '19 Sep 2026, 12:45 PM'
  },
  {
    id: 'AISHE',
    title: '3. AISHE Higher Education Institution Check',
    authority: 'Department of Higher Education, Ministry of Education',
    status: 'success',
    progressPercentage: 100,
    latencyMs: 142,
    verifiedData: [
      { label: 'AISHE Code', value: 'U-0205 (NIT Jamshedpur)', verifiedBadge: 'Institute of National Importance' },
      { label: 'Top Class Eligibility', value: 'Notified Premier Institute', verifiedBadge: 'Eligible for 100% Fee' },
      { label: 'Nodal Officer Sign-off', value: 'Prof. S. Soren (Dean Academics)', verifiedBadge: 'Auto-Approved' }
    ],
    digitalSignatureHash: '0x4e881023af91ca2871...',
    timestamp: '19 Sep 2026, 12:45 PM'
  },
  {
    id: 'UDISE',
    title: '4. UDISE+ School Education Cross-Check',
    authority: 'Department of School Education & Literacy',
    status: 'success',
    progressPercentage: 100,
    latencyMs: 110,
    verifiedData: [
      { label: 'UDISE School Ref', value: '20140201902 (Govt Model School)', verifiedBadge: 'Verified School' },
      { label: 'Permanent Education No (PEN)', value: 'PEN-2024-JH-883199', verifiedBadge: 'Class X/XII Complete' },
      { label: 'Prior Pre-Matric Record', value: 'Disbursed in 2025–26 (₹8,000)', verifiedBadge: 'Clean Audit' }
    ],
    digitalSignatureHash: '0x992b10a48ec2718491...',
    timestamp: '19 Sep 2026, 12:45 PM'
  },
  {
    id: 'APAAR',
    title: '5. APAAR / ABC Academic Bank of Credits',
    authority: 'Ministry of Education & National Academic Depository',
    status: 'success',
    progressPercentage: 100,
    latencyMs: 135,
    verifiedData: [
      { label: 'APAAR 12-Digit ID', value: '9821-4402-1928', verifiedBadge: 'One Nation One Student ID' },
      { label: 'Accumulated Credits', value: '112 / 160 B.Tech Credits (CGPA 8.46)', verifiedBadge: 'Good Standing' },
      { label: 'NOS / NFST Pre-Check', value: 'Meets 55% aggregate academic bar', verifiedBadge: 'Eligible' }
    ],
    digitalSignatureHash: '0x718a22bc0914fe5481...',
    timestamp: '19 Sep 2026, 12:45 PM'
  }
];

// Inactive User Status & Proactive Mentorship Plan
export const MOCK_INACTIVE_STATUS: InactiveUserStatus = {
  isInactive: true,
  dormancyDays: 42,
  lastActivityDate: '07 Aug 2026',
  lastActiveStage: 'Draft application saved for Top Class Scholarship (NIT Jamshedpur)',
  unclaimedSchemesCount: 2,
  potentialBenefitAmount: 1936000, // Top Class ₹86,000 + National Overseas ₹18,50,000
  urgencyLevel: 'high'
};

export const MOCK_INACTIVE_USER_PLAN: InactiveUserMentorshipPlan = {
  studentName: 'Sanjay Kumar',
  studentCategory: 'Scheduled Tribe (Santhal / Oraon)',
  assignedMentor: {
    id: 'mentor-4',
    name: 'Rajesh Soren',
    role: 'National Overseas Scholar (NOS) Alumni',
    institution: 'Imperial College London & University of Manchester — M.Sc Data Science',
    qualification: 'NOS ST Scholar | MoTA 100% International Grantee (£9,900/yr)',
    hometown: 'Dumka, Jharkhand',
    tribalGroup: 'Santhal Community',
    badge: 'National Overseas Scholar',
    avatarBg: 'bg-blue-600',
    initials: 'RS',
    languages: ['Santhali', 'Hindi', 'English'],
    scholarshipsReceived: ['National Overseas Scholarship (NOS)', 'Top Class Scholarship']
  },
  unclaimedSchemes: [
    {
      scheme: SCHOLARSHIP_SCHEMES[4], // National Overseas Scholarship
      matchScore: 94,
      eligibilityHighlights: [
        'ST Candidate with >55% marks (Current B.Tech: 84.6%)',
        'Family Annual Income (₹1.80L) is well below the ₹6.0L ceiling',
        'Eligible for 20 annual overseas slots with full tuition + £9,900/yr'
      ],
      missingStepsToClaim: [
        'Select top 500 QS world university target (e.g. UK / USA)',
        'Verify passport details via DigiLocker',
        'Submit 500-word statement of tribal community impact'
      ],
      potentialGrantFormatted: '₹18,50,000+ (100% Tuition & Maintenance)',
      deadlineAlert: 'Closing in 11 days (30 Sep 2026)'
    },
    {
      scheme: SCHOLARSHIP_SCHEMES[2], // Top Class Education
      matchScore: 98,
      eligibilityHighlights: [
        'Enrolled in notified premier institute (NIT Jamshedpur, AISHE: U-0205)',
        'Verified ST certificate & Income under ₹6.0L',
        'One-time computer allowance ₹45,000 + ₹36,000 living allowance unclaimed'
      ],
      missingStepsToClaim: [
        'Upload current semester hostel receipt',
        '1-click digital signature via GovData Pipeline'
      ],
      potentialGrantFormatted: '₹86,000 / year',
      deadlineAlert: 'Closing 15 Dec 2026'
    }
  ],
  personalizedNudgeMessage:
    'Johar Sanjay! I noticed your scholarship application has been inactive for 42 days. As an ST brother from Santhal community in Dumka who completed my Masters in the UK completely funded by MoTA National Overseas Scholarship (£9,900/yr + full tuition), I want to guide you so you never lose out on these life-changing government benefits. Let’s finish your application today!',
  audioVoiceGuidanceAvailable: true,
  recommendedAction: 'Connect with Mentor Rajesh Soren & 1-Click Fast Track Application',
  nudgeHistory: [
    {
      channel: 'WhatsApp',
      sentAt: 'Yesterday, 06:30 PM',
      status: 'Delivered',
      preview: 'MoTA Alert: Sanjay, you have ₹19.3L in unclaimed ST scholarships! Tap to connect with Mentor Rajesh Soren.'
    },
    {
      channel: 'SMS',
      sentAt: '16 Sep 2026, 11:00 AM',
      status: 'Delivered',
      preview: 'Govt of India MoTA: Complete your Top Class ST scholarship renewal before deadline. Nodal assistance active.'
    }
  ]
};


