import React, { useState, useRef, useEffect } from 'react';
import {
  Globe,
  Languages,
  Check,
  ChevronDown,
  Sparkles,
  Info,
  X,
  BookOpen,
  Award
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import { Language } from '../types';

export interface FloatingLanguageSwitcherProps {
  className?: string;
  showQuickPills?: boolean;
}

export const FloatingLanguageSwitcher: React.FC<FloatingLanguageSwitcherProps> = ({
  className = '',
  showQuickPills = true
}) => {
  const { language, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeLangOption = languages.find((l) => l.code === language) || languages[0];

  const tribalLanguages = languages.filter((l) => l.isTribal);
  const generalLanguages = languages.filter((l) => !l.isTribal);

  return (
    <div
      ref={containerRef}
      id="floating-language-switcher"
      role="region"
      aria-label="Language Switcher"
      className={`relative inline-flex items-center ${className}`}
    >
      {/* ================= FLOATING CAPSULE BAR ================= */}
      <div
        className="flex items-center gap-0.5 p-0.5 sm:p-1 rounded-full bg-slate-100/90 sm:bg-white border border-slate-200/90 shadow-2xs hover:shadow-xs transition-shadow"
      >
        {/* Quick-Switch Segmented Pills (Visible on sm and up) */}
        {showQuickPills && (
          <div
            role="radiogroup"
            aria-label="Quick language selector"
            className="hidden md:flex items-center gap-0.5"
          >
            {languages.map((item) => {
              const isSelected = language === item.code;
              return (
                <button
                  key={item.code}
                  id={`quick-lang-btn-${item.code}`}
                  role="radio"
                  aria-checked={isSelected}
                  type="button"
                  onClick={() => setLanguage(item.code)}
                  className={`relative flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer select-none ${
                    isSelected
                      ? 'bg-emerald-700 text-white font-bold shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 font-medium'
                  }`}
                  title={`Switch interface to ${item.label} (${item.nativeLabel})`}
                >
                  {item.isTribal && (
                    <span
                      className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 ${
                        isSelected ? 'bg-amber-300' : 'bg-emerald-600'
                      }`}
                      title="Tribal Language"
                    />
                  )}
                  <span className="leading-none">{item.nativeLabel}</span>
                  {item.isTribal && (
                    <span
                      className={`text-[9px] font-mono px-1 py-0.2 rounded-xs font-semibold leading-none ${
                        isSelected
                          ? 'bg-emerald-800 text-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      ST
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Floating Details / Mobile Capsule Trigger */}
        <button
          id="btn-floating-lang-toggle"
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-expanded={isOpen}
          aria-haspopup="dialog"
          aria-label={t('select_language')}
          className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-full text-xs transition-all cursor-pointer ${
            isOpen
              ? 'bg-indigo-50 text-indigo-900 border border-indigo-200 font-bold'
              : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-semibold'
          }`}
          title="Open Language & Tribal Script Options"
        >
          <Languages className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
          <span className="font-bold text-xs text-slate-800 md:hidden">
            {activeLangOption.nativeLabel}
          </span>
          <span className="hidden sm:inline-block text-[10px] font-mono text-slate-500 font-semibold md:hidden">
            {activeLangOption.badge}
          </span>
          <ChevronDown
            className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-indigo-600' : ''
            }`}
          />
        </button>
      </div>

      {/* ================= FLOATING POPOVER DIALOG ================= */}
      {isOpen && (
        <div
          id="floating-language-popover"
          role="dialog"
          aria-modal="false"
          aria-label="Language and Tribal Script Selection"
          className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {/* Header */}
          <div className="p-3 sm:p-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                <Globe className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1.5">
                  <span>{t('select_language')}</span>
                  <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    MoTA i18n
                  </span>
                </h3>
                <p className="text-[10px] text-slate-300">
                  Tribal, regional & official language interface
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer transition-colors"
              title="Close language menu"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-2 sm:p-3 max-h-[75vh] overflow-y-auto space-y-3">
            {/* Section 1: Regional Tribal Languages */}
            {tribalLanguages.length > 0 && (
              <div>
                <div className="flex items-center justify-between px-1 mb-1.5">
                  <span className="text-[11px] font-bold text-emerald-800 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Constitutional Tribal Languages</span>
                  </span>
                  <span className="text-[9px] font-mono font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    8th Schedule ST
                  </span>
                </div>

                <div className="space-y-1">
                  {tribalLanguages.map((item) => {
                    const isSelected = language === item.code;
                    return (
                      <button
                        key={item.code}
                        id={`btn-lang-option-${item.code}`}
                        type="button"
                        onClick={() => {
                          setLanguage(item.code);
                          setIsOpen(false);
                        }}
                        className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start justify-between gap-2.5 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/90 border border-emerald-300 text-emerald-950 shadow-2xs ring-1 ring-emerald-400'
                            : 'bg-slate-50/60 hover:bg-emerald-50/40 text-slate-700 border border-slate-200/80 hover:border-emerald-200'
                        }`}
                      >
                        <div className="flex items-start gap-2.5 min-w-0">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              isSelected
                                ? 'bg-emerald-700 text-white'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {item.badge}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className="font-extrabold text-sm text-slate-900 leading-tight">
                                {item.nativeLabel}
                              </span>
                              <span className="text-[11px] font-medium text-slate-500">
                                ({item.label})
                              </span>
                              <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                                Ol Chiki Script
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-600 mt-1 leading-snug">
                              {item.regionInfo}
                            </p>
                            <p className="text-[10px] text-emerald-700 font-mono mt-1">
                              Preview: &ldquo;ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱠᱚ&rdquo; (Scholarship Schemes)
                            </p>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="flex items-center gap-1 shrink-0 mt-1">
                            <span className="text-[9px] font-bold text-emerald-900 bg-emerald-200/80 px-1.5 py-0.5 rounded">
                              Active
                            </span>
                            <Check className="w-4 h-4 text-emerald-700" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Section 2: National & Regional Languages */}
            <div>
              <div className="px-1 mb-1.5 flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-slate-500" />
                  <span>National & Regional Languages</span>
                </span>
                <span className="text-[9px] text-slate-400 font-mono">
                  Official Central
                </span>
              </div>

              <div className="space-y-1">
                {generalLanguages.map((item) => {
                  const isSelected = language === item.code;
                  return (
                    <button
                      key={item.code}
                      id={`btn-lang-option-${item.code}`}
                      type="button"
                      onClick={() => {
                        setLanguage(item.code);
                        setIsOpen(false);
                      }}
                      className={`w-full text-left p-2.5 rounded-xl text-xs flex items-start justify-between gap-2.5 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-amber-50/90 border border-amber-300 text-amber-950 shadow-2xs ring-1 ring-amber-400'
                          : 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/70 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                            isSelected
                              ? 'bg-amber-500 text-slate-950'
                              : 'bg-slate-100 text-slate-700 border border-slate-200'
                          }`}
                        >
                          {item.badge}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="font-extrabold text-sm text-slate-900 leading-tight">
                              {item.nativeLabel}
                            </span>
                            <span className="text-[11px] font-medium text-slate-500">
                              ({item.label})
                            </span>
                          </div>
                          {item.scriptName && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              Script: {item.scriptName}
                            </span>
                          )}
                          {item.regionInfo && (
                            <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                              {item.regionInfo}
                            </p>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <div className="flex items-center gap-1 shrink-0 mt-1">
                          <span className="text-[9px] font-bold text-amber-900 bg-amber-200/80 px-1.5 py-0.5 rounded">
                            Active
                          </span>
                          <Check className="w-4 h-4 text-emerald-700" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-2.5 sm:p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5 min-w-0">
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span className="truncate">Instant translation across all portal tabs</span>
            </div>
            <span className="font-mono text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200 shrink-0">
              Unicode ST
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
