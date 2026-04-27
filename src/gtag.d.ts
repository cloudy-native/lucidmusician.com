declare global {
  interface Window {
    gtag?: (
      command: "event" | "config" | "js",
      targetId: string | Date,
      config?: {
        page_title?: string;
        page_location?: string;
        page_path?: string;
        send_page_view?: boolean;
        [key: string]: any;
      }
    ) => void;
    dataLayer?: any[];
  }
}

export {};
