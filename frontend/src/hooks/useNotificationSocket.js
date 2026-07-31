import { useEffect, useRef } from "react";

// ── constants ────────────────────────────────────────────────────────────────
const WS_BASE_URL = import.meta.env.VITE_WS_URL || "ws://127.0.0.1:8000";
const WS_PATH = "/ws/notifications/";

const RECONNECT_BASE_DELAY_MS = 2000;   // initial back-off delay
const RECONNECT_MAX_DELAY_MS  = 30000;  // cap at 30 s
const RECONNECT_MAX_ATTEMPTS  = 5;      // stop after 5 consecutive failures

/**
 * useNotificationSocket
 *
 * Opens a single authenticated WebSocket connection to the notifications
 * endpoint for the currently logged-in Student.  Calls `onNotification`
 * whenever a message of type "notification" arrives.
 *
 * Lifecycle:
 *   - Opens on mount (or when the hook is first called).
 *   - Reconnects on unexpected close, with exponential back-off, up to
 *     RECONNECT_MAX_ATTEMPTS times.
 *   - Closes cleanly on unmount — no memory leaks, no duplicate sockets.
 *
 * @param {function} onNotification  Called with { id, message, is_read, created_at }
 *                                   for every incoming notification frame.
 *                                   Pass `null` to skip (e.g. badge-only consumer).
 */
function useNotificationSocket(onNotification) {
  // Keep the socket + reconnect state in refs so they survive re-renders
  // without triggering them.
  const socketRef      = useRef(null);
  const attemptsRef    = useRef(0);
  const reconnectTimer = useRef(null);
  const isMounted      = useRef(true);
  // Stable ref to the latest callback — avoids stale closure inside handlers.
  const callbackRef    = useRef(onNotification);

  useEffect(() => {
    callbackRef.current = onNotification;
  }, [onNotification]);

  useEffect(() => {
    isMounted.current = true;

    function connect() {
      // Guard: do not open if component is gone or token is missing.
      const token = localStorage.getItem("access");
      if (!token || !isMounted.current) return;

      // Guard: do not open a second socket if one is already live.
      if (
        socketRef.current &&
        (socketRef.current.readyState === WebSocket.OPEN ||
          socketRef.current.readyState === WebSocket.CONNECTING)
      ) {
        return;
      }

      const url = `${WS_BASE_URL}${WS_PATH}?token=${token}`;
      const ws  = new WebSocket(url);
      socketRef.current = ws;

      ws.onopen = () => {
        // Reset back-off counter on a successful connection.
        attemptsRef.current = 0;
        console.log("[NotificationSocket] Connected.");
      };

      ws.onmessage = (event) => {
        let payload;
        try {
          payload = JSON.parse(event.data);
        } catch {
          console.warn("[NotificationSocket] Non-JSON frame ignored:", event.data);
          return;
        }

        // Log the initial connection handshake but do not forward it.
        if (payload.message === "Connected Successfully") {
          console.log("[NotificationSocket] Handshake:", payload);
          return;
        }

        // Forward genuine notification frames to the consumer.
        if (payload.type === "notification" && callbackRef.current) {
          // Shape the incoming frame into the same object structure the REST
          // API returns, so consumers don't need to handle two different shapes.
          const notification = {
            // The backend does not send an id over WS; use a timestamp-based
            // temporary id so React list keys remain unique until a page refresh
            // reloads from the REST API with real ids.
            id:         `ws-${Date.now()}`,
            message:    payload.message,
            is_read:    false,
            created_at: new Date().toISOString(),
          };
          callbackRef.current(notification);
        }
      };

      ws.onerror = (err) => {
        console.error("[NotificationSocket] Error:", err);
      };

      ws.onclose = (event) => {
        console.log(
          `[NotificationSocket] Closed (code ${event.code}, clean: ${event.wasClean}).`
        );

        // Do not reconnect on intentional close (code 1000) or if unmounted.
        if (!isMounted.current || event.wasClean) return;

        // Exponential back-off reconnect.
        if (attemptsRef.current < RECONNECT_MAX_ATTEMPTS) {
          const delay = Math.min(
            RECONNECT_BASE_DELAY_MS * 2 ** attemptsRef.current,
            RECONNECT_MAX_DELAY_MS
          );
          attemptsRef.current += 1;
          console.log(
            `[NotificationSocket] Reconnecting in ${delay}ms ` +
            `(attempt ${attemptsRef.current}/${RECONNECT_MAX_ATTEMPTS})…`
          );
          reconnectTimer.current = setTimeout(connect, delay);
        } else {
          console.warn(
            "[NotificationSocket] Max reconnection attempts reached. Giving up."
          );
        }
      };
    }

    connect();

    // ── Cleanup ─────────────────────────────────────────────────────────────
    return () => {
      isMounted.current = false;

      // Cancel any pending reconnect timer.
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
        reconnectTimer.current = null;
      }

      // Close socket cleanly (code 1000 = normal closure).
      if (socketRef.current) {
        socketRef.current.onclose = null; // suppress reconnect logic on intentional close
        socketRef.current.onerror = null;
        socketRef.current.onmessage = null;
        socketRef.current.close(1000, "Component unmounted");
        socketRef.current = null;
      }

      console.log("[NotificationSocket] Cleaned up.");
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once per mount — callbacks are stable via callbackRef
}

export default useNotificationSocket;
