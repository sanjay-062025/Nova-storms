import { Language } from '../types';

export interface Translations {
  // Top Navbar & Branding
  gov_india: string;
  mota_title: string;
  mota_sub: string;
  sih_badge: string;
  verified_st: string;
  sign_in: string;
  sign_out: string;
  switch_account: string;
  select_language: string;

  // Bottom & Menu Navigation
  nav_home: string;
  nav_scholarships: string;
  nav_applications: string;
  nav_payments: string;
  nav_profile: string;
  nav_grievances: string;
  nav_help: string;

  // Demo Control Bar
  demo_bar_title: string;
  demo_sla_timer: string;
  demo_fast_forward: string;
  demo_reset: string;
  demo_active_alert: string;

  // Home View
  greeting_salute: string;
  unified_student_id: string;
  aadhaar_card: string;
  wallet_title: string;
  wallet_sub: string;
  wallet_desc: string;
  btn_check_eligibility: string;
  btn_inspect_verification: string;
  active_applications_title: string;
  dbt_tracker_title: string;
  view_all: string;
  disbursed: string;
  pending_processing: string;
  verified_bank_account: string;

  // Scholarships View
  scholarships_heading: string;
  scholarships_sub: string;
  search_placeholder: string;
  filter_all: string;
  filter_prematric: string;
  filter_postmatric: string;
  filter_topclass: string;
  filter_fellowship: string;
  filter_overseas: string;
  annual_benefit: string;
  income_ceiling: string;
  deadline: string;
  btn_apply_now: string;
  btn_view_details: string;
  btn_notify_me: string;
  btn_subscribed: string;
  badge_upcoming: string;
  filter_open_now: string;
  filter_upcoming: string;
  opens_on: string;

  // Applications View
  applications_heading: string;
  applications_sub: string;
  app_status_submitted: string;
  app_status_under_review: string;
  app_status_escalated: string;
  app_status_disbursed: string;
  escalation_alert_heading: string;
  escalation_alert_desc: string;
  grievance_ticket_label: string;
  assigned_officer_label: string;
  btn_view_grievance: string;
  btn_accelerate: string;

  // Payments View
  payments_heading: string;
  payments_sub: string;
  total_disbursed_label: string;
  pending_dbt_label: string;
  bank_mandate_active: string;
  apbs_status: string;
  transaction_utr: string;
  payment_timeline: string;

  // Profile View
  profile_heading: string;
  category_domicile: string;
  tribe_community: string;
  annual_family_income: string;
  enrolled_institution: string;
  course_study: string;
  academic_progress: string;
  dbt_account_heading: string;
  document_wallet_heading: string;
  mentor_connect_heading: string;
  mentor_connect_sub: string;
  btn_call: string;
  btn_chat: string;
  btn_end_call: string;

  // Auth / Login Page
  auth_portal_title: string;
  auth_portal_sub: string;
  auth_tagline: string;
  tab_sign_in: string;
  tab_sign_up: string;
  login_mode_otp: string;
  login_mode_id: string;
  enter_aadhaar_phone: string;
  btn_send_otp: string;
  enter_otp: string;
  otp_sent_to: string;
  btn_verify_signin: string;
  resend_otp_in: string;
  btn_resend_otp: string;
  enter_student_id: string;
  enter_password: string;
  btn_signin_id: string;
  quick_demo_login: string;
  quick_demo_desc: string;
  or_divider: string;
  signup_name: string;
  signup_tribe: string;
  signup_state: string;
  signup_income: string;
  signup_college: string;
  signup_course: string;
  signup_aadhaar: string;
  signup_phone: string;
  signup_password: string;
  signup_consent: string;
  btn_register_submit: string;
  explore_as_guest: string;

  // JAGO Chatbot
  jago_name: string;
  jago_sub: string;
  jago_placeholder: string;
  jago_default_greeting: string;
  jago_quick_status: string;
  jago_quick_eligibility: string;
  jago_quick_payment: string;
  jago_quick_documents: string;
  jago_quick_grievance: string;

  // Offline Snapshot
  offline_snapshot_title: string;
  offline_snapshot_desc: string;
  btn_download_offline_snapshot: string;
  btn_view_offline_snapshot: string;
  offline_cached_badge: string;

  // Document Camera Scanner
  btn_scan_document: string;
  scan_with_camera: string;
  crop_document: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    gov_india: 'Government of India',
    mota_title: 'Ministry of Tribal Affairs',
    mota_sub: 'Unified Scholarships',
    sih_badge: 'SIH26238',
    verified_st: 'ST Verified',
    sign_in: 'Sign In',
    sign_out: 'Sign Out',
    switch_account: 'Switch Account',
    select_language: 'Language',

    nav_home: 'Home',
    nav_scholarships: 'Scholarships',
    nav_applications: 'Applications',
    nav_payments: 'Payments',
    nav_profile: 'Profile',
    nav_grievances: 'Grievances',
    nav_help: 'Help',

    demo_bar_title: 'SIH26238 Jury Demo Controller',
    demo_sla_timer: 'SLA Escalation Timer:',
    demo_fast_forward: 'Fast-Forward 30s',
    demo_reset: 'Reset Demo',
    demo_active_alert: 'Auto-Escalated Alert Active',

    greeting_salute: 'Namaste',
    unified_student_id: 'Unified Student ID',
    aadhaar_card: 'Aadhaar',
    wallet_title: 'Entitlement Wallet',
    wallet_sub: 'Estimated Benefits for You',
    wallet_desc: 'Computed automatically based on your verified tribal identity and academic enrollment.',
    btn_check_eligibility: 'Check Eligibility',
    btn_inspect_verification: 'Inspect Verification Layer',
    active_applications_title: 'Active Applications',
    dbt_tracker_title: 'DBT Payment Tracker',
    view_all: 'View All',
    disbursed: 'Disbursed',
    pending_processing: 'In Processing',
    verified_bank_account: 'Aadhaar Seeded Account',

    scholarships_heading: 'Tribal Scholarship Schemes',
    scholarships_sub: 'Official Ministry of Tribal Affairs (MoTA) central flagship assistance programs.',
    search_placeholder: 'Search scholarship by name, level, or criteria...',
    filter_all: 'All Schemes',
    filter_prematric: 'Pre-Matric',
    filter_postmatric: 'Post-Matric',
    filter_topclass: 'Top Class',
    filter_fellowship: 'Fellowships',
    filter_overseas: 'Overseas',
    annual_benefit: 'Annual Benefit',
    income_ceiling: 'Family Income Limit',
    deadline: 'Application Deadline',
    btn_apply_now: 'Apply Now',
    btn_view_details: 'Scheme Guidelines',
    btn_notify_me: 'Notify Me',
    btn_subscribed: 'Subscribed',
    badge_upcoming: 'Opening Soon',
    filter_open_now: 'Open for Application',
    filter_upcoming: 'Opening Soon',
    opens_on: 'Opens on',

