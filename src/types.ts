export type ApplicationStatus = 'Submitted' | 'Under Review' | 'Disbursed' | 'Escalated';

export type PaymentStatus = 'Pending' | 'Processing' | 'Disbursed' | 'Failed';

export type GrievanceStatus = 'Created' | 'Assigned' | 'Under Review' | 'Resolved';

export type VerificationStatus = 'verified' | 'failed' | 'pending' | 'manual_review';

export type ScholarshipPillar = 'national' | 'overseas' | 'fellowship';

export interface ScholarshipScheme {
  id: string;
  schemeCode: string;
  schemeName: string;
  shortName: string;
  category: 'School' | 'Higher Education' | 'Higher Technical' | 'Research' | 'International';
  pillar: ScholarshipPillar;
  description: string;
  eligibility: string;
  benefitAmount: number;
  formattedBenefit: string;
  targetGroup: string;
  annualIncomeCeiling: number; // in INR
  academicLevel: 'Class 9-10' | 'Class 11-12' | 'Undergraduate' | 'Postgraduate' | 'MPhil/PhD' | 'Overseas Master/PhD';
  applicationPeriod: string;
  deadlineDate: string;
  sourceUrl: string; // https://tribal.nic.in/ScholarshiP.aspx
  guidelinesUrl: string;
  annualSlots?: number;
  sourceDocUrl?: string;
  keyBenefitsList: string[];
  mandatoryDocuments: string[];
  isUpcoming?: boolean;
  openingDate?: string;
  daysUntilOpen?: number;
}

export interface ScholarshipSubscription {
  id: string;
  schemeId: string;
  schemeName: string;
  subscribedAt: string;
  openingDate?: string;
  channels: {
    push: boolean;
    inApp: boolean;
    sms: boolean;
  };
}

export interface Application {
  id: string;
  applicationNumber: string;
  schemeId: string;
  schemeName: string;
  academicYear: string;
  submittedAt: number; // timestamp ms
  formattedSubmittedDate: string;
  status: ApplicationStatus;
  verificationStatus: string;
  sanctionStatus: string;
  disbursementStatus: string;
  lastUpdated: string;
  grievanceId?: string;
  grievanceSummary?: string;
  delayReason?: string;
  timeline: {
    stage: string;
    description: string;
    completed: boolean;
    timestamp?: string;
    current?: boolean;
    escalated?: boolean;
  }[];
}

export interface PaymentRecord {
  id: string;
  applicationId: string;
  schemeName: string;
  amount: number;
  formattedAmount: string;
  status: PaymentStatus;
  date: string;
  academicYear: string;
  dbtStatus: string; // e.g. "Aadhaar Payment Bridge (APB) - Credited"
  transactionId: string;
  bankName: string;
  accountMask: string;
  mode: 'Direct Benefit Transfer (DBT)';
}

export interface DocumentItem {
  id: string;
  name: string;
  category: string;
  verificationStatus: VerificationStatus;
  uploadedDate: string;
  source: string;
  docNumberMask: string;
  fileSize: string;
  digiLockerVerified: boolean;
  previewUrl?: string;
  isCameraScanned?: boolean;
  scannedAt?: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'escalation';
  timestamp: string;
  timeAgo: string;
  read: boolean;
  actionRoute?: string;
}

export interface GrievanceRecord {
  id: string;
  grievanceNumber: string;
  applicationNumber: string;
  schemeName: string;
  subject: string;
  description: string;
  assignedOfficer: string;
  officeDesignation: string;
  district: string;
  state: string;
  status: GrievanceStatus;
  createdAt: string;
  priority: 'High' | 'Normal' | 'Urgent';
  timeline: {
    stage: string;
    date: string;
    detail: string;
    active: boolean;
  }[];
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  institution: string;
  qualification: string;
  hometown: string;
  tribalGroup: string;
  badge: string;
  avatarBg: string;
  initials: string;
  languages: string[];
  scholarshipsReceived: string[];
}

export interface StudentProfile {
  name: string;
  studentId: string;
  id?: string;
  stRegNumber: string;
  category: string;
  tribe?: string;
  subTribe: string;
  stCertificateStatus: 'Verified (Govt Tribal Database)' | 'Pending Verification';
  stCertificateNumberMask: string;
  academicYear: string;
  currentCourse: string;
  currentYear?: number;
  institution: string;
  college?: string;
  state: string;
  domicile?: string;
  district: string;
  profileCompletion: number; // 85
  annualFamilyIncome: number;
  annualIncome?: number;
  marksPercentage?: number;
  phoneMask: string;
  emailMask: string;
  aadhaarMask: string;
  dbtLinked: boolean;
  paymentMethod?: PaymentMethod;
  documents?: DocumentItem[];
}

export interface PaymentSummary {
  totalBenefits: number;
  disbursedAmount: number;
  pendingAmount: number;
  formattedDisbursed: string;
  formattedPending: string;
  formattedTotal: string;
  dbtStatus: string;
}

