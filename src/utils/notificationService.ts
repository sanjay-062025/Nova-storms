/**
 * Ministry of Tribal Affairs (MoTA) Scholarship Push Notification Service
 * Handles browser Web Push API permissions, dispatching alerts,
 * and managing local and backend subscriptions for upcoming schemes.
 */

export interface PushNotificationPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  tag?: string;
  schemeId?: string;
  schemeName?: string;
  openingDate?: string;
  actionUrl?: string;
}

export interface SubscriptionPreferences {
  push: boolean;
  inApp: boolean;
  sms: boolean;
}

const STORAGE_KEY = 'mota_scholarship_subscriptions';

/**
 * Checks if Notification API is available in the current environment
 */
export function isNotificationSupported(): boolean {
  return typeof window !== 'undefined' && 'Notification' in window;
}

/**
 * Get current browser notification permission
 */
export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }
  try {
    return Notification.permission;
  } catch (e) {
    return 'default';
  }
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission | 'unsupported'> {
  if (!isNotificationSupported()) {
    return 'unsupported';
  }

  try {
    const result = await Notification.requestPermission();
    return result;
  } catch (error) {
    console.warn('Notification permission request error (e.g. iframe context):', error);
    // Fallback to current permission if request failed
    return Notification.permission || 'default';
  }
}

/**
 * Read list of subscribed scheme IDs from localStorage
 */
export function getSubscribedSchemeIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (err) {
    console.warn('Failed reading subscriptions from localStorage', err);
  }
  return [];
}

/**
 * Check if a particular scheme is subscribed
 */
export function isSchemeSubscribed(schemeId: string): boolean {
  const ids = getSubscribedSchemeIds();
  return ids.includes(schemeId);
}

/**
 * Save subscription for a scheme
 */
export function saveSchemeSubscription(schemeId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getSubscribedSchemeIds();
    if (!current.includes(schemeId)) {
      const updated = [...current, schemeId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new CustomEvent('mota-subscription-changed', { detail: { schemeId, subscribed: true } }));
    }
  } catch (err) {
    console.warn('Failed saving subscription', err);
  }
}

/**
 * Remove subscription for a scheme
 */
export function removeSchemeSubscription(schemeId: string): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getSubscribedSchemeIds();
    const updated = current.filter((id) => id !== schemeId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('mota-subscription-changed', { detail: { schemeId, subscribed: false } }));
  } catch (err) {
    console.warn('Failed removing subscription', err);
  }
}

/**
 * Dispatches a push notification both through Web Push API (if granted)
 * and dispatches an in-app interactive alert event for instant feedback.
 */
export async function dispatchPushNotification(payload: PushNotificationPayload): Promise<{
  deliveredNative: boolean;
  deliveredInApp: boolean;
}> {
  let deliveredNative = false;

  // 1. Attempt Native Web Push Notification if granted
  if (isNotificationSupported() && Notification.permission === 'granted') {
    try {
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        const registration = await navigator.serviceWorker.ready;
        await registration.showNotification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/favicon.ico',
          badge: payload.badge || '/favicon.ico',
          tag: payload.tag || `mota-${payload.schemeId || 'alert'}`,
          data: {
            url: payload.actionUrl || '/'
          }
        });
        deliveredNative = true;
      } else {
        new Notification(payload.title, {
          body: payload.body,
          icon: payload.icon || '/favicon.ico',
          tag: payload.tag || `mota-${payload.schemeId || 'alert'}`
        });
        deliveredNative = true;
      }
    } catch (err) {
      console.warn('Native push notification invocation failed (may be blocked by browser/iframe):', err);
    }
  }

  // 2. Dispatch in-app push alert event (guaranteed to render regardless of iframe restrictions)
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('mota-push-notification', {
        detail: {
          ...payload,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      })
    );
  }

  return {
    deliveredNative,
    deliveredInApp: true
  };
}