    applications_heading: 'My Applications & Tracking',
    applications_sub: 'Real-time lifecycle tracking with automated 30-day institutional delay escalation.',
    app_status_submitted: 'Submitted',
    app_status_under_review: 'Under Review',
    app_status_escalated: 'Escalated (🚨 SLA Breach)',
    app_status_disbursed: 'Disbursed',
    escalation_alert_heading: '30-Day Inactivity SLA Breach Detected',
    escalation_alert_desc: 'Central MoTA monitor detected no institute action within 30 days. Auto-escalated to District Nodal Officer.',
    grievance_ticket_label: 'Auto-Grievance Ticket',
    assigned_officer_label: 'Assigned District Nodal Officer',
    btn_view_grievance: 'Track Grievance',
    btn_accelerate: 'Accelerate Escalation (30s Demo)',

    payments_heading: 'Direct Benefit Transfer (DBT) Tracker',
    payments_sub: 'Central PFMS and Aadhaar Payment Bridge (APBS) transaction records.',
    total_disbursed_label: 'Total Disbursed',
    pending_dbt_label: 'Pending Disbursal',
    bank_mandate_active: 'NPCI Aadhaar Mandate Active',
    apbs_status: 'PFMS DBT Mode',
    transaction_utr: 'Transaction UTR',
    payment_timeline: 'Payment Timeline',

    profile_heading: 'Student Profile & e-KYC',
    category_domicile: 'Category & Domicile',
    tribe_community: 'Tribe / Community',
    annual_family_income: 'Annual Family Income',
    enrolled_institution: 'Enrolled Institution',
    course_study: 'Course of Study',
    academic_progress: 'Academic Progress',
    dbt_account_heading: 'Preferred DBT Bank Account',
    document_wallet_heading: 'DigiLocker Document Wallet',
    mentor_connect_heading: 'Mentor Connect',
    mentor_connect_sub: 'Connect with senior tribal scholars for academic and scholarship guidance.',
    btn_call: 'Call',
    btn_chat: 'Chat',
    btn_end_call: 'End Call',

    auth_portal_title: 'Unified Tribal Scholarship Portal',
    auth_portal_sub: 'Ministry of Tribal Affairs • Government of India',
    auth_tagline: 'Empowering Tribal Youth through Seamless Entitlements & Proactive Governance',
    tab_sign_in: 'Student Sign In',
    tab_sign_up: 'New Registration',
    login_mode_otp: 'Aadhaar / Mobile OTP',
    login_mode_id: 'Student ID & Password',
    enter_aadhaar_phone: 'Enter 12-digit Aadhaar or 10-digit Mobile',
    btn_send_otp: 'Send e-KYC OTP',
    enter_otp: 'Enter 6-digit OTP',
    otp_sent_to: 'OTP sent to registered Aadhaar mobile',
    btn_verify_signin: 'Verify & Sign In',
    resend_otp_in: 'Resend OTP in',
    btn_resend_otp: 'Resend OTP',
    enter_student_id: 'Unified Student ID / Reg No.',
    enter_password: 'Password',
    btn_signin_id: 'Sign In with Student ID',
    quick_demo_login: 'Quick Demo Login (Sanjay Kumar, ST Scholar)',
    quick_demo_desc: 'One-click instant login with pre-loaded ST profile, verified documents & applications.',
    or_divider: 'OR',
    signup_name: 'Full Name (as in Aadhaar)',
    signup_tribe: 'Tribal Community / Group',
    signup_state: 'State of Domicile',
    signup_income: 'Annual Family Income (₹)',
    signup_college: 'Current Institution / College',
    signup_course: 'Course & Year of Study',
    signup_aadhaar: '12-digit Aadhaar Number',
    signup_phone: 'Mobile Number',
    signup_password: 'Create Password',
    signup_consent: 'I give consent to fetch my verified ST certificate and academic credentials via DigiLocker and UIDAI e-KYC.',
    btn_register_submit: 'Register & Issue Unified Student ID',
    explore_as_guest: 'Explore Portal as Guest',

