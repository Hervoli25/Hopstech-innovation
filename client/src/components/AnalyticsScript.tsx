import { useEffect } from "react";

const analyticsEndpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();
const analyticsWebsiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID?.trim();

const AnalyticsScript = () => {
  useEffect(() => {
    if (!analyticsEndpoint || !analyticsWebsiteId) {
      return;
    }

    const normalizedEndpoint = analyticsEndpoint.replace(/\/+$/, "");
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-hopstech-analytics="umami"]',
    );

    if (existingScript) {
      return;
    }

    const script = document.createElement("script");
    script.defer = true;
    script.src = `${normalizedEndpoint}/umami`;
    script.dataset.websiteId = analyticsWebsiteId;
    script.setAttribute("data-hopstech-analytics", "umami");

    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return null;
};

export default AnalyticsScript;
