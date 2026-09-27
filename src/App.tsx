import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { BottomNavigation } from './components/BottomNavigation';
import { DemoControlBar } from './components/DemoControlBar';
import { EligibilityCheckerModal } from './components/EligibilityCheckerModal';
import { GrievanceModal } from './components/GrievanceModal';
import { UnifiedVerificationModal } from './components/UnifiedVerificationModal';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ApplyModal } from './components/ApplyModal';
import { JagoChatbot } from './components/JagoChatbot';
import { GovDataPipelineModal } from './components/GovDataPipelineModal';
import { InactiveUserMentorshipModal } from './components/InactiveUserMentorshipModal';
import { MentorCallModal } from './components/MentorCallModal';
import { MentorChatModal } from './components/MentorChatModal';
import { OfflineIndicator } from './components/OfflineIndicator';
import { InAppPushToast } from './components/InAppPushToast';
import { OfflineSnapshotModal } from './components/OfflineSnapshotModal';

import { HomeView } from './views/HomeView';
import { ScholarshipsView } from './views/ScholarshipsView';
import { ApplicationsView } from './views/ApplicationsView';
import { PaymentsView } from './views/PaymentsView';
import { ProfileView } from './views/ProfileView';
import { AuthView } from './views/AuthView';
import { LanguageProvider } from './i18n/LanguageContext';

import {
  StudentProfile,
  ScholarshipScheme,
  Application,
  PaymentRecord,
  PaymentSummary,
  EntitlementWalletData,
  GrievanceRecord,
  NotificationItem,
  VerificationModuleStatus,
  Mentor,
  PaymentMethod,
  DocumentItem,
  InactiveUserStatus
} from './types';
import { api } from './services/api';
import {
  MOCK_STUDENT_PROFILE,
  MOCK_SCHEMES,
  MOCK_APPLICATIONS,
  MOCK_PAYMENTS,
  MOCK_GRIEVANCES,
  MOCK_NOTIFICATIONS,
  MOCK_VERIFICATION_MODULES,
  MOCK_MENTORS,
  MOCK_INACTIVE_STATUS,
  INITIAL_PAYMENT_METHOD,
  INITIAL_DOCUMENTS
} from './data/mockData';

function ScholarshipDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('mota_auth_session') !== null;
    } catch {
      return true;
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'scholarships' | 'applications' | 'payments' | 'profile'>('home');

  // Core Data States
  const [profile, setProfile] = useState<StudentProfile>(MOCK_STUDENT_PROFILE);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(INITIAL_PAYMENT_METHOD);
  const [documents, setDocuments] = useState<DocumentItem[]>(INITIAL_DOCUMENTS);
  const [schemes, setSchemes] = useState<ScholarshipScheme[]>(MOCK_SCHEMES);
  const [applications, setApplications] = useState<Application[]>(MOCK_APPLICATIONS);
  const [payments, setPayments] = useState<PaymentRecord[]>(MOCK_PAYMENTS);
  const [paymentSummary, setPaymentSummary] = useState<PaymentSummary>({
    totalBenefits: 70000,
    disbursedAmount: 12000,
    pendingAmount: 58000,
    formattedDisbursed: '₹12,000',
    formattedPending: '₹58,000',
    formattedTotal: '₹70,000',
    dbtStatus: 'Active & Verified'
  });
  const [wallet, setWallet] = useState<EntitlementWalletData>({
    studentId: 'ST-2026-JH-8831',
    totalEstimatedEntitlement: 98000,
    eligibleSchemesCount: 2,
    eligibleSchemes: [
      {
        schemeId: 'mota-pms-st',
        schemeName: 'Post-Matric Scholarship for ST Students',
        estimatedBenefit: 12000,
        formattedBenefit: '₹12,000/yr',
        reason: 'Family income ₹1.8L <= ₹2.5L limit; enrolled in B.Tech program.',
        applicationPeriod: 'Jul — Oct 2026'
      },
      {
        schemeId: 'mota-topclass-st',
        schemeName: 'Scholarship for Higher Education (Top Class) for ST Students',
        estimatedBenefit: 86000,
        formattedBenefit: '₹86,000/yr (Full Fee + Allowance)',
        reason: 'Enrolled in premier notified institute (NIT Jamshedpur) & income <= ₹6.0L.',
        applicationPeriod: 'Aug — Nov 2026'
      }
    ],
    lastUpdated: 'Today'
  });
  const [grievances, setGrievances] = useState<GrievanceRecord[]>(MOCK_GRIEVANCES);
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);
  const [verificationModules, setVerificationModules] = useState<VerificationModuleStatus[]>(MOCK_VERIFICATION_MODULES);
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);

  // Modals Visibility
  const [isCheckerOpen, setIsCheckerOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState<string | undefined>(undefined);
  const [isVerificationOpen, setIsVerificationOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [applyModalScheme, setApplyModalScheme] = useState<ScholarshipScheme | null>(null);
  const [isOfflineSnapshotOpen, setIsOfflineSnapshotOpen] = useState(false);

  // Government Data Verification Pipeline & Inactive User Mentorship
  const [isGovPipelineOpen, setIsGovPipelineOpen] = useState(false);
  const [isInactiveMentorshipOpen, setIsInactiveMentorshipOpen] = useState(false);
  const [isSimulatedInactive, setIsSimulatedInactive] = useState(true);
  const [inactiveStatus, setInactiveStatus] = useState<InactiveUserStatus>(MOCK_INACTIVE_STATUS);
  const [selectedMentorForCall, setSelectedMentorForCall] = useState<Mentor | null>(null);
  const [selectedMentorForChat, setSelectedMentorForChat] = useState<Mentor | null>(null);

  // Refresh data from backend
  const refreshBackendData = useCallback(async () => {
    try {
      const [appsRes, notifsRes, grievRes, walletRes, paySumRes] = await Promise.all([
        api.getApplications(),
        api.getNotifications(),
        api.getGrievances(),
        api.getEntitlementWallet(),
        api.getPaymentSummary()
      ]);

      if (appsRes?.applications) {
        setApplications(appsRes.applications);
      }
      if (notifsRes?.notifications) {
        setNotifications(notifsRes.notifications);
      }
      if (grievRes?.grievances) {
        setGrievances(grievRes.grievances);
      }
      if (walletRes?.wallet) {
        setWallet(walletRes.wallet);
      }
      if (paySumRes?.summary) {
        setPaymentSummary(paySumRes.summary);
      }
    } catch (err) {
      // Background poll silently continues
    }
  }, []);

  // Initial fetch and 2.5-second reactive polling loop for 30s auto-escalation
  useEffect(() => {
    refreshBackendData();
    const interval = setInterval(refreshBackendData, 2500);

    const onPushOrSub = () => {
      refreshBackendData();
    };
    window.addEventListener('mota-push-notification', onPushOrSub);
    window.addEventListener('mota-subscription-changed', onPushOrSub);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mota-push-notification', onPushOrSub);
      window.removeEventListener('mota-subscription-changed', onPushOrSub);
    };
  }, [refreshBackendData]);

  // Listen for global event to open offline snapshot modal from any component
  useEffect(() => {
    const handleOpenOfflineSnapshot = () => {
      setIsOfflineSnapshotOpen(true);
    };
    window.addEventListener('mota-open-offline-snapshot', handleOpenOfflineSnapshot);
    return () => {
      window.removeEventListener('mota-open-offline-snapshot', handleOpenOfflineSnapshot);
    };
  }, []);

  // Handler for manual acceleration (fast-forwarding 30s)
  const handleFastForwardEscalation = async (appId?: string) => {
    try {
      const res = await api.triggerEscalation(appId || 'app-1');
      if (res.success) {
        await refreshBackendData();
        setActiveTab('applications');
      }
    } catch (err) {
      console.error('Failed to trigger escalation:', err);
    }
  };

  // Handler for reset demo state
  const handleResetDemoState = async () => {
    try {
      const res = await api.resetDemo();
      if (res.success) {
        await refreshBackendData();
      }
    } catch (err) {
      console.error('Failed to reset demo:', err);
    }
  };

  // Handler for adding manual grievance
  const handleCreateGrievance = async (data: { applicationNumber: string; subject: string; description: string }) => {
    try {
      const res = await api.createGrievance(data);
      if (res.success) {
        await refreshBackendData();
      }
    } catch (err) {
      console.error('Failed to create grievance:', err);
    }
  };

  // Handler for mark all notifications read
  const handleMarkAllNotificationsRead = async () => {
    try {
      await api.markNotificationsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark notifications read:', err);
    }
  };

  // Open apply modal for a scheme
  const handleApplyScheme = (schemeId: string) => {
    const s = schemes.find((item) => item.id === schemeId);
    if (s) {
      setApplyModalScheme(s);
    }
  };

  // Open grievance modal focusing on a specific ID
  const handleOpenGrievance = (grievanceId: string) => {
    setSelectedGrievanceId(grievanceId);
    setIsGrievanceOpen(true);
  };

  // Authentication Handlers
  const handleLoginSuccess = (newProfile?: Partial<StudentProfile>) => {
    try {
      localStorage.setItem(
        'mota_auth_session',
        JSON.stringify({
          studentId: newProfile?.studentId || profile.studentId || profile.id,
          loggedInAt: Date.now()
        })
      );
    } catch (e) {
      console.warn('Could not persist auth session', e);
    }

    if (newProfile) {
      setProfile((prev) => ({
        ...prev,
        ...newProfile
      }));
    }
    setIsAuthenticated(true);
  };

  const handleSignOut = () => {
    try {
      localStorage.removeItem('mota_auth_session');
    } catch (e) {
      console.warn('Could not remove auth session', e);
    }
    setIsAuthenticated(false);
    setActiveTab('home');
  };

  // If user is not authenticated, show AuthView
  if (!isAuthenticated) {
    return (
      <AuthView
        onLoginSuccess={handleLoginSuccess}
        onExploreGuest={() => setIsAuthenticated(true)}
      />
    );
  }

  // Check if any application is escalated for badge & alert purposes
  const hasEscalated = applications.some((a) => a.status === 'Escalated');
  const unreadNotificationCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950 pb-20 md:pb-8">
      {/* 1. Official Government Header */}
      <Navbar
        profile={profile}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        unreadNotificationsCount={unreadNotificationCount}
        onOpenNotifications={() => setIsNotificationOpen(true)}
        onOpenProfile={() => setActiveTab('profile')}
        onOpenChecker={() => setIsCheckerOpen(true)}
        onOpenGovPipeline={() => setIsGovPipelineOpen(true)}
        onOpenInactiveMentorship={() => setIsInactiveMentorshipOpen(true)}
        onSignOut={handleSignOut}
        onOpenOfflineSnapshot={() => setIsOfflineSnapshotOpen(true)}
      />

      {/* 2. Hackathon SIH26238 Demo Control Bar */}
      <DemoControlBar
        onReset={handleResetDemoState}
        onFastForwardEscalate={() => handleFastForwardEscalation('app-1')}
        onOpenEligibility={() => setIsCheckerOpen(true)}
        onLaunchJago={() => {
          const btn = document.getElementById('btn-open-jago-chatbot');
          btn?.click();
        }}
        hasEscalated={hasEscalated}
      />

      {/* 3. Main Body Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {activeTab === 'home' && (
          <HomeView
            profile={profile}
            wallet={wallet}
            applications={applications}
            paymentSummary={paymentSummary}
            schemes={schemes}
            inactiveStatus={inactiveStatus}
            isSimulatedInactive={isSimulatedInactive}
            onToggleInactivity={() => setIsSimulatedInactive((prev) => !prev)}
            onOpenInactiveMentorship={() => setIsInactiveMentorshipOpen(true)}
            onOpenGovPipeline={() => setIsGovPipelineOpen(true)}
            onOpenCallMentor={() => setSelectedMentorForCall(mentors[3] || mentors[0])}
            onOpenChecker={() => setIsCheckerOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onApplyScheme={handleApplyScheme}
            onOpenGrievance={handleOpenGrievance}
          />
        )}

        {activeTab === 'scholarships' && (
          <ScholarshipsView
            schemes={schemes}
            onOpenChecker={() => setIsCheckerOpen(true)}
            onApplyScheme={handleApplyScheme}
            onOpenGovPipeline={() => setIsGovPipelineOpen(true)}
          />
        )}

        {activeTab === 'applications' && (
          <ApplicationsView
            applications={applications}
            onOpenGrievance={handleOpenGrievance}
            onAccelerateEscalate={(appId) => handleFastForwardEscalation(appId)}
            onResetDemo={handleResetDemoState}
            onOpenOfflineSnapshot={() => setIsOfflineSnapshotOpen(true)}
          />
        )}

        {activeTab === 'payments' && (
          <PaymentsView paymentSummary={paymentSummary} payments={payments} profile={profile} />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            paymentMethod={paymentMethod}
            documents={documents}
            verificationModules={verificationModules}
            mentors={mentors}
            applications={applications}
            onOpenUnifiedVerification={() => setIsVerificationOpen(true)}
            onOpenOfflineSnapshot={() => setIsOfflineSnapshotOpen(true)}
            onUpdatePaymentMethod={(data) => {
              setPaymentMethod((prev) => ({
                ...prev,
                ...data
              }));
            }}
            onUseDocument={(doc) => {
              // Attached to session
            }}
          />
        )}
      </main>

      {/* 4. Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        applicationsCount={applications.length}
        hasEscalated={hasEscalated}
      />

      {/* 5. JAGO Chatbot Floating Assistant */}
      <JagoChatbot
        hasEscalated={hasEscalated}
        onOpenChecker={() => setIsCheckerOpen(true)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* 6. Modals and Drawers */}
      <GovDataPipelineModal
        isOpen={isGovPipelineOpen}
        onClose={() => setIsGovPipelineOpen(false)}
        profile={profile}
      />

      <InactiveUserMentorshipModal
        isOpen={isInactiveMentorshipOpen}
        onClose={() => setIsInactiveMentorshipOpen(false)}
        profile={profile}
        onOpenCall={(mentor) => setSelectedMentorForCall(mentor)}
        onOpenChat={(mentor) => setSelectedMentorForChat(mentor)}
        onFastTrackApply={(schemeId) => handleApplyScheme(schemeId)}
      />

      {/* Global Interactive Mentor Voice Call Modal */}
      {selectedMentorForCall && (
        <MentorCallModal
          mentor={selectedMentorForCall}
          studentName={profile.name}
          onClose={() => setSelectedMentorForCall(null)}
          onSwitchToChat={(m) => {
            setSelectedMentorForCall(null);
            setSelectedMentorForChat(m);
          }}
        />
      )}

      {/* Global Interactive Mentor Chat Modal */}
      {selectedMentorForChat && (
        <MentorChatModal
          mentor={selectedMentorForChat}
          studentName={profile.name}
          onClose={() => setSelectedMentorForChat(null)}
          onSwitchToCall={(m) => {
            setSelectedMentorForChat(null);
            setSelectedMentorForCall(m);
          }}
        />
      )}

      <EligibilityCheckerModal
        isOpen={isCheckerOpen}
        onClose={() => setIsCheckerOpen(false)}
        onWalletUpdated={(updatedWallet) => setWallet(updatedWallet)}
      />

      <GrievanceModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        grievances={grievances}
        selectedGrievanceId={selectedGrievanceId}
        onCreateGrievance={handleCreateGrievance}
      />

      <UnifiedVerificationModal
        isOpen={isVerificationOpen}
        onClose={() => setIsVerificationOpen(false)}
        modules={verificationModules}
      />

      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllNotificationsRead}
        onSelectNotification={(route) => {
          if (route === 'applications') setActiveTab('applications');
          if (route === 'payments') setActiveTab('payments');
          if (route === 'grievance') setIsGrievanceOpen(true);
        }}
      />

      <ApplyModal
        scheme={applyModalScheme}
        profile={profile}
        documents={documents}
        paymentMethod={paymentMethod}
        onClose={() => setApplyModalScheme(null)}
        onApplicationCreated={refreshBackendData}
        onNavigateApplications={() => {
          setApplyModalScheme(null);
          setActiveTab('applications');
        }}
        onDocumentAdded={(newDoc) => setDocuments((prev) => [newDoc, ...prev])}
      />

      {/* Offline Scholarship Snapshot Modal */}
      <OfflineSnapshotModal
        isOpen={isOfflineSnapshotOpen}
        onClose={() => setIsOfflineSnapshotOpen(false)}
        profile={profile}
        applications={applications}
        wallet={wallet}
        paymentSummary={paymentSummary}
        payments={payments}
        verificationModules={verificationModules}
      />

      {/* Offline Connectivity Notification Banner */}
      <OfflineIndicator onOpenSnapshotModal={() => setIsOfflineSnapshotOpen(true)} />

      {/* Interactive Web Push Notification Alert Toast */}
      <InAppPushToast />
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <ScholarshipDashboard />
    </LanguageProvider>
  );
}
