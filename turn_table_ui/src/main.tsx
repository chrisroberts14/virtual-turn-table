import reactDom from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { Provider } from "./provider.tsx";
import "@/styles/globals.css";

reactDom.createRoot(document.getElementById("root")!).render(
	<BrowserRouter>
		<Provider>
			<main className="dark text-foreground bg-background">
				<App />
			</main>
		</Provider>
	</BrowserRouter>,
);
