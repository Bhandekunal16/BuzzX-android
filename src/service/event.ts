import EventSource from "react-native-event-source";
import { useEffect, useRef, useCallback } from "react";
import { Observable } from "rxjs";

const useEventService = (url: any) => {
  const eventSourceRef: any = useRef(null);

  const getServerSentEvent = useCallback(() => {
    return new Observable((observer) => {
      if (eventSourceRef.current) {
        console.warn("EventSource is already active!");
        return;
      }

      eventSourceRef.current = new EventSource(url);

      const handleEvent = (event: any) => {
        observer.next(event);
      };

      const handleError = (error: any) => {
        observer.error(error);
        close();
      };

      eventSourceRef.current.addEventListener("notification", handleEvent);
      eventSourceRef.current.addEventListener("delete", handleEvent);
      eventSourceRef.current.addEventListener("loading", handleEvent);
      eventSourceRef.current.onerror = handleError;

      return () => {
        close();
      };
    });
  }, [url]);

  const close = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null; // Prevent calling `close()` on null reference
    }
  };

  useEffect(() => {
    return () => close(); // Cleanup on unmount
  }, []);

  return { getServerSentEvent, close };
};

export default useEventService;
