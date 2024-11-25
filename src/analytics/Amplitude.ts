import amplitude, { AmplitudeClient, type Callback } from "amplitude-js";
import { ANALYTICS_AMPLITUDE_KEY } from "@/configs/constants";

class AmplitudeService {
  private amplitudeInstance: AmplitudeClient | null;

  constructor() {
    this.amplitudeInstance = null;
  }

  init(): void {
    if (typeof window !== "undefined" && !this.amplitudeInstance) {
      this.amplitudeInstance = amplitude.getInstance();
      this.amplitudeInstance.init(ANALYTICS_AMPLITUDE_KEY as string);
    }
  }

  logEvent(eventName: string, properties?: Record<string, any>, cb?: Callback): void {
    this.amplitudeInstance?.logEvent(eventName, properties, cb);
  }
}

const amplitudeService = new AmplitudeService();

export default amplitudeService;