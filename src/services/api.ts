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
  EntitlementWalletData,
  EligibilityCheckPayload,
  SchemeEligibilityResult,
  VerificationModuleStatus
} from '../types';

async function safeFetchJson<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);
  const text = await res.text();
  if (!text || text.trim() === '') {
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}: ${res.statusText || 'No response body'}`);
    }
    return {} as T;
  }
  try {
    const data = JSON.parse(text);
    if (!res.ok) {
      throw new Error(data.error || data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err: unknown) {
    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}: ${text.slice(0, 120)}`);
    }
    throw err;
  }
}

export const api = {
  async getScholarships(): Promise<{ schemes: ScholarshipScheme[]; sourceUrl: string }> {
    return safeFetchJson<{ schemes: ScholarshipScheme[]; sourceUrl: string }>('/api/scholarships');
  },

  async getScholarshipSubscriptions(): Promise<{ success: boolean; subscriptions: any[] }> {
    return safeFetchJson<{ success: boolean; subscriptions: any[] }>('/api/scholarships/subscriptions');
  },

  async subscribeScholarship(data: {
    schemeId: string;
    schemeName: string;
    openingDate?: string;
    channels?: { push: boolean; inApp: boolean; sms: boolean };
  }): Promise<{ success: boolean; subscription: any; notifications?: NotificationItem[] }> {
    return safeFetchJson('/api/scholarships/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async unsubscribeScholarship(schemeId: string): Promise<{ success: boolean; subscriptions: any[] }> {
    return safeFetchJson('/api/scholarships/unsubscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ schemeId })
    });
  },

  async simulateSchemeOpen(data: {
    schemeId: string;
    schemeName: string;
  }): Promise<{ success: boolean; notification: NotificationItem; notifications?: NotificationItem[] }> {
    return safeFetchJson('/api/scholarships/simulate-open', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getApplications(): Promise<{
    applications: Application[];
    meta: { total: number; active: number; escalated: number; disbursed: number; demoSimulationRule: string };
  }> {
    return safeFetchJson('/api/applications');
  },

  async createApplication(data: {
    schemeId: string;
    schemeName: string;
    academicYear: string;
  }): Promise<{ success: boolean; application: Application; message?: string }> {
    return safeFetchJson<{ success: boolean; application: Application; message?: string }>('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async escalateApplication(id: string): Promise<{ success: boolean; application: Application }> {
    return safeFetchJson(`/api/applications/${id}/escalate`, { method: 'POST' });
  },

  async triggerEscalation(id: string = 'app-001'): Promise<{ success: boolean; application: Application }> {
    return this.escalateApplication(id);
  },

  async checkEligibility(payload: EligibilityCheckPayload): Promise<{
    success: boolean;
    entitlementWallet: EntitlementWalletData;
    results: SchemeEligibilityResult[];
    disclaimer: string;
  }> {
    return safeFetchJson('/api/eligibility/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
  },

  async getEntitlement(): Promise<{ success?: boolean; entitlementWallet: EntitlementWalletData; wallet?: EntitlementWalletData; disclaimer: string }> {
    const data = await safeFetchJson<{ entitlementWallet: EntitlementWalletData; disclaimer: string }>('/api/entitlement');
    return {
      success: true,
      entitlementWallet: data.entitlementWallet,
      wallet: data.entitlementWallet,
      disclaimer: data.disclaimer
    };
  },

  async getEntitlementWallet(): Promise<{ success: boolean; wallet: EntitlementWalletData; disclaimer: string }> {
    const data = await this.getEntitlement();
    return {
      success: true,
      wallet: data.entitlementWallet,
      disclaimer: data.disclaimer
    };
  },

  async getPayments(): Promise<{
    summary: {
      totalBenefits: number;
      disbursedAmount: number;
      pendingAmount: number;
      formattedDisbursed: string;
      formattedPending: string;
      formattedTotal: string;
      dbtStatus: string;
    };
    payments: PaymentRecord[];
  }> {
    return safeFetchJson('/api/payments');
  },

  async getPaymentSummary(): Promise<{
    success: boolean;
    summary: {
      totalBenefits: number;
      disbursedAmount: number;
      pendingAmount: number;
      formattedDisbursed: string;
      formattedPending: string;
      formattedTotal: string;
      dbtStatus: string;
    };
  }> {
    const data = await this.getPayments();
    return {
      success: true,
      summary: data.summary
    };
  },

  async getDocuments(): Promise<{ digiLockerConnected: boolean; documents: DocumentItem[] }> {
    return safeFetchJson('/api/documents');
  },

  async getNotifications(): Promise<{ unreadCount: number; notifications: NotificationItem[] }> {
    return safeFetchJson('/api/notifications');
  },

  async markNotificationsRead(id?: string): Promise<{ success: boolean; unreadCount: number }> {
    return safeFetchJson('/api/notifications/mark-read', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
    });
  },

  async getGrievances(): Promise<{ grievances: GrievanceRecord[] }> {
    return safeFetchJson('/api/grievances');
  },

  async createGrievance(data: { applicationNumber: string; subject: string; description: string }): Promise<{
    success: boolean;
    grievance: GrievanceRecord;
  }> {
    return safeFetchJson('/api/grievances', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async getMentors(): Promise<{ mentors: Mentor[] }> {
    return safeFetchJson('/api/mentors');
  },

  async getProfile(): Promise<{ profile: StudentProfile }> {
    return safeFetchJson('/api/profile');
  },

  async getVerificationLayer(): Promise<{
    studentId: string;
    overallStatus: string;
    modules: VerificationModuleStatus[];
  }> {
    return safeFetchJson('/api/verification-layer');
  },

  async getPaymentMethod(): Promise<{ paymentMethod: PaymentMethod; disclaimer: string }> {
    return safeFetchJson('/api/payment-method');
  },

  async updatePaymentMethod(data: { bankName: string; ifsc: string }): Promise<{
    success: boolean;
    paymentMethod: PaymentMethod;
  }> {
    return safeFetchJson('/api/payment-method', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
  },

  async sendChatMessage(message: string, language: 'en' | 'hi' | 'ta' | 'sat' | string = 'en'): Promise<{
    reply: string;
    quickReplies: string[];
  }> {
    return safeFetchJson('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, language })
    });
  },

  async askJago(message: string, language: 'en' | 'hi' | 'ta' | 'sat' | string = 'en'): Promise<{
    reply: string;
    quickReplies: string[];
  }> {
    return this.sendChatMessage(message, language);
  },

  async resetDemo(): Promise<{ success: boolean; message: string; application: Application }> {
    return safeFetchJson('/api/demo/reset', { method: 'POST' });
  }
};