    jago_name: 'JAGO',
    jago_sub: 'MoTA Unified Scholarship Assistant',
    jago_placeholder: 'Ask JAGO about schemes, payment status, escalation...',
    jago_default_greeting: 'Namaste Sanjay! I am JAGO, your dedicated MoTA Scholarship Assistant. How can I help with your tribal scholarship applications, DBT disbursements, or eligibility today?',
    jago_quick_status: 'Application Status',
    jago_quick_eligibility: 'Check Eligibility',
    jago_quick_payment: 'Payment Status',
    jago_quick_documents: 'Required Documents',
    jago_quick_grievance: 'Grievance Status',
    offline_snapshot_title: 'Offline Scholarship Snapshot',
    offline_snapshot_desc: 'Download a certified read-only snapshot of your scholarship profile and active applications for offline reference.',
    btn_download_offline_snapshot: 'Download Offline Snapshot',
    btn_view_offline_snapshot: 'View Offline Card',
    offline_cached_badge: 'Offline-Ready Cache',
    btn_scan_document: 'Scan Document',
    scan_with_camera: 'Scan with Camera',
    crop_document: 'Crop & Adjust'
  },

  hi: {
    gov_india: 'भारत सरकार',
    mota_title: 'जनजातीय कार्य मंत्रालय',
    mota_sub: 'एकीकृत छात्रवृत्ति पोर्टल',
    sih_badge: 'SIH26238',
    verified_st: 'अनुसूचित जनजाति सत्यापित',
    sign_in: 'लॉग इन करें',
    sign_out: 'लॉग आउट',
    switch_account: 'खाता बदलें',
    select_language: 'भाषा चुनें',

    nav_home: 'होम',
    nav_scholarships: 'छात्रवृत्तियां',
    nav_applications: 'आवेदन',
    nav_payments: 'भुगतान (DBT)',
    nav_profile: 'प्रोफाइल',
    nav_grievances: 'शिकायतें',
    nav_help: 'सहायता',

    demo_bar_title: 'SIH26238 जूरी डेमो नियंत्रक',
    demo_sla_timer: 'एसएलए एस्केलेशन टाइमर:',
    demo_fast_forward: '30 सेकंड आगे बढ़ाएं',
    demo_reset: 'डेमो रीसेट करें',
    demo_active_alert: 'स्वचालित एस्केलेशन अलर्ट सक्रिय',

    greeting_salute: 'नमस्ते',
    unified_student_id: 'एकीकृत छात्र पहचान संख्या (ID)',
    aadhaar_card: 'आधार',
    wallet_title: 'एंटाइटेलमेंट वॉलेट',
    wallet_sub: 'आपके लिए अनुमानित वित्तीय लाभ',
    wallet_desc: 'आपकी सत्यापित जनजातीय पहचान और शैक्षणिक नामांकन के आधार पर स्वचालित रूप से गणना की गई।',
    btn_check_eligibility: 'पात्रता की जांच करें',
    btn_inspect_verification: 'सत्यापन परत देखें',
    active_applications_title: 'सक्रिय आवेदन',
    dbt_tracker_title: 'डीबीटी भुगतान ट्रैकर',
    view_all: 'सभी देखें',
    disbursed: 'अंतरित (भुगतान हुआ)',
    pending_processing: 'प्रक्रियाधीन',
    verified_bank_account: 'आधार से जुड़ा बैंक खाता',

    scholarships_heading: 'जनजातीय छात्रवृत्ति योजनाएं',
    scholarships_sub: 'जनजातीय कार्य मंत्रालय (MoTA) की आधिकारिक केंद्रीय प्रमुख सहायता योजनाएं।',
    search_placeholder: 'योजना का नाम, स्तर या पात्रता खोजें...',
    filter_all: 'सभी योजनाएं',
    filter_prematric: 'प्री-मैट्रिक',
    filter_postmatric: 'पोस्ट-मैट्रिक',
    filter_topclass: 'टॉप क्लास',
    filter_fellowship: 'फेलोशिप',
    filter_overseas: 'विदेश अध्ययन',
    annual_benefit: 'वार्षिक वित्तीय लाभ',
    income_ceiling: 'पारिवारिक आय सीमा',
    deadline: 'आवेदन की अंतिम तिथि',
    btn_apply_now: 'आवेदन करें',
    btn_view_details: 'योजना दिशानिर्देश',
    btn_notify_me: 'मुझे सूचित करें',
    btn_subscribed: 'सदस्यता ली गई',
    badge_upcoming: 'जल्द शुरू होगा',
    filter_open_now: 'आवेदन जारी',
    filter_upcoming: 'आगामी योजनाएं',
    opens_on: 'शुरू होने की तिथि',

    applications_heading: 'मेरे आवेदन एवं ट्रैकिंग',
    applications_sub: '30 दिनों के संस्थागत विलंब पर स्वचालित शिकायत अग्रेषण के साथ रीयल-टाइम ट्रैकिंग।',
    app_status_submitted: 'जमा किया गया',
    app_status_under_review: 'समीक्षाधीन',
    app_status_escalated: 'अग्रेषित (🚨 SLA उल्लंघन)',
    app_status_disbursed: 'स्वीकृत एवं भुगतानित',
    escalation_alert_heading: '30-दिवसीय सत्यापन विलंब का पता चला',
    escalation_alert_desc: 'संस्थान स्तर पर 30 दिनों से अधिक की निष्क्रियता। स्वचालित रूप से जिला नोडल अधिकारी को शिकायत दर्ज की गई।',
    grievance_ticket_label: 'स्वचालित शिकायत टिकट',
    assigned_officer_label: 'नियुक्त जिला नोडल अधिकारी',
    btn_view_grievance: 'शिकायत ट्रैक करें',
    btn_accelerate: 'त्वरित अग्रेषण (30 सेकंड डेमो)',

    payments_heading: 'प्रत्यक्ष लाभ अंतरण (DBT) ट्रैकर',
    payments_sub: 'केंद्रीय PFMS और आधार भुगतान ब्रिज (APBS) लेन-देन विवरण।',
    total_disbursed_label: 'कुल अंतरित राशि',
    pending_dbt_label: 'लंबित अंतरण',
    bank_mandate_active: 'NPCI आधार मैंडेट सक्रिय',
    apbs_status: 'PFMS DBT प्रणाली',
    transaction_utr: 'लेनदेन UTR संख्या',
    payment_timeline: 'भुगतान समय-सीमा',

    profile_heading: 'छात्र प्रोफाइल एवं ई-केवाईसी',
    category_domicile: 'वर्ग एवं मूल निवास',
    tribe_community: 'जनजाति / समुदाय',
    annual_family_income: 'वार्षिक पारिवारिक आय',
    enrolled_institution: 'नामांकित संस्थान',
    course_study: 'अध्ययन का पाठ्यक्रम',
    academic_progress: 'शैक्षणिक प्रगति',
    dbt_account_heading: 'पसंदीदा डीबीटी बैंक खाता',
    document_wallet_heading: 'डिजिलॉकर दस्तावेज वॉलेट',
    mentor_connect_heading: 'मेंटर कनेक्ट',
    mentor_connect_sub: 'शैक्षणिक एवं छात्रवृत्ति मार्गदर्शन हेतु वरिष्ठ जनजातीय छात्रों से जुड़ें।',
    btn_call: 'कॉल करें',
    btn_chat: 'चैट करें',
    btn_end_call: 'कॉल समाप्त करें',

    auth_portal_title: 'एकीकृत जनजातीय छात्रवृत्ति पोर्टल',
    auth_portal_sub: 'जनजातीय कार्य मंत्रालय • भारत सरकार',
    auth_tagline: 'सहज अधिकारों और पारदर्शी शासन द्वारा जनजातीय युवाओं का सशक्तिकरण',
    tab_sign_in: 'विद्यार्थी लॉगिन',
    tab_sign_up: 'नया पंजीकरण',
    login_mode_otp: 'आधार / मोबाइल ओटीपी',
    login_mode_id: 'विद्यार्थी आईडी और पासवर्ड',
    enter_aadhaar_phone: '12-अंकों का आधार या 10-अंकों का मोबाइल नंबर दर्ज करें',
    btn_send_otp: 'ई-केवाईसी ओटीपी भेजें',
    enter_otp: '6-अंकों का ओटीपी दर्ज करें',
    otp_sent_to: 'पंजीकृत आधार मोबाइल पर ओटीपी भेजा गया',
    btn_verify_signin: 'सत्यापित करें और लॉगिन करें',
    resend_otp_in: 'ओटीपी पुनः भेजें',
    btn_resend_otp: 'ओटीपी पुनः भेजें',
    enter_student_id: 'एकीकृत छात्र पहचान संख्या (ID)',
    enter_password: 'पासवर्ड',
    btn_signin_id: 'आईडी से लॉगिन करें',
    quick_demo_login: 'त्वरित डेमो लॉगिन (संजय कुमार, एसटी विद्वान)',
    quick_demo_desc: 'सत्यापित एसटी प्रोफाइल, दस्तावेज और सक्रिय आवेदनों के साथ एक-क्लिक में प्रवेश करें।',
    or_divider: 'या',
    signup_name: 'पूरा नाम (आधार के अनुसार)',
    signup_tribe: 'जनजातीय समुदाय / समूह',
    signup_state: 'मूल निवास राज्य',
    signup_income: 'वार्षिक पारिवारिक आय (₹)',
    signup_college: 'वर्तमान संस्थान / कॉलेज',
    signup_course: 'पाठ्यक्रम एवं अध्ययन वर्ष',
    signup_aadhaar: '12-अंकों का आधार नंबर',
    signup_phone: 'मोबाइल नंबर',
    signup_password: 'नया पासवर्ड बनाएं',
    signup_consent: 'मैं डिजिलॉकर और यूआईडीएआई ई-केवाईसी के माध्यम से अपने एसटी प्रमाणपत्र एवं शैक्षणिक रिकॉर्ड प्राप्त करने की सहमति देता/देती हूँ।',
    btn_register_submit: 'पंजीकरण करें एवं एकीकृत छात्र आईडी प्राप्त करें',
    explore_as_guest: 'अतिथि के रूप में पोर्टल देखें',

    jago_name: 'जागो (JAGO)',
    jago_sub: 'MoTA एकीकृत छात्रवृत्ति सहायक',
    jago_placeholder: 'जागो से योजनाओं, भुगतान स्थिति या अग्रेषण के बारे में पूछें...',
    jago_default_greeting: 'नमस्ते संजय! मैं जागो, आपका समर्पित जनजातीय कार्य मंत्रालय (MoTA) छात्रवृत्ति सहायक हूँ। आज मैं आपके आवेदनों, डीबीटी भुगतान या पात्रता में कैसे सहायता कर सकता हूँ?',
    jago_quick_status: 'आवेदन की स्थिति',
    jago_quick_eligibility: 'पात्रता जांच',
    jago_quick_payment: 'भुगतान स्थिति',
    jago_quick_documents: 'आवश्यक दस्तावेज',
    jago_quick_grievance: 'शिकायत की स्थिति',
    offline_snapshot_title: 'ऑफ़लाइन छात्रवृत्ति स्नैपशॉट',
    offline_snapshot_desc: 'ऑफ़लाइन संदर्भ के लिए अपनी छात्रवृत्ति प्रोफ़ाइल और सक्रिय आवेदनों का प्रमाणित स्नैपशॉट डाउनलोड करें।',
    btn_download_offline_snapshot: 'ऑफ़लाइन स्नैपशॉट डाउनलोड करें',
    btn_view_offline_snapshot: 'ऑफ़लाइन कार्ड देखें',
    offline_cached_badge: 'ऑफ़लाइन तैयार',
    btn_scan_document: 'दस्तावेज़ स्कैन करें',
    scan_with_camera: 'कैमरे से स्कैन करें',
    crop_document: 'क्रॉप और समायोजित करें'
  },

  sat: {
    gov_india: 'ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨ (भारत सरकार)',
    mota_title: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱵᱟᱵᱚᱛ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ',
    mota_sub: 'ᱡᱩᱢᱤᱫᱽ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱯᱳᱨᱴᱟᱞ',
    sih_badge: 'SIH26238',
    verified_st: 'ᱮᱥ.ᱴᱤ ᱯᱨᱚᱢᱟᱬᱤᱛ',
    sign_in: 'ᱵᱚᱞᱚᱱ (Sign In)',
    sign_out: 'ᱚᱰᱚᱠᱚᱜ (Sign Out)',
    switch_account: 'ᱮᱠᱟᱣᱩᱱᱴ ᱵᱚᱫᱚᱞ',
    select_language: 'ᱯᱟᱹᱨᱥᱤ ᱵᱟᱪᱷᱟᱣ',

    nav_home: 'ᱚᱲᱟᱜ (Home)',
    nav_scholarships: 'ᱥᱠᱚᱞᱟᱨᱥᱤᱯ',
    nav_applications: 'ᱟᱨᱫᱟᱥ (Applications)',
    nav_payments: 'ᱴᱟᱠᱟ (Payments)',
    nav_profile: 'ᱯᱨᱚᱯᱷᱟᱭᱤᱞ',
    nav_grievances: 'ᱥᱤᱠᱟᱹᱭᱟᱹᱛ',
    nav_help: 'ᱜᱚᱲᱚ',

    demo_bar_title: 'SIH26238 ᱡᱩᱨᱤ ᱰᱮᱢᱳ ᱠᱚᱱᱴᱨᱳᱞᱟᱨ',
    demo_sla_timer: 'SLA ᱚᱠᱛᱚ ᱜᱷᱟᱹᱲᱤ:',
    demo_fast_forward: '᱓᱐ ᱴᱤᱯᱤᱡ ᱞᱟᱦᱟᱭ (30s Fast Forward)',
    demo_reset: 'ᱰᱮᱢᱳ ᱫᱚᱦᱲᱟ (Reset)',
    demo_active_alert: 'ᱟᱯᱱᱟᱨᱛᱮ ᱪᱮᱛᱟᱱ ᱵᱷᱮᱡᱟ (Escalated Alert)',

    greeting_salute: 'ᱡᱚᱦᱟᱨ (Johar)',
    unified_student_id: 'ᱡᱩᱢᱤᱫᱽ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱮᱞ (Unified ID)',
    aadhaar_card: 'ᱟᱫᱷᱟᱨ',
    wallet_title: 'ᱦᱚᱠ ᱣᱟᱞᱮᱴ (Entitlement Wallet)',
    wallet_sub: 'ᱟᱢ ᱞᱟᱹᱜᱤᱫ ᱥᱟᱯᱲᱟᱣ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱴᱟᱠᱟ',
    wallet_desc: 'ᱟᱢᱟᱜ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱨᱤᱥ ᱟᱨ ᱠᱚᱞᱮᱡᱽ ᱵᱷᱩᱨᱛᱤ ᱞᱮᱠᱟᱛᱮ ᱦᱤᱥᱟᱹᱵᱽ ᱟᱠᱟᱱᱟ᱾',
    btn_check_eligibility: 'ᱦᱚᱠ ᱧᱮᱞ (Check Eligibility)',
    btn_inspect_verification: 'ᱯᱚᱨᱠᱷᱟᱣ ᱧᱮᱞ (Verification Layer)',
    active_applications_title: 'ᱪᱟᱹᱞᱩ ᱟᱨᱫᱟᱥ ᱠᱚ (Active Applications)',
    dbt_tracker_title: 'DBT ᱴᱟᱠᱟ ᱴᱨᱮᱠᱟᱨ',
    view_all: 'ᱡᱚᱛᱚ ᱧᱮᱞ',
    disbursed: 'ᱧᱟᱢ ᱟᱠᱟᱱᱟ (Disbursed)',
    pending_processing: 'ᱠᱟᱹᱢᱤ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ',
    verified_bank_account: 'ᱟᱫᱷᱟᱨ ᱡᱚᱲᱟᱣ ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ',

    scholarships_heading: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱠᱚ',
    scholarships_sub: 'ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ ᱨᱮᱱᱟᱜ ᱢᱩᱬᱩᱛ ᱡᱚᱡᱚᱱᱟ ᱠᱚ᱾',
    search_placeholder: 'ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱧᱩᱛᱩᱢ ᱥᱮᱸᱫᱽᱨᱟᱭ ᱢᱮ...',
    filter_all: 'ᱡᱚᱛᱚ ᱡᱚᱡᱚᱱᱟ',
    filter_prematric: 'ᱯᱨᱤ-ᱢᱮᱴᱨᱤᱠ',
    filter_postmatric: 'ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ',
    filter_topclass: 'ᱴᱚᱯ ᱠᱞᱟᱥ',
    filter_fellowship: 'ᱯᱷᱮᱞᱳᱥᱤᱯ',
    filter_overseas: 'ᱵᱤᱫᱮᱥ ᱯᱟᱲᱦᱟᱣ',
    annual_benefit: 'ᱥᱮᱨᱢᱟᱠᱤᱭᱟᱹ ᱴᱟᱠᱟ',
    income_ceiling: 'ᱜᱷᱟᱨᱚᱸᱡᱽ ᱟᱨᱡᱟᱣ ᱥᱤᱢᱟᱹ',
    deadline: 'ᱢᱩᱪᱟᱹᱫ ᱢᱟᱦᱟᱸ',
    btn_apply_now: 'ᱟᱨᱫᱟᱥ ᱢᱮ (Apply)',
    btn_view_details: 'ᱡᱚᱡᱚᱱᱟ ᱵᱤᱵᱚᱨᱚᱬ',
    btn_notify_me: 'ᱤᱧ ᱵᱟᱰᱟᱭ ᱦᱚᱪᱚᱧ ᱢᱮ (Notify)',
    btn_subscribed: 'ᱥᱟᱵᱽᱥᱠᱨᱟᱭᱤᱵᱽ ᱦᱩᱭᱮᱱᱟ',
    badge_upcoming: 'ᱞᱚᱜᱚᱱ ᱜᱮ ᱮᱦᱚᱵᱚᱜᱼᱟ',
    filter_open_now: 'ᱟᱨᱫᱟᱥ ᱪᱟᱹᱞᱩ ᱢᱮᱱᱟᱜᱼᱟ',
    filter_upcoming: 'ᱦᱤᱡᱩᱜ ᱠᱟᱱ ᱡᱚᱡᱚᱱᱟ',
    opens_on: 'ᱮᱦᱚᱵᱚᱜ ᱢᱟᱹᱦᱤᱛ',

    applications_heading: 'ᱤᱧᱟᱜ ᱟᱨᱫᱟᱥ ᱟᱨ ᱴᱨᱮᱠᱤᱝ',
    applications_sub: '᱓᱐ ᱢᱟᱦᱟᱸ ᱠᱚᱞᱮᱡᱽ ᱵᱤᱞᱚᱢ ᱠᱷᱟᱱ ᱟᱯᱱᱟᱨᱛᱮ ᱡᱤᱞᱟᱹ ᱚᱯᱷᱤᱥᱟᱨ ᱴᱷᱮᱱ ᱥᱤᱠᱟᱹᱭᱟᱹᱛ ᱪᱟᱞᱟᱜᱼᱟ᱾',
    app_status_submitted: 'ᱮᱢ ᱟᱠᱟᱱᱟ (Submitted)',
    app_status_under_review: 'ᱧᱮᱞ ᱪᱟᱞᱟᱜ ᱠᱟᱱᱟ',
    app_status_escalated: 'ᱪᱮᱛᱟᱱ ᱵᱷᱮᱡᱟ (🚨 SLA Delay)',
    app_status_disbursed: 'ᱴᱟᱠᱟ ᱵᱷᱮᱡᱟᱭᱮᱱᱟ',
    escalation_alert_heading: '᱓᱐ ᱢᱟᱦᱟᱸ ᱠᱷᱚᱱ ᱵᱟᱹᱲᱛᱤ ᱵᱤᱞᱚᱢ ᱧᱟᱢᱮᱱᱟ',
    escalation_alert_desc: 'ᱠᱚᱞᱮᱡᱽ ᱨᱮ ᱵᱤᱞᱚᱢ ᱠᱷᱟᱹᱛᱤᱨ ᱡᱤᱞᱟᱹ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱱᱳᱰᱟᱞ ᱚᱯᱷᱤᱥᱟᱨ ᱴᱷᱮᱱ ᱟᱯᱱᱟᱨᱛᱮ ᱥᱤᱠᱟᱹᱭᱟᱹᱛ ᱮᱢᱮᱱᱟ᱾',
    grievance_ticket_label: 'ᱥᱤᱠᱟᱹᱭᱟᱹᱛ ᱴᱤᱠᱮᱴ ᱮᱞ',
    assigned_officer_label: 'ᱡᱤᱞᱟᱹ ᱱᱳᱰᱟᱞ ᱚᱯᱷᱤᱥᱟᱨ',
    btn_view_grievance: 'ᱥᱤᱠᱟᱹᱭᱟᱹᱛ ᱧᱮᱞ',
    btn_accelerate: 'ᱞᱟᱦᱟᱭ ᱢᱮ (30s Demo)',

    payments_heading: 'DBT ᱴᱟᱠᱟ ᱴᱨᱮᱠᱟᱨ',
    payments_sub: 'PFMS ᱟᱨ ᱟᱫᱷᱟᱨ ᱵᱮᱸᱠ ᱵᱨᱤᱡᱽ (APBS) ᱞᱮᱠᱟᱛᱮ ᱴᱟᱠᱟ ᱦᱤᱡᱩᱜ ᱠᱟᱱᱟ᱾',
    total_disbursed_label: 'ᱡᱚᱛᱚ ᱧᱟᱢ ᱟᱠᱟᱱ ᱴᱟᱠᱟ',
    pending_dbt_label: 'ᱵᱟᱹᱠᱤ ᱴᱟᱠᱟ',
    bank_mandate_active: 'NPCI ᱟᱫᱷᱟᱨ ᱡᱚᱲᱟᱣ ᱢᱮᱱᱟᱜᱼᱟ',
    apbs_status: 'PFMS DBT ᱦᱚᱨᱟ',
    transaction_utr: 'UTR ᱱᱚᱢᱵᱚᱨ',
    payment_timeline: 'ᱴᱟᱠᱟ ᱦᱤᱡᱩᱜ ᱚᱠᱛᱚ',

    profile_heading: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱯᱨᱚᱯᱷᱟᱭᱤᱞ ᱟᱨ e-KYC',
    category_domicile: 'ᱛᱷᱚᱠ ᱟᱨ ᱯᱚᱱᱚᱛ',
    tribe_community: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱨᱤᱥ / ᱡᱟᱹᱛᱤ',
    annual_family_income: 'ᱥᱮᱨᱢᱟᱠᱤᱭᱟᱹ ᱟᱨᱡᱟᱣ',
    enrolled_institution: 'ᱯᱟᱲᱦᱟᱣᱜ ᱠᱟᱱ ᱠᱚᱞᱮᱡᱽ',
    course_study: 'ᱯᱟᱲᱦᱟᱣ ᱠᱳᱨᱥ',
    academic_progress: 'ᱯᱟᱲᱦᱟᱣ ᱞᱟᱦᱟᱱᱛᱤ',
    dbt_account_heading: 'ᱴᱟᱠᱟ ᱦᱤᱡᱩᱜ ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ',
    document_wallet_heading: 'ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱠᱟᱜᱚᱡᱽ ᱣᱟᱞᱮᱴ',
    mentor_connect_heading: 'ᱢᱮᱱᱴᱚᱨ ᱠᱚᱱᱮᱠᱴ (Mentor Connect)',
    mentor_connect_sub: 'ᱥᱮᱬᱟ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱠᱚ ᱥᱟᱶ ᱯᱟᱲᱦᱟᱣ ᱟᱨ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱟᱞᱢᱟᱨᱟᱣ ᱢᱮ᱾',
    btn_call: 'ᱠᱚᱞ (Call)',
    btn_chat: 'ᱪᱮᱴ (Chat)',
    btn_end_call: 'ᱠᱚᱞ ᱠᱟᱴᱟᱣ (End)',

    auth_portal_title: 'ᱡᱩᱢᱤᱫᱽ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱯᱳᱨᱴᱟᱞ',
    auth_portal_sub: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱵᱟᱵᱚᱛ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ • ᱵᱷᱟᱨᱚᱛ ᱥᱚᱨᱠᱟᱨ',
    auth_tagline: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱡᱩᱣᱟᱹᱱ ᱠᱚᱣᱟᱜ ᱥᱮᱪᱮᱫ ᱞᱟᱦᱟᱱᱛᱤ ᱞᱟᱹᱜᱤᱫ ᱥᱚᱨᱠᱟᱨᱤ ᱜᱚᱲᱚ',
    tab_sign_in: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ᱞᱚᱜᱤᱱ',
    tab_sign_up: 'ᱱᱟᱣᱟ ᱧᱩᱛᱩᱢ ᱚᱞ (Sign Up)',
    login_mode_otp: 'ᱟᱫᱷᱟᱨ / ᱢᱳᱵᱟᱭᱤᱞ OTP',
    login_mode_id: 'ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ID ᱟᱨ ᱯᱟᱥᱣᱟᱨᱰ',
    enter_aadhaar_phone: '᱑᱒-ᱮᱞ ᱟᱫᱷᱟᱨ ᱥᱮ ᱑᱐-ᱮᱞ ᱢᱳᱵᱟᱭᱤᱞ ᱮᱢ ᱢᱮ',
    btn_send_otp: 'e-KYC OTP ᱵᱷᱮᱡᱟᱭ ᱢᱮ',
    enter_otp: '᱖-ᱮᱞ OTP ᱮᱢ ᱢᱮ',
    otp_sent_to: 'ᱟᱫᱷᱟᱨ ᱡᱚᱲᱟᱣ ᱢᱳᱵᱟᱭᱤᱞ ᱨᱮ OTP ᱪᱟᱞᱟᱣᱮᱱᱟ',
    btn_verify_signin: 'ᱯᱚᱨᱠᱷᱟᱣ ᱟᱨ ᱞᱚᱜᱤᱱ ᱢᱮ',
    resend_otp_in: 'ᱫᱚᱦᱲᱟ OTP ᱵᱷᱮᱡᱟ',
    btn_resend_otp: 'ᱫᱚᱦᱲᱟ OTP ᱵᱷᱮᱡᱟᱭ ᱢᱮ',
    enter_student_id: 'ᱡᱩᱢᱤᱫᱽ ᱯᱟᱹᱴᱷᱩᱣᱟᱹ ID',
    enter_password: 'ᱯᱟᱥᱣᱟᱨᱰ',
    btn_signin_id: 'ID ᱛᱮ ᱞᱚᱜᱤᱱ ᱢᱮ',
    quick_demo_login: 'ᱞᱚᱜᱚᱱ ᱰᱮᱢᱳ ᱞᱚᱜᱤᱱ (ᱥᱚᱧᱡᱚᱭ ᱠᱩᱢᱟᱨ, ᱮᱥ.ᱴᱤ)',
    quick_demo_desc: 'ᱢᱤᱫ ᱴᱤᱯᱤᱡ ᱛᱮ ᱥᱚᱧᱡᱚᱭᱟᱜ ᱯᱨᱚᱯᱷᱟᱭᱤᱞ, ᱠᱟᱜᱚᱡᱽ ᱟᱨ ᱟᱨᱫᱟᱥ ᱠᱚ ᱧᱮᱞ ᱢᱮ᱾',
    or_divider: 'ᱥᱮ (OR)',
    signup_name: 'ᱯᱩᱨᱟᱹ ᱧᱩᱛᱩᱢ (ᱟᱫᱷᱟᱨ ᱞᱮᱠᱟᱛᱮ)',
    signup_tribe: 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱯᱟᱹᱨᱤᱥ (Santhal, Munda, Oraon, etc.)',
    signup_state: 'ᱯᱚᱱᱚᱛ (State)',
    signup_income: 'ᱥᱮᱨᱢᱟᱠᱤᱭᱟᱹ ᱟᱨᱡᱟᱣ (₹)',
    signup_college: 'ᱠᱚᱞᱮᱡᱽ / ᱤᱱᱥᱴᱤᱴᱤᱭᱩᱴ',
    signup_course: 'ᱠᱳᱨᱥ ᱟᱨ ᱥᱮᱨᱢᱟ',
    signup_aadhaar: '᱑᱒-ᱮᱞ ᱟᱫᱷᱟᱨ ᱱᱚᱢᱵᱚᱨ',
    signup_phone: 'ᱢᱳᱵᱟᱭᱤᱞ ᱱᱚᱢᱵᱚᱨ',
    signup_password: 'ᱯᱟᱥᱣᱟᱨᱰ ᱵᱮᱱᱟᱣ ᱢᱮ',
    signup_consent: 'ᱤᱧ ᱰᱤᱡᱤᱞᱚᱠᱟᱨ ᱟᱨ UIDAI ᱠᱷᱚᱱ ᱤᱧᱟᱜ ᱮᱥ.ᱴᱤ ᱥᱟᱨᱴᱤᱯᱷᱤᱠᱮᱴ ᱟᱨ ᱥᱮᱪᱮᱫ ᱠᱟᱜᱚᱡᱽ ᱦᱟᱛᱟᱣ ᱨᱮ ᱨᱮᱵᱮᱱ ᱢᱮᱱᱟᱹᱧᱟ᱾',
    btn_register_submit: 'ᱧᱩᱛᱩᱢ ᱚᱞ ᱟᱨ ID ᱧᱟᱢ ᱢᱮ',
    explore_as_guest: 'ᱯᱮᱲᱟ ᱞᱮᱠᱟᱛᱮ ᱧᱮᱞ ᱢᱮ (Guest)',

    jago_name: 'ᱡᱟᱜᱳ (JAGO)',
    jago_sub: 'MoTA ᱡᱩᱢᱤᱫᱽ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ',
    jago_placeholder: 'ᱡᱟᱜᱳ ᱴᱷᱮᱱ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ, ᱴᱟᱠᱟ ᱥᱮ ᱥᱤᱠᱟᱹᱭᱟᱹᱛ ᱠᱩᱠᱞᱤ ᱠᱩᱞᱤᱭ ᱢᱮ...',
    jago_default_greeting: 'ᱡᱚᱦᱟᱨ ᱥᱚᱧᱡᱚᱭ! ᱤᱧ ᱡᱟᱜᱳ, ᱟᱢᱟᱜ ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱜᱚᱲᱚᱭᱤᱡ᱾ ᱛᱮᱦᱮᱧ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱟᱨᱫᱟᱥ, ᱴᱟᱠᱟ ᱥᱮ ᱦᱚᱠ ᱵᱟᱵᱚᱛ ᱪᱮᱫ ᱤᱧ ᱜᱚᱲᱚ ᱫᱟᱲᱮᱭᱟᱢᱟ?',
    jago_quick_status: 'ᱟᱨᱫᱟᱥ ᱨᱮᱱᱟᱜ ᱦᱟᱞᱚᱛ',
    jago_quick_eligibility: 'ᱦᱚᱠ ᱯᱚᱨᱠᱷᱟᱣ',
    jago_quick_payment: 'ᱴᱟᱠᱟ ᱧᱟᱢ ᱦᱟᱞᱚᱛ',
    jago_quick_documents: 'ᱞᱟᱹᱠᱛᱤᱭᱟᱱ ᱠᱟᱜᱚᱡᱽ',
    jago_quick_grievance: 'ᱥᱤᱠᱟᱹᱭᱟᱹᱛ ᱦᱟᱞᱚᱛ',
    offline_snapshot_title: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱥᱱᱟᱯᱥᱚᱴ',
    offline_snapshot_desc: 'ᱤᱱᱴᱚᱨᱱᱮᱴ ᱵᱟᱹᱱᱩᱜ ᱚᱠᱛᱚ ᱧᱮᱞ ᱞᱟᱹᱜᱤᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱯᱨᱚᱯᱷᱟᱭᱤᱞ ᱟᱨ ᱟᱨᱫᱟᱥ ᱦᱟᱞᱚᱛ ᱰᱟᱣᱩᱱᱞᱳᱰ ᱢᱮ᱾',
    btn_download_offline_snapshot: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱱᱟᱯᱥᱚᱴ ᱰᱟᱣᱩᱱᱞᱳᱰ',
    btn_view_offline_snapshot: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱠᱟᱨᱰ ᱧᱮᱞ',
    offline_cached_badge: 'ᱚᱯᱷᱞᱟᱭᱤᱱ ᱥᱟᱯᱲᱟᱣ',
    btn_scan_document: 'ᱠᱟᱜᱚᱡᱽ ᱥᱠᱟᱱ',
    scan_with_camera: 'ᱠᱮᱢᱮᱨᱟ ᱛᱮ ᱥᱠᱟᱱ',
    crop_document: 'ᱠᱨᱚᱯ ᱟᱨ ᱥᱟᱯᱲᱟᱣ'
  },

  ta: {
    gov_india: 'இந்திய அரசு',
    mota_title: 'பழங்குடியினர் விவகார அமைச்சகம்',
    mota_sub: 'ஒருங்கிணைந்த கல்வி உதவித்தொகை',
    sih_badge: 'SIH26238',
    verified_st: 'பழங்குடியினர் (ST) சரிபார்க்கப்பட்டது',
    sign_in: 'உள்நுழைக (Sign In)',
    sign_out: 'வெளியேறு (Sign Out)',
    switch_account: 'கணக்கை மாற்று',
    select_language: 'மொழியைத் தேர்ந்தெடுக்கவும்',

    nav_home: 'முகப்பு',
    nav_scholarships: 'உதவித்தொகை',
    nav_applications: 'விண்ணப்பங்கள்',
    nav_payments: 'பணம் செலுத்துதல்',
    nav_profile: 'சுயவிவரம்',
    nav_grievances: 'புகார்கள்',
    nav_help: 'உதவி',

    demo_bar_title: 'SIH26238 ஜூரி டெமோ கட்டுப்பாட்டாளர்',
    demo_sla_timer: 'SLA தாமத டைமர்:',
    demo_fast_forward: '30 வினாடிகள் முன்னோக்கி',
    demo_reset: 'டெமோவை மீட்டமை',
    demo_active_alert: 'தானியங்கி எச்சரிக்கை செயலில் உள்ளது',

    greeting_salute: 'வணக்கம்',
    unified_student_id: 'ஒருங்கிணைந்த மாணவர் எண் (ID)',
    aadhaar_card: 'ஆதார்',
    wallet_title: 'உரிமை பணப்பை (Wallet)',
    wallet_sub: 'உங்களுக்கான மதிப்பிடப்பட்ட நிதிப் பலன்',
    wallet_desc: 'உங்கள் சரிபார்க்கப்பட்ட பழங்குடி அடையாளம் மற்றும் கல்வி சேர்க்கையின் அடிப்படையில் கணக்கிடப்பட்டது.',
    btn_check_eligibility: 'தகுதியைச் சரிபார்க்கவும்',
    btn_inspect_verification: 'சரிபார்ப்பு அடுக்கை ஆய்வு செய்',
    active_applications_title: 'செயலில் உள்ள விண்ணப்பங்கள்',
    dbt_tracker_title: 'DBT நேரடி பணப் பரிமாற்றம்',
    view_all: 'அனைத்தையும் காண்க',
    disbursed: 'வழங்கப்பட்டது (Disbursed)',
    pending_processing: 'செயல்பாட்டில் உள்ளது',
    verified_bank_account: 'ஆதார் இணைக்கப்பட்ட வங்கி கணக்கு',

    scholarships_heading: 'பழங்குடியினர் கல்வி உதவித்தொகை திட்டங்கள்',
    scholarships_sub: 'பழங்குடியினர் விவகார அமைச்சகத்தின் (MoTA) அதிகாரப்பூர்வ மத்திய முதன்மை உதவி திட்டங்கள்.',
    search_placeholder: 'உதவித்தொகை பெயர் அல்லது தகுதியைத் தேடுங்கள்...',
    filter_all: 'அனைத்து திட்டங்கள்',
    filter_prematric: 'பத்தாம் வகுப்பு முன்',
    filter_postmatric: 'பத்தாம் வகுப்பு பின்',
    filter_topclass: 'உயர் கல்வி (Top Class)',
    filter_fellowship: 'ஆராய்ச்சி (Fellowship)',
    filter_overseas: 'வெளிநாட்டு கல்வி',
    annual_benefit: 'ஆண்டு பலன்',
    income_ceiling: 'குடும்ப வருமான வரம்பு',
    deadline: 'விண்ணப்பிக்க கடைசி நாள்',
    btn_apply_now: 'விண்ணப்பிக்கவும்',
    btn_view_details: 'திட்ட வழிகாட்டுதல்கள்',
    btn_notify_me: 'எனக்கு அறிவிக்கவும்',
    btn_subscribed: 'பதிவு செய்யப்பட்டது',
    badge_upcoming: 'விரைவில் தொடங்குகிறது',
    filter_open_now: 'விண்ணப்பிக்கலாம்',
    filter_upcoming: 'வரவிருக்கும் திட்டங்கள்',
    opens_on: 'தொடங்கும் தேதி',

    applications_heading: 'எனது விண்ணப்பங்கள் மற்றும் கண்காணிப்பு',
    applications_sub: '30 நாட்கள் நிறுவன தாமதத்தில் தானியங்கி மாவட்ட அதிகாரி புகார் பதிவுடன் நேரடி கண்காணிப்பு.',
    app_status_submitted: 'சமர்ப்பிக்கப்பட்டது',
    app_status_under_review: 'மதிப்பாய்வில் உள்ளது',
    app_status_escalated: 'தானாக அனுப்பப்பட்டது (🚨 SLA தாமதம்)',
    app_status_disbursed: 'பணம் வழங்கப்பட்டது',
    escalation_alert_heading: '30 நாட்கள் நிறுவன தாமதம் கண்டறியப்பட்டது',
    escalation_alert_desc: 'கல்லூரி சரிபார்ப்பில் 30 நாட்களுக்கு மேல் நடவடிக்கை இல்லை. தானாக மாவட்ட அதிகாரியிடம் புகார் பதிவு செய்யப்பட்டது.',
    grievance_ticket_label: 'தானியங்கி புகார் எண்',
    assigned_officer_label: 'நியமிக்கப்பட்ட மாவட்ட அதிகாரி',
    btn_view_grievance: 'புகாரைக் கண்காணிக்கவும்',
    btn_accelerate: '30 வினாடி டெமோ முடுக்கம்',

    payments_heading: 'நேரடி பணப் பரிமாற்ற (DBT) கண்காணிப்பு',
    payments_sub: 'மத்திய PFMS மற்றும் ஆதார் பேமெண்ட் பிரிட்ஜ் (APBS) பரிவர்த்தனை பதிவுகள்.',
    total_disbursed_label: 'மொத்தம் பெறப்பட்ட தொகை',
    pending_dbt_label: 'நிலுவையில் உள்ள தொகை',
    bank_mandate_active: 'NPCI ஆதார் இணைப்பு செயலில் உள்ளது',
    apbs_status: 'PFMS DBT முறை',
    transaction_utr: 'பரிவர்த்தனை UTR எண்',
    payment_timeline: 'பணம் செலுத்தும் காலவரிசை',

    profile_heading: 'மாணவர் சுயவிவரம் மற்றும் e-KYC',
    category_domicile: 'பிரிவு மற்றும் இருப்பிடம்',
    tribe_community: 'பழங்குடி இனம் / சமூகம்',
    annual_family_income: 'ஆண்டு குடும்ப வருமானம்',
    enrolled_institution: 'பயிலும் நிறுவனம்',
    course_study: 'படிப்பு விவரம்',
    academic_progress: 'கல்வி முன்னேற்றம்',
    dbt_account_heading: 'விருப்பமான DBT வங்கி கணக்கு',
    document_wallet_heading: 'டிஜிலாக்கர் ஆவண பணப்பை',
    mentor_connect_heading: 'வழிகாட்டி இணைப்பு (Mentor Connect)',
    mentor_connect_sub: 'கல்வி மற்றும் உதவித்தொகை வழிகாட்டுதலுக்கு மூத்த பழங்குடி அறிஞர்களுடன் இணையுங்கள்.',
    btn_call: 'அழைக்கவும் (Call)',
    btn_chat: 'உரையாடு (Chat)',
    btn_end_call: 'அழைப்பை முடிக்கவும்',

    auth_portal_title: 'ஒருங்கிணைந்த பழங்குடியினர் கல்வி உதவித்தொகை தளம்',
    auth_portal_sub: 'பழங்குடியினர் விவகார அமைச்சகம் • இந்திய அரசு',
    auth_tagline: 'நேரடி உரிமைகள் மற்றும் வெளிப்படையான நிர்வாகம் மூலம் பழங்குடி இளைஞர்களை மேம்படுத்துதல்',
    tab_sign_in: 'மாணவர் உள்நுழைவு',
    tab_sign_up: 'புதிய பதிவு (Sign Up)',
    login_mode_otp: 'ஆதார் / கைபேசி OTP',
    login_mode_id: 'மாணவர் ID மற்றும் கடவுச்சொல்',
    enter_aadhaar_phone: '12-இலக்க ஆதார் அல்லது 10-இலக்க கைபேசி எண்ணை உள்ளிடவும்',
    btn_send_otp: 'e-KYC OTP அனுப்புக',
    enter_otp: '6-இலக்க OTP உள்ளிடவும்',
    otp_sent_to: 'பதிவு செய்யப்பட்ட கைபேசி எண்ணுக்கு OTP அனுப்பப்பட்டது',
    btn_verify_signin: 'சரிபார்த்து உள்நுழையவும்',
    resend_otp_in: 'மறு OTP அனுப்ப',
    btn_resend_otp: 'OTP மீண்டும் அனுப்புக',
    enter_student_id: 'ஒருங்கிணைந்த மாணவர் ID',
    enter_password: 'கடவுச்சொல்',
    btn_signin_id: 'ID மூலம் உள்நுழைக',
    quick_demo_login: 'விரைவு டெமோ உள்நுழைவு (சஞ்சய் குமார், ST)',
    quick_demo_desc: 'சரிபார்க்கப்பட்ட சுயவிவரம் மற்றும் விண்ணப்பங்களுடன் ஒரே கிளிக்கில் அணுகவும்.',
    or_divider: 'அல்லது',
    signup_name: 'முழு பெயர் (ஆதாரில் உள்ளபடி)',
    signup_tribe: 'பழங்குடி சமூகம் / குழு',
    signup_state: 'இருப்பிட மாநிலம்',
    signup_income: 'ஆண்டு குடும்ப வருமானம் (₹)',
    signup_college: 'கல்லூரி / கல்வி நிறுவனம்',
    signup_course: 'படிப்பு மற்றும் ஆண்டு',
    signup_aadhaar: '12-இலக்க ஆதார் எண்',
    signup_phone: 'கைபேசி எண்',
    signup_password: 'கடவுச்சொல்லை உருவாக்கவும்',
    signup_consent: 'டிஜிலாக்கர் மற்றும் UIDAI e-KYC மூலம் எனது சான்றிதழ்களை பெற ஒப்புக்கொள்கிறேன்.',
    btn_register_submit: 'பதிவு செய்து மாணவர் ID பெறுக',
    explore_as_guest: 'விருந்தினராக பார்வையிடுங்கள்',

    jago_name: 'ஜாகோ (JAGO)',
    jago_sub: 'MoTA கல்வி உதவித்தொகை உதவியாளர்',
    jago_placeholder: 'திட்டங்கள், பணம் அல்லது தாமதம் குறித்து ஜாகோவிடம் கேளுங்கள்...',
    jago_default_greeting: 'வணக்கம் சஞ்சய்! நான் ஜாகோ, உங்கள் MoTA கல்வி உதவித்தொகை உதவியாளர். உங்கள் விண்ணப்பங்கள், DBT பணம் அல்லது தகுதி குறித்து நான் எவ்வாறு உதவ முடியும்?',
    jago_quick_status: 'விண்ணப்ப நிலை',
    jago_quick_eligibility: 'தகுதி சரிபார்ப்பு',
    jago_quick_payment: 'பணப் பரிமாற்ற நிலை',
    jago_quick_documents: 'தேவையான ஆவணங்கள்',
    jago_quick_grievance: 'புகார் நிலை',
    offline_snapshot_title: 'ஆஃப்லைன் உதவித்தொகை ஸ்னாப்ஷாட்',
    offline_snapshot_desc: 'இணையம் இல்லாதபோது பார்க்க உங்கள் சுயவிவரம் மற்றும் விண்ணப்ப நிலையை பதிவிறக்கவும்.',
    btn_download_offline_snapshot: 'ஆஃப்லைன் ஸ்னாப்ஷாட் பதிவிறக்குக',
    btn_view_offline_snapshot: 'ஆஃப்லைன் அட்டை காண்க',
    offline_cached_badge: 'ஆஃப்லைன் தயார்',
    btn_scan_document: 'ஆவணத்தை ஸ்கேன் செய்க',
    scan_with_camera: 'கேமரா மூலம் ஸ்கேன்',
    crop_document: 'செதுக்கி சரிசெய்க'
  }
};
