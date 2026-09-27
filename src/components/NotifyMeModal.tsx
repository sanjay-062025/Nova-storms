import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellRing,
  CheckCircle2,
  Calendar,
  Sparkles,
  Smartphone,
  ShieldCheck,
  X,
  AlertCircle,
  Clock,
  IndianRupee,
  Volume2
} from 'lucide-react';
import { ScholarshipScheme } from '../types';
import {
  getNotificationPermission,
  requestNotificationPermission,
  saveSchemeSubscription,
  removeSchemeSubscription,
  isSchemeSubscribed,
  dispatchPushNotification
} from '../utils/notificationService';
import { api } from '../services/api';

interface NotifyMeModalProps {
  isOpen: boolean;
  scheme: ScholarshipScheme | null;
  onClose: () => void;
  onSubscriptionChange?: (schemeId: string, isSubscribed: boolean) => void;
}

export const NotifyMeModal: React.FC<NotifyMeModalProps> = ({
  isOpen,
  scheme,
  onClose,
  onSubscriptionChange
}) => {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [channels, setChannels] = useState({
    push: true,
    inApp: true,
    sms: true
  });
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && scheme) {
      setPermission(getNotificationPermission());
      setIsSubscribed(isSchemeSubscribed(scheme.id));
      setFeedbackMsg(null);
    }
  }, [isOpen, scheme]);

  if (!isOpen || !scheme) return null;

  const handleSubscribe = async () => {
    setIsSubscribing(true);
    setFeedbackMsg(null);

    try {
      // 1. Request browser push permission if needed
      let currentPerm = permission;
      if (currentPerm === 'default') {
        currentPerm = await requestNotificationPermission();
        setPermission(currentPerm);
      }

      // 2. Save locally
      saveSchemeSubscription(scheme.id);
      setIsSubscribed(true);

      // 3. Sync with backend
      await api.subscribeScholarship({
        schemeId: scheme.id,
        schemeName: scheme.schemeName,
        openingDate: scheme.openingDate || scheme.applicationPeriod,
        channels
      });

      // 4. Trigger welcome confirmation push alert
      await dispatchPushNotification({
        title: `🔔 Subscribed: ${scheme.shortName || scheme.schemeName}`,
        body: `You will receive an instant Web Push notification the moment application submission opens on ${scheme.openingDate || scheme.applicationPeriod}.`,
        schemeId: scheme.id,
        schemeName: scheme.schemeName,
        openingDate: scheme.openingDate
      });

      setFeedbackMsg('Subscription active! You will be alerted when applications open.');
      if (onSubscriptionChange) {
        onSubscriptionChange(scheme.id, true);
      }
    } catch (err) {
      console.error('Failed subscribing to notifications', err);
      setFeedbackMsg('Subscription recorded locally. You will receive in-app alerts.');
    } finally {
      setIsSubscribing(false);
    }
  };

  const handleUnsubscribe = async () => {
    try {
      removeSchemeSubscription(scheme.id);
      setIsSubscribed(false);
      await api.unsubscribeScholarship(scheme.id);
      setFeedbackMsg('You have unsubscribed from opening notifications for this scheme.');
      if (onSubscriptionChange) {
        onSubscriptionChange(scheme.id, false);
      }
    } catch (err) {
      console.error('Failed unsubscribing', err);
    }
  };

  const handleSimulateOpen = async () => {
    setIsSimulating(true);
    try {
      // Dispatch immediate simulated application opening notification
      await dispatchPushNotification({
        title: `🚀 Portal Now Open: ${scheme.shortName || scheme.schemeName}!`,
        body: `Applications are officially open for 2026-27 ST scholars! Submit your details and documents before quota slots fill.`,
        schemeId: scheme.id,
        schemeName: scheme.schemeName,
        openingDate: scheme.openingDate
      });

      // Also push to backend notification drawer
      await api.simulateSchemeOpen({
        schemeId: scheme.id,
        schemeName: scheme.schemeName
      });

      setFeedbackMsg('Test Push Alert sent! Check your screen top-right or system notification tray.');
    } catch (err) {
      console.error('Simulation error', err);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div
      id="modal-notify-me"
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in"
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden border border-slate-200 flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-300">
              <BellRing className="w-5 h-5 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider">
                  Push Notification Alert
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/30 font-semibold">
                  Upcoming Scheme
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white leading-tight">
                {scheme.shortName || scheme.schemeName}
              </h3>
            </div>
          </div>

          <button
            id="btn-close-notify-modal"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Opening Schedule Card */}
          <div className="bg-gradient-to-br from-indigo-50/80 to-blue-50/50 rounded-2xl p-4 border border-indigo-100 flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-900">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Opening Date Schedule:</span>
              </div>
              <p className="text-sm font-extrabold text-slate-900">
                {scheme.openingDate || scheme.applicationPeriod}
              </p>
              <p className="text-xs text-slate-600">
                Annual benefit: <strong className="text-emerald-700">{scheme.formattedBenefit}</strong>
              </p>
            </div>

            {scheme.daysUntilOpen && (
              <div className="text-center bg-white px-3 py-2 rounded-xl border border-indigo-200 shadow-2xs">
                <span className="text-xl font-black text-indigo-700 block">{scheme.daysUntilOpen}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Days Left
                </span>
              </div>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed">
            Applications for this scheme are scheduled to open soon. Subscribe to receive an automated
            instant push notification directly to your device the moment the Ministry of Tribal Affairs
            portal opens.
          </p>

          {/* Notification Channels Selection */}
          <div className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 space-y-2.5">
            <span className="text-xs font-bold text-slate-800 block">
              Choose Notification Channels:
            </span>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={channels.push}
                onChange={(e) => setChannels({ ...channels, push: e.target.checked })}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <strong className="text-slate-900 block font-semibold">Web Push Notification</strong>
                <span className="text-slate-500 text-[11px]">
                  Delivered on desktop & mobile browser even when the tab is backgrounded.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={channels.inApp}
                onChange={(e) => setChannels({ ...channels, inApp: e.target.checked })}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <strong className="text-slate-900 block font-semibold">In-App Notification Center</strong>
                <span className="text-slate-500 text-[11px]">
                  Priority alert posted to your portal notification bell drawer.
                </span>
              </div>
            </label>

            <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={channels.sms}
                onChange={(e) => setChannels({ ...channels, sms: e.target.checked })}
                className="mt-0.5 rounded text-indigo-600 focus:ring-indigo-500"
              />
              <div>
                <strong className="text-slate-900 block font-semibold">
                  SMS & DigiLocker Notification
                </strong>
                <span className="text-slate-500 text-[11px]">
                  SMS alert sent to student registered phone (+91 98XXX-XX412).
                </span>
              </div>
            </label>
          </div>

          {/* Browser Notification Status Indicator */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl text-xs bg-slate-100 text-slate-700">
            {permission === 'granted' ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong className="text-emerald-800">Browser push permissions active:</strong> Ready to
                  deliver instant alerts to this device.
                </span>
              </>
            ) : permission === 'denied' ? (
              <>
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Browser notifications are blocked in device settings. In-app & SMS alerts will still be
                  sent.
                </span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>
                  You will be prompted to allow browser notifications when subscribing.
                </span>
              </>
            )}
          </div>

          {/* Feedback message */}
          {feedbackMsg && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{feedbackMsg}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2">
          {/* Test simulation button */}
          <button
            id="btn-simulate-push"
            type="button"
            disabled={isSimulating}
            onClick={handleSimulateOpen}
            className="text-xs font-bold px-3 py-2 rounded-xl bg-indigo-50 text-indigo-800 hover:bg-indigo-100 border border-indigo-200 transition-colors inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            title="Preview how you'll receive the push notification when this scholarship opens"
          >
            <Volume2 className="w-3.5 h-3.5 text-indigo-600" />
            <span>{isSimulating ? 'Triggering...' : '⚡ Test Push Alert Now'}</span>
          </button>

          <div className="flex items-center gap-2">
            {isSubscribed ? (
              <button
                id="btn-unsubscribe"
                type="button"
                onClick={handleUnsubscribe}
                className="text-xs font-bold px-3.5 py-2 rounded-xl border border-red-200 text-red-700 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
              >
                Unsubscribe
              </button>
            ) : null}

            <button
              id="btn-confirm-subscribe"
              type="button"
              disabled={isSubscribing}
              onClick={handleSubscribe}
              className={`text-xs font-bold px-4 py-2 rounded-xl transition-all inline-flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                isSubscribed
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white'
                  : 'bg-indigo-700 hover:bg-indigo-800 text-white'
              }`}
            >
              <Bell className="w-3.5 h-3.5" />
              <span>
                {isSubscribing
                  ? 'Subscribing...'
                  : isSubscribed
                  ? '✓ Subscribed (Update Prefs)'
                  : 'Subscribe for Opening Alert'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
