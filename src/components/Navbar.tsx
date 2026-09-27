import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  ShieldCheck,
  HelpCircle,
  User,
  Sparkles,
  LogOut,
  ChevronDown,
  Database,
  Award,
  Home,
  GraduationCap,
  FileText,
  CreditCard,
  HardDrive
} from 'lucide-react';
import { StudentProfile } from '../types';
import { useLanguage } from '../i18n/LanguageContext';
import { PWAInstallButton } from './PWAInstallButton';
import { FloatingLanguageSwitcher } from './FloatingLanguageSwitcher';

export type NavTab = 'home' | 'scholarships' | 'applications' | 'payments' | 'profile';

interface NavbarProps {
  profile: StudentProfile;
  activeTab?: NavTab;
  onTabChange?: (tab: NavTab) => void;
  unreadCount?: number;
  unreadNotificationsCount?: number;
  onOpenNotifications: () => void;
  onOpenHelp?: () => void;
  onOpenProfile: () => void;
  onOpenChecker?: () => void;
  onOpenGovPipeline?: () => void;
  onOpenInactiveMentorship?: () => void;
  onSignOut?: () => void;
  onOpenOfflineSnapshot?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  profile,
  activeTab,
  onTabChange,
  unreadCount,
  unreadNotificationsCount,
  onOpenNotifications,
  onOpenHelp,
  onOpenProfile,
  onOpenChecker,
  onOpenGovPipeline,
  onOpenInactiveMentorship,
  onSignOut,
  onOpenOfflineSnapshot
}) => {
  const { t, language, setLanguage, languages } = useLanguage();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const finalUnreadCount = unreadNotificationsCount !== undefined ? unreadNotificationsCount : (unreadCount || 0);

  const desktopNavItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: t('nav_home'), icon: Home },
    { id: 'scholarships', label: t('nav_scholarships'), icon: GraduationCap },
    { id: 'applications', label: t('nav_applications'), icon: FileText },
    { id: 'payments', label: t('nav_payments'), icon: CreditCard },
    { id: 'profile', label: t('nav_profile'), icon: User },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-xs">
      {/* Tricolor Government Top Strip */}
      <div className="h-1 w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-white border-y border-slate-100"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 flex items-center justify-between">
        {/* Ministry & Emblem Brand */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <div className="flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-serif font-bold text-lg shadow-2xs shrink-0">
            🏛️
          </div>
          <div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-[10px] sm:text-xs tracking-wider uppercase font-semibold text-slate-500">
                {t('gov_india')}
              </span>
              <span className="inline-flex items-center text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                {t('sih_badge')}
              </span>
            </div>
            <h1 className="text-xs sm:text-base font-extrabold text-slate-900 tracking-tight leading-tight">
              {t('mota_title')} <span className="text-slate-400 font-normal hidden lg:inline">| {t('mota_sub')}</span>
            </h1>
          </div>
        </div>

        {/* Desktop Web App Navigation Bar */}
        {onTabChange && (
          <nav className="hidden xl:flex items-center gap-1 bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            {desktopNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`desktop-nav-link-${item.id}`}
                  onClick={() => onTabChange(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-white text-emerald-900 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-700' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Offline Snapshot Quick Action */}
          {onOpenOfflineSnapshot && (
            <button
              id="btn-offline-snapshot-nav"
              type="button"
              onClick={onOpenOfflineSnapshot}
              className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-amber-400 hover:bg-amber-50/70 text-slate-700 text-xs font-semibold transition-all cursor-pointer"
              title="Download or View Offline Scholarship Snapshot (Works 100% Offline)"
            >
              <HardDrive className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden lg:inline text-xs font-bold text-slate-800">Offline Snapshot</span>
            </button>
          )}

          {/* PWA Install Button */}
          <PWAInstallButton variant="navbar" />

          {/* Floating Language Switcher Component */}
          <FloatingLanguageSwitcher />

          {/* GovData Pipeline Modal Button */}
          {onOpenGovPipeline && (
            <button
              id="btn-nav-govdata-pipeline"
              onClick={onOpenGovPipeline}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-900 font-bold text-xs transition-colors cursor-pointer"
              title="Government Data Verification Pipeline (UIDAI, DigiLocker, AISHE, UDISE+, APAAR)"
            >
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              <span>GovData Pipeline</span>
              <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-200 text-emerald-950 font-bold">5 APIs</span>
            </button>
          )}

          {/* Inactive User Mentorship Shortcut */}
          {onOpenInactiveMentorship && (
            <button
              id="btn-nav-inactive-mentorship"
              onClick={onOpenInactiveMentorship}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-300 text-amber-900 font-bold text-xs transition-colors cursor-pointer"
              title="Proactive Mentorship for Inactive Users (₹19.3L Unclaimed)"
            >
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>Mentorship Match</span>
              <span className="text-[9px] font-bold px-1 py-0.2 rounded bg-amber-200 text-amber-950">₹19.3L</span>
            </button>
          )}

          {/* Notifications Button */}
          <button
            id="btn-notifications-nav"
            onClick={onOpenNotifications}
            aria-label="Notifications"
            className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Bell className="w-5 h-5" />
            {finalUnreadCount > 0 && (
              <span className="absolute top-1 right-1 flex items-center justify-center min-w-[18px] h-[18px] text-[10px] font-bold text-white bg-rose-600 rounded-full px-1 shadow-xs ring-2 ring-white animate-pulse">
                {finalUnreadCount}
              </span>
            )}
          </button>

          {/* Student Profile Quick View & Menu */}
          <div className="relative" ref={userMenuRef}>
            <button
              id="btn-profile-nav"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 pl-2 pr-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-left cursor-pointer"
            >
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-2xs">
                {profile.name.charAt(0)}
              </div>
              <div className="hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">{profile.name}</p>
                <p className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5 mt-0.5">
                  <ShieldCheck className="w-2.5 h-2.5" /> {t('verified_st')}
                </p>
              </div>
              <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
            </button>

            {isUserMenuOpen && (
              <div
                className="absolute right-0 mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 z-50 animate-in fade-in"
                onClick={() => setIsUserMenuOpen(false)}
              >
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-800">{profile.name}</p>
                  <p className="text-[10px] text-slate-500 font-mono">{profile.id || profile.studentId}</p>
                </div>

                <button
                  onClick={onOpenProfile}
                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <User className="w-3.5 h-3.5 text-slate-500" />
                  <span>{t('nav_profile')}</span>
                </button>

                {onOpenOfflineSnapshot && (
                  <button
                    id="btn-user-menu-offline-snapshot"
                    onClick={onOpenOfflineSnapshot}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-amber-50/70 flex items-center gap-2"
                  >
                    <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                    <span>{t('offline_snapshot_title')}</span>
                  </button>
                )}

                {onOpenHelp && (
                  <button
                    onClick={onOpenHelp}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
                    <span>{t('nav_help')}</span>
                  </button>
                )}

                {onSignOut && (
                  <div className="border-t border-slate-100 pt-1 mt-1">
                    <button
                      id="btn-signout-nav"
                      onClick={onSignOut}
                      className="w-full text-left px-3 py-2 text-xs text-rose-700 hover:bg-rose-50 flex items-center gap-2 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5 text-rose-600" />
                      <span>{t('sign_out')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
