"use client"
/** @format */

import { useEffect } from "react";
import { getFirebaseApp } from "@/lib/firebase";
import {
  getMessaging,
  getToken,
  isSupported as isMessagingSupported,
  onMessage,
  type Messaging,
} from "firebase/messaging";

const VAPID_KEY = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;

async function setupMessaging(swReg: ServiceWorkerRegistration): Promise<string | null> {
  const supported = await isMessagingSupported().catch(() => false);
  if (!supported) return null;

  const app = getFirebaseApp();
  const messaging: Messaging = getMessaging(app);

  // Request token using VAPID key and SW registration
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: swReg,
  }).catch((err) => {
    console.warn("FCM getToken error:", err);
    return null;
  });

  if (token) {
    try {
      localStorage.setItem("fcm_token", token);
    } catch {}
    // TODO: Send token to your backend to associate with the user
    // await api.registerFcmToken(token)
  }

  // Foreground message listener (optional): log or display toast
  onMessage(messaging, (payload) => {
    // You can integrate your toast system here
    console.debug("FCM foreground message:", payload);
  });

  return token;
}

export default function FcmInitializer() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    if (!("Notification" in window)) return;

    // Avoid repeated prompts in a single session
    const askedKey = "fcm_permission_requested";
    const alreadyAsked = sessionStorage.getItem(askedKey);

    const registerSW = async () => {
      // Ensure the SW is registered before requesting token
      const swReg = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );

      const permission = Notification.permission;
      if (permission === "granted") {
        await setupMessaging(swReg);
        return;
      }

      if (permission === "default" && !alreadyAsked) {
        sessionStorage.setItem(askedKey, "1");
        const result = await Notification.requestPermission();
        if (result === "granted") {
          await setupMessaging(swReg);
        }
      }
      // If denied, do nothing; app can provide a manual enable button later
    };

    registerSW().catch((e) => console.warn("FCM init failed", e));
  }, []);

  return null;
}

