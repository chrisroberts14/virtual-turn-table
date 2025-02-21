import { BFFWebSocket } from "@/api_calls/BFFEndpoints.ts";
import ErrorDisplay from "@/components/ErrorDisplay";
import LoggedOutPage from "@/components/LoggedOutPage";
import MusicPlayer from "@/components/MusicPlayer";
import NavigationBar from "@/components/NavigationBar";
import ScanPage from "@/components/ScanPage";
import SocialPage from "@/components/SocialPage";
import SuccessDisplay from "@/components/SuccessDisplay.tsx";
import { BFFTokenContext } from "@/contexts/BFFTokenContext.ts";
import { ErrorProvider } from "@/contexts/ErrorContext";
import { MusicContext } from "@/contexts/MusicContext";
import { NavigationContext } from "@/contexts/NavigationContext";
import { SpotifyTokenContext } from "@/contexts/SpotifyTokenContext";
import { SuccessProvider } from "@/contexts/SuccessContext.tsx";
import { UsernameContext } from "@/contexts/UsernameContext";
import { WebSocketContext } from "@/contexts/WebSocketContext.ts";
import useApp from "@/hooks/UseApp";
import { useEffect, useState } from "react";

function App() {
	const [username, setUsername] = useState<string | null>(null);
	const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
	const {
		isSignedIn,
		setIsSignedIn,
		currentAlbum,
		setCurrentAlbum,
		BFFToken,
		setBFFToken,
		spotifyToken,
		setSpotifyToken,
		currentPage,
		setCurrentPage,
	} = useApp();

	useEffect(() => {
		if (username && !webSocket) {
			setWebSocket(new WebSocket(`${BFFWebSocket}/${username}`));
		}
		return () => {
			webSocket?.close();
		};
	}, [username, webSocket]);

	return (
		<ErrorProvider>
			<SuccessProvider>
				<WebSocketContext.Provider
					value={{ ws: webSocket, setWs: setWebSocket }}
				>
					<UsernameContext.Provider value={{ username, setUsername }}>
						<SpotifyTokenContext.Provider
							value={{ spotifyToken, setSpotifyToken }}
						>
							<BFFTokenContext.Provider value={{ BFFToken, setBFFToken }}>
								<div className="flex flex-col h-screen">
									<NavigationContext.Provider
										value={{
											isSignedIn,
											setIsSignedIn,
											currentPage,
											setCurrentPage,
										}}
									>
										<NavigationBar />

										{isSignedIn ? (
											<>
												<MusicContext.Provider
													value={{ currentAlbum, setCurrentAlbum }}
												>
													<div
														className="flex flex-row h-full transition-transform duration-500 ease-in-out"
														style={{
															transform: `translateX(-${Number(currentPage) * 100}%)`,
														}}
													>
														<div className="flex h-full w-screen">
															<MusicPlayer />
														</div>
														<div className="flex h-full w-screen">
															<ScanPage />
														</div>
														<div className="flex h-full w-screen">
															<SocialPage />
														</div>
													</div>
												</MusicContext.Provider>
											</>
										) : (
											<LoggedOutPage />
										)}
									</NavigationContext.Provider>
								</div>
								<ErrorDisplay />
								<SuccessDisplay />
							</BFFTokenContext.Provider>
						</SpotifyTokenContext.Provider>
					</UsernameContext.Provider>
				</WebSocketContext.Provider>
			</SuccessProvider>
		</ErrorProvider>
	);
}

export default App;
