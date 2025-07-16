declare module 'leancloud-storage' {
  namespace AV {
    export interface Analytics {
      track(eventName: string, dimensions?: Record<string, unknown>): Promise<void>;
    }
    export const Analytics: Analytics;
  }
}