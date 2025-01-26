import amplitudeService from "./Amplitude";

class AnalyticsManager {
  initialize(): void {
    amplitudeService.init();
  }
  logEvent(eventName: string, properties?: Record<string, any>): void {
    amplitudeService.logEvent(eventName, properties);
  }
}

const analyticManager = new AnalyticsManager();

export default analyticManager;