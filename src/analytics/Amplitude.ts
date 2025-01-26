import * as amplitude from "@amplitude/analytics-browser";
import { ANALYTICS_AMPLITUDE_KEY } from "@/configs/constants";
import { BrowserClient } from "@amplitude/analytics-types";

class AmplitudeService {
  private amplitudeInstance: BrowserClient | null;

  constructor() {
    this.amplitudeInstance = null;
  }

  init(): void {
    if (typeof window !== "undefined" && !this.amplitudeInstance) {
      this.amplitudeInstance = amplitude;
      this.amplitudeInstance.init(ANALYTICS_AMPLITUDE_KEY as string);
      console.log("Amplitude initialized");
    }
  }

  logEvent(eventName: string, properties?: Record<string, any>): void {
    const eventOptions = {
      time: Date.now()
    };
    this.amplitudeInstance?.track(eventName, properties, eventOptions);
  }
}

const amplitudeService = new AmplitudeService();

export default amplitudeService;