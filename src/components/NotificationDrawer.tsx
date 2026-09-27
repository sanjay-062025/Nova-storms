import React from 'react';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  AlertOctagon,
  CheckCheck
} from 'lucide-react';
import { NotificationItem } from '../types';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onSelectNotification: (actionRoute?: string) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onSelectNotification
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-label="Notification Center"
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/50 backdrop-blur-2xs animate-in fade-in"
    >
      <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-slate-800 text-amber-400">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">MoTA Notification Center</h3>
              <p className="text-xs text-slate-300">
                Proactive alerts & automated SLA status changes
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action bar */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs">
          <span className="text-slate-600 font-medium">
            {notifications.filter((n) => !n.read).length} Unread notifications
          </span>
          <button
            onClick={onMarkAllRead}
            className="text-emerald-800 hover:text-emerald-900 font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            <span>Mark all read</span>
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {notifications.map((notif) => {
            const isEscalation = notif.type === 'escalation';
            const isSuccess = notif.type === 'success';

            return (
              <div
                key={notif.id}
                onClick={() => {
                  if (notif.actionRoute) {
                    onSelectNotification(notif.actionRoute);
                    onClose();
                  }
                }}
                className={`p-4 transition-colors cursor-pointer flex items-start gap-3 ${
                  !notif.read ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50'
                }`}
              >
                {/* Icon */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isEscalation
                      ? 'bg-rose-100 text-rose-700'
                      : isSuccess
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {isEscalation ? (
                    <AlertOctagon className="w-4 h-4" />
                  ) : isSuccess ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <Info className="w-4 h-4" />
                  )}
                </div>

                <div className="flex-1 text-xs">
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <h5
                      className={`font-bold ${
                        isEscalation ? 'text-rose-900' : 'text-slate-900'
                      }`}
                    >
                      {notif.title}
                    </h5>
                    <span className="text-[10px] text-slate-400 shrink-0">{notif.timeAgo}</span>
                  </div>
                  <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                  {!notif.read && (
                    <span className="inline-block mt-1.5 text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                      New
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
          >
            Close Notifications
          </button>
        </div>
      </div>
    </div>
  );
};
