import React from 'react';
import { Home, GraduationCap, FileText, CreditCard, User } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

export type NavTab = 'home' | 'scholarships' | 'applications' | 'payments' | 'profile';

interface BottomNavigationProps {
  activeTab: NavTab;
  onChangeTab?: (tab: NavTab) => void;
  onTabChange?: (tab: NavTab) => void;
  hasEscalated: boolean;
  activeApplicationsCount?: number;
  applicationsCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onChangeTab,
  onTabChange,
  hasEscalated,
  activeApplicationsCount,
  applicationsCount
}) => {
  const { t } = useLanguage();
  const switchTab = onTabChange || onChangeTab || (() => {});
  const appsCount = applicationsCount !== undefined ? applicationsCount : (activeApplicationsCount || 0);

  const tabs = [
    { id: 'home' as NavTab, label: t('nav_home'), icon: Home },
    { id: 'scholarships' as NavTab, label: t('nav_scholarships'), icon: GraduationCap },
    {
      id: 'applications' as NavTab,
      label: t('nav_applications'),
      icon: FileText,
      badge: hasEscalated ? '🚨' : appsCount > 0 ? `${appsCount}` : undefined,
      isAlert: hasEscalated
    },
    { id: 'payments' as NavTab, label: t('nav_payments'), icon: CreditCard },
    { id: 'profile' as NavTab, label: t('nav_profile'), icon: User }
  ];

  return (
    <nav
      id="bottom-navigation-bar"
      aria-label="Main Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-lg pb-safe"
    >
      <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-2 py-1 flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              onClick={() => switchTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1.5 px-3 min-w-[58px] rounded-xl transition-all duration-200 ${
                isActive
                  ? 'text-emerald-800 font-bold'
                  : 'text-slate-500 hover:text-slate-800 font-medium'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.4]' : 'stroke-[1.8]'
                  }`}
                />
                {tab.badge && (
                  <span
                    className={`absolute -top-1.5 -right-2.5 flex items-center justify-center min-w-[16px] h-4 text-[10px] font-extrabold rounded-full px-1 shadow-xs ${
                      tab.isAlert
                        ? 'bg-rose-600 text-white animate-bounce'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] mt-1 tracking-tight leading-none whitespace-nowrap">
                {tab.label}
              </span>
              {isActive && (
                <span className="w-4 h-1 bg-emerald-700 rounded-full mt-1"></span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