export interface PaymentMethod {
  accountHolder: string;
  bankName: string;
  accountNumberMask: string;
  ifsc: string;
  branch: string;
  verificationStatus: 'Verified';
  aadhaarDbtLinked: boolean;
  npciStatus: 'Active';
  lastValidated: string;
}

export interface EligibilityCheckPayload {
  studentCategory: string;
  hasStCertificate: boolean;
  annualFamilyIncome: number;
  academicLevel: string;
  institutionType: string;
  marksPercentage: number;
  disabilityStatus: boolean;
  state: string;
  domicile: string;
  course: string;
  hasNetJrf: boolean;
  hasOverseasAdmission: boolean;
}

export interface SchemeEligibilityResult {
  schemeId: string;
  schemeName: string;
  status: 'Eligible' | 'Potentially Eligible' | 'Not Eligible';
  benefitAmount: number;
  reasons: string[];
  actionRecommendation: string;
}

export interface EntitlementWalletData {
  studentId?: string;
  totalEstimatedEntitlement: number;
  eligibleSchemesCount: number;
  eligibleSchemes: {
    schemeId: string;
    schemeName: string;
    benefitAmount?: number;
    estimatedBenefit?: number;
    formattedBenefit: string;
    reason: string;
    status?: 'Eligible' | 'Potentially Eligible';
    applicationPeriod: string;
  }[];
  lastCalculatedAt?: string;
  lastUpdated?: string;
  isAssessed?: boolean;
}

export interface VerificationModuleStatus {
  id: string;
  name: string;
  service: string;
  status: VerificationStatus;
  statusLabel: string;
  detail: string;
  lastChecked: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'jago';
  text: string;
  timestamp: string;
  quickReplies?: string[];
  links?: { label: string; action: string }[];
}

export type Language = 'en' | 'hi' | 'sat' | 'ta';

export interface MentorChatMessage {
  id: string;
  sender: 'student' | 'mentor';
  text: string;
  timestamp: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  studentId: string;
  name: string;
  authMethod: 'aadhaar_otp' | 'student_id' | 'digilocker' | 'demo' | 'new_registration';
  loginTime: string;
}

// Government Data Sources Verification Pipeline Types
export type GovDataSourceKey = 'UIDAI' | 'DigiLocker' | 'AISHE' | 'UDISE' | 'APAAR';

export interface GovApiKeyConfig {
  source: GovDataSourceKey;
  label: string;
  subLabel: string;
  apiKey: string;
  isCustomKey: boolean;
  isSandbox: boolean;
  endpointUrl: string;
  status: 'connected' | 'unconfigured' | 'error';
  latencyMs: number;
  lastTested?: string;
  requiredScopes: string[];
}

export interface GovPipelineStage {
  id: GovDataSourceKey;
  title: string;
  authority: string;
  status: 'idle' | 'running' | 'success' | 'warning' | 'error';
  progressPercentage: number;
  latencyMs?: number;
  verifiedData?: {
    label: string;
    value: string;
    verifiedBadge: string;
  }[];
  digitalSignatureHash?: string;
  timestamp?: string;
  errorMessage?: string;
}

export interface GovPipelineRunResult {
  overallVerified: boolean;
  verificationToken: string;
  timestamp: string;
  stages: GovPipelineStage[];
  summaryMessage: string;
  fastTrackApproved: boolean;
}

// Inactive User Mentorship & Eligibility Engine Types
export interface InactiveUserStatus {
  isInactive: boolean;
  dormancyDays: number;
  lastActivityDate: string;
  lastActiveStage: string;
  unclaimedSchemesCount: number;
  potentialBenefitAmount: number;
  urgencyLevel: 'high' | 'medium' | 'low';
}

export interface UnclaimedSchemeMatch {
  scheme: ScholarshipScheme;
  matchScore: number; // 0 to 100%
  eligibilityHighlights: string[];
  missingStepsToClaim: string[];
  potentialGrantFormatted: string;
  deadlineAlert: string;
}

export interface InactiveUserMentorshipPlan {
  studentName: string;
  studentCategory: string;
  assignedMentor: Mentor;
  unclaimedSchemes: UnclaimedSchemeMatch[];
  personalizedNudgeMessage: string;
  audioVoiceGuidanceAvailable: boolean;
  recommendedAction: string;
  nudgeHistory: {
    channel: 'WhatsApp' | 'SMS' | 'Email' | 'Portal Call';
    sentAt: string;
    status: 'Delivered' | 'Pending' | 'Read';
    preview: string;
  }[];
}

// Read-Only Cached Snapshot for Offline Reference
export interface CachedOfflineSnapshot {
  version: string;
  referenceId: string;
  generatedAt: string;
  formattedDate: string;
  checksum: string;
  studentProfile: StudentProfile;
  applications: Application[];
  paymentSummary?: PaymentSummary;
  payments?: PaymentRecord[];
  entitlementWallet?: EntitlementWalletData;
  verificationModules?: VerificationModuleStatus[];
  offlineIntegrityNotice: string;
}

