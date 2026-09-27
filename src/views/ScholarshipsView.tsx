import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Sparkles,
  Search,
  Filter,
  ExternalLink,
  BookOpen,
  Info,
  Globe,
  Award,
  Building2,
  Database,
  ShieldCheck,
  CheckCircle2,
  Bell,
  BellRing,
  Clock,
  Volume2
} from 'lucide-react';
import { ScholarshipScheme, ScholarshipPillar } from '../types';
import { ScholarshipCard } from '../components/ScholarshipCard';
import { NotifyMeModal } from '../components/NotifyMeModal';
import { OFFICIAL_MOTA_URL } from '../data/mockData';
import { useLanguage } from '../i18n/LanguageContext';
import {
  getSubscribedSchemeIds,
  getNotificationPermission,
  requestNotificationPermission,
  isNotificationSupported,
  dispatchPushNotification
} from '../utils/notificationService';

interface ScholarshipsViewProps {
  schemes: ScholarshipScheme[];
  onOpenChecker: () => void;
  onApplyScheme: (schemeId: string) => void;
  onOpenGovPipeline?: () => void;
}

export const ScholarshipsView: React.FC<ScholarshipsViewProps> = ({
  schemes,
  onOpenChecker,
  onApplyScheme,
  onOpenGovPipeline
}) => {
  const { t, language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPillar, setSelectedPillar] = useState<'all' | ScholarshipPillar>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'upcoming'>('all');

  // Push Notification State
  const [subscribedIds, setSubscribedIds] = useState<string[]>([]);
  const [selectedNotifyScheme, setSelectedNotifyScheme] = useState<ScholarshipScheme | null>(null);
  const [pushPermission, setPushPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isRequestingPerm, setIsRequestingPerm] = useState(false);

  useEffect(() => {
    setSubscribedIds(getSubscribedSchemeIds());
    setPushPermission(getNotificationPermission());

    const handleSubChange = () => {
      setSubscribedIds(getSubscribedSchemeIds());
    };

    window.addEventListener('mota-subscription-changed', handleSubChange);
    return () => {
      window.removeEventListener('mota-subscription-changed', handleSubChange);
    };
  }, []);

  const handleEnablePushDirectly = async () => {
    setIsRequestingPerm(true);
    try {
      const res = await requestNotificationPermission();
      setPushPermission(res);
      if (res === 'granted') {
        await dispatchPushNotification({
          title: '🔔 MoTA Push Notifications Enabled',
          body: 'You will receive instant alerts for new tribal scholarship openings and deadlines on this device.'
        });
      }
    } catch (err) {
      console.warn('Push permission error', err);
    } finally {
      setIsRequestingPerm(false);
    }
  };

  const categories = [
    { key: 'All', label: t('filter_all') },
    { key: 'School', label: t('filter_prematric') },
    { key: 'Higher Education', label: t('filter_postmatric') },
    { key: 'Higher Technical', label: t('filter_topclass') },
    { key: 'Research', label: t('filter_fellowship') },
    { key: 'International', label: t('filter_overseas') }
  ];

  const upcomingCount = schemes.filter((s) => s.isUpcoming).length;
  const openCount = schemes.filter((s) => !s.isUpcoming).length;

  const filteredSchemes = schemes.filter((s) => {
    const matchesSearch =
      s.schemeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetGroup.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.schemeCode.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPillar = selectedPillar === 'all' || s.pillar === selectedPillar;
    const matchesCategory = selectedCategory === 'All' || s.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'all'
        ? true
        : statusFilter === 'open'
        ? !s.isUpcoming
        : !!s.isUpcoming;

    return matchesSearch && matchesPillar && matchesCategory && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Header Banner - Simple & Professional Government Theme */}
      <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-emerald-700" /> {t('scholarships_heading')}
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
            Central Scheduled Tribe Scholarships
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-xl leading-relaxed">
            {t('scholarships_sub')}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0">
          {onOpenGovPipeline && (
            <button
              id="btn-open-pipeline-schemes"
              onClick={onOpenGovPipeline}
              className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 font-bold text-xs transition-all cursor-pointer"
            >
              <Database className="w-4 h-4 text-emerald-700" />
              <span>GovData Pipeline</span>
            </button>
          )}

          <button
            onClick={onOpenChecker}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t('btn_check_eligibility')}</span>
          </button>
        </div>
      </div>

      {/* Push Notification Callout Banner for Upcoming Schemes */}
      <div
        id="banner-push-notification"
        className="p-4 rounded-2xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border border-indigo-700/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div className="flex items-start sm:items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300 shrink-0">
            <BellRing className="w-5 h-5 text-indigo-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-bold text-white">
                Upcoming Scholarship Schemes & Push Alerts
              </h4>
              <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-full font-bold">
                {upcomingCount} Opening Soon
              </span>
            </div>
            <p className="text-xs text-indigo-200/90 mt-0.5 max-w-2xl leading-relaxed">
              Never miss an ST scholarship opening or deadline. Subscribe to instant Web Push
              notifications to get alerted the minute application portals open for submission.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          {subscribedIds.length > 0 && (
            <div className="text-right mr-1 hidden sm:block">
              <span className="text-[11px] font-bold text-emerald-300 block">
                ✓ {subscribedIds.length} Subscribed
              </span>
              <span className="text-[10px] text-slate-400">Alerts active</span>
            </div>
          )}

          {pushPermission === 'granted' ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-600/50 text-emerald-300 text-xs font-bold">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Web Push Active</span>
            </span>
          ) : (
            <button
              id="btn-enable-browser-push"
              disabled={isRequestingPerm}
              onClick={handleEnablePushDirectly}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all shadow-xs cursor-pointer"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>{isRequestingPerm ? 'Requesting...' : 'Enable Web Push'}</span>
            </button>
          )}

          <button
            id="btn-filter-upcoming-banner"
            onClick={() => setStatusFilter(statusFilter === 'upcoming' ? 'all' : 'upcoming')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all cursor-pointer border border-white/10"
          >
            <span>{statusFilter === 'upcoming' ? 'Show All' : 'View Upcoming'}</span>
          </button>
        </div>
      </div>

      {/* Official MoTA Portal Link & Dataset Card */}
      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Info className="w-4 h-4 text-slate-500 shrink-0" />
          <span>
            Synchronized directly with statutory repository at{' '}
            <strong className="text-slate-900">tribal.nic.in/ScholarshiP.aspx</strong>. Complete statutory guidelines and quota allocations attached.
          </span>
        </div>
        <a
          href={OFFICIAL_MOTA_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 text-emerald-800 hover:text-emerald-950 font-bold shrink-0"
        >
          <span>View Source MoTA Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Application Status Filter Tabs: All, Open Now, Upcoming */}
      <div className="flex items-center justify-between gap-2 flex-wrap bg-white p-2 rounded-2xl border border-slate-200">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 px-2">Filter by Status:</span>
          <button
            id="tab-status-all"
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              statusFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            All Schemes ({schemes.length})
          </button>

          <button
            id="tab-status-open"
            onClick={() => setStatusFilter('open')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              statusFilter === 'open'
                ? 'bg-emerald-800 text-white shadow-2xs'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>{t('filter_open_now') || 'Open for Application'} ({openCount})</span>
          </button>

          <button
            id="tab-status-upcoming"
            onClick={() => setStatusFilter('upcoming')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
              statusFilter === 'upcoming'
                ? 'bg-indigo-700 text-white shadow-2xs'
                : 'text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/80 border border-indigo-200/60'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-500" />
            <span>{t('filter_upcoming') || 'Opening Soon'} ({upcomingCount})</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-400 text-slate-950 font-extrabold">
              Notify Me
            </span>
          </button>
        </div>

        {subscribedIds.length > 0 && (
          <div className="text-xs font-semibold text-emerald-800 flex items-center gap-1 px-3">
            <BellRing className="w-3.5 h-3.5 text-emerald-700" />
            <span>{subscribedIds.length} schemes subscribed for opening alerts</span>
          </div>
        )}
      </div>

      {/* Three Major Pillars Interactive Switcher */}
      <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            Filter by Central MoTA Pillar
          </span>
          <span className="text-[11px] font-mono text-emerald-800 font-bold">
            {filteredSchemes.length} Schemes Displayed
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
          <button
            id="pillar-btn-all"
            onClick={() => setSelectedPillar('all')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPillar === 'all'
                ? 'border-emerald-700 bg-emerald-50 shadow-2xs ring-2 ring-emerald-600/30'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900">All MoTA Schemes</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {schemes.length} Total
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Complete central sector and centrally sponsored portfolio
            </p>
          </button>

          <button
            id="pillar-btn-national"
            onClick={() => setSelectedPillar('national')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPillar === 'national'
                ? 'border-emerald-700 bg-emerald-50 shadow-2xs ring-2 ring-emerald-600/30'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                🏛️ National Schemes
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-blue-100 text-blue-900">
                {schemes.filter((s) => s.pillar === 'national').length} Schemes
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Pre-Matric, Post-Matric, Top Class, EMRS, and STEM Aviation
            </p>
          </button>

          <button
            id="pillar-btn-overseas"
            onClick={() => setSelectedPillar('overseas')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPillar === 'overseas'
                ? 'border-purple-700 bg-purple-50 shadow-2xs ring-2 ring-purple-600/30'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                ✈️ National Overseas (NOS)
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-purple-100 text-purple-900">
                20 Slots
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              Foreign Masters/Ph.D. at QS Top 500 universities (£9.9k / $15.4k)
            </p>
          </button>

          <button
            id="pillar-btn-fellowship"
            onClick={() => setSelectedPillar('fellowship')}
            className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
              selectedPillar === 'fellowship'
                ? 'border-amber-700 bg-amber-50 shadow-2xs ring-2 ring-amber-600/30'
                : 'border-slate-200 bg-slate-50/50 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                🎓 Scholarship Fellowship (NFST)
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-900">
                750 Slots
              </span>
            </div>
            <p className="text-[10px] text-slate-500">
              M.Phil & Ph.D. Research Scholars (₹37,000/mo JRF + HRA)
            </p>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder={t('search_placeholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 bg-white text-xs sm:text-sm focus:outline-emerald-700 font-medium text-slate-900"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheme Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSchemes.map((scheme) => (
          <ScholarshipCard
            key={scheme.id}
            scheme={scheme}
            isSubscribed={subscribedIds.includes(scheme.id)}
            onCheckEligibility={onOpenChecker}
            onApply={onApplyScheme}
            onNotifyMe={(s) => setSelectedNotifyScheme(s)}
          />
        ))}
      </div>

      {filteredSchemes.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-600 text-sm font-medium">
          No scholarship schemes matched your search or category filter.
        </div>
      )}

      {/* Notify Me Modal */}
      <NotifyMeModal
        isOpen={!!selectedNotifyScheme}
        scheme={selectedNotifyScheme}
        onClose={() => setSelectedNotifyScheme(null)}
        onSubscriptionChange={(schemeId, isSub) => {
          setSubscribedIds((prev) =>
            isSub ? [...prev.filter((id) => id !== schemeId), schemeId] : prev.filter((id) => id !== schemeId)
          );
        }}
      />
    </div>
  );
};
