import reactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import * as Sentry from "@sentry/react";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

Sentry.init({
  dsn: "https://730a73d57198d3eb028c22c5f4cffcbb@o4508217933758464.ingest.de.sentry.io/4508217937756240",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
  // Session Replay
  replaysSessionSampleRate: 1.0, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

reactDom.createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Provider>
			<main className="dark text-foreground bg-background">
				<App />
			</main>
		</Provider>
	</BrowserRouter>,
);
