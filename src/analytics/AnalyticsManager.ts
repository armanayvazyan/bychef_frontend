import amplitudeService from "./Amplitude";
import type { Callback } from "amplitude-js";

class AnalyticsManager {
  initialize(): void {
    amplitudeService.init();
  }
  logEvent(eventName: string, properties?: Record<string, any>, cb?: Callback): void {
    amplitudeService.logEvent(eventName, properties, cb);
  }
}

const analyticManager = new AnalyticsManager();

export default analyticManager;