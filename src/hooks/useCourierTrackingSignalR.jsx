import { useCallback, useEffect, useRef, useState } from "react";
import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

const resolveCourierTrackingHubUrl = () => {
  const explicitCourierHubUrl = import.meta.env.VITE_COURIER_TRACKING_HUB_URL;
  if (explicitCourierHubUrl) {
    return explicitCourierHubUrl;
  }

  const notificationHubUrl = import.meta.env.VITE_SIGNALR_HUB_URL;
  if (notificationHubUrl) {
    try {
      const parsedUrl = new URL(notificationHubUrl, window.location.origin);
      return `${parsedUrl.origin}/hubs/courier-tracking`;
    } catch {
      return "/hubs/courier-tracking";
    }
  }

  return "/hubs/courier-tracking";
};

const COURIER_TRACKING_HUB_URL = resolveCourierTrackingHubUrl();

const normalizeCouriersPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.Data)) return payload.Data;
  return [];
};

export default function useCourierTrackingSignalR({ enabled = true } = {}) {
  const connectionRef = useRef(null);
  const isMountedRef = useRef(true);

  const [couriers, setCouriers] = useState([]);
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const getToken = useCallback(() => {
    try {
      return localStorage.getItem("token");
    } catch {
      return null;
    }
  }, []);

  const subscribeToCourierUpdates = useCallback(async () => {
    if (!connectionRef.current) return;
    await connectionRef.current.invoke("SubscribeToCourierUpdates");
  }, []);

  const disconnect = useCallback(async () => {
    const connection = connectionRef.current;
    connectionRef.current = null;

    if (connection) {
      try {
        await connection.stop();
      } catch (stopError) {
        console.error("Failed to stop courier SignalR connection:", stopError);
      }
    }

    if (isMountedRef.current) {
      setIsConnected(false);
    }
  }, []);

  const connect = useCallback(async () => {
    if (!enabled) return;
    if (connectionRef.current) return;

    const token = getToken();
    if (!token) {
      setError("Missing auth token for courier tracking.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    const connection = new HubConnectionBuilder()
      .withUrl(COURIER_TRACKING_HUB_URL, {
        accessTokenFactory: () => token,
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(
        import.meta.env.VITE_SIGNALR_DEBUG === "true" ? LogLevel.Debug : LogLevel.Information
      )
      .build();

    connection.on("CourierLocationsUpdated", (incomingCouriers) => {
      if (!isMountedRef.current) return;
      const normalizedCouriers = normalizeCouriersPayload(incomingCouriers);
      setCouriers(normalizedCouriers);
      setError(null);
      setIsLoading(false);
    });

    connection.onreconnecting(() => {
      if (!isMountedRef.current) return;
      setIsConnected(false);
    });

    connection.onreconnected(async () => {
      if (!isMountedRef.current) return;
      setIsConnected(true);
      try {
        await subscribeToCourierUpdates();
      } catch (invokeError) {
        console.error("Failed to resubscribe to courier updates:", invokeError);
      }
    });

    connection.onclose(() => {
      if (!isMountedRef.current) return;
      setIsConnected(false);
    });

    try {
      await connection.start();
      connectionRef.current = connection;
      setIsConnected(true);
      await subscribeToCourierUpdates();
    } catch (connectError) {
      console.error("Failed to connect courier tracking hub:", connectError);
      setError(connectError?.message || "Failed to connect to courier tracking hub.");
      setIsLoading(false);
      connectionRef.current = null;
      try {
        await connection.stop();
      } catch {
        // no-op
      }
    }
  }, [enabled, getToken, subscribeToCourierUpdates]);

  const refresh = useCallback(async () => {
    if (!connectionRef.current) {
      await connect();
      return;
    }

    try {
      setIsLoading(true);
      await subscribeToCourierUpdates();
    } catch (invokeError) {
      console.error("Failed to request courier updates:", invokeError);
      setError(invokeError?.message || "Failed to request courier updates.");
      setIsLoading(false);
    }
  }, [connect, subscribeToCourierUpdates]);

  useEffect(() => {
    isMountedRef.current = true;
    if (enabled) {
      connect();
    } else {
      setIsLoading(false);
    }

    return () => {
      isMountedRef.current = false;
      disconnect();
    };
  }, [enabled, connect, disconnect]);

  return {
    couriers,
    isLoading,
    error,
    isConnected,
    refresh,
  };
}
