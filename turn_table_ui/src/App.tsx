import ErrorDisplay from "@/components/ErrorDisplay.tsx";
import MusicPlayer from "@/components/MusicPlayer.tsx";
import NavigationBar from "@/components/NavigationBar.tsx";
import ScanPage from "@/components/ScanPage.tsx";
import { ErrorProvider } from "@/contexts/ErrorContext.tsx";
import { MusicContext } from "@/contexts/MusicContext.tsx";
import { NavigationContext } from "@/contexts/NavigationContext.tsx";
import { SpotifyTokenContext } from "@/contexts/SpotifyTokenContext.tsx";
import { UsernameContext } from "@/contexts/UsernameContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import {
	clearStateData,
	getStateData,
	storeStateData,
} from "@/interfaces/StateData.tsx";
import { useEffect, useState } from "react";

function App() {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
	const [token, setToken] = useState<string | null>(null);

	// Two pages are defined in the state: "play" and "scan"
	const [nextPage, setNextPage] = useState("");

	const [fadeScan, setFadeScan] = useState(false);
	const [fadePlayer, setFadePlayer] = useState(false);
	const [disableTabChange, setDisableTabChange] = useState(false);

	const [username, setUsername] = useState<string | null>(null);

	useEffect(() => {
		// Set to the correct page
		const currentState = getStateData();
		if (currentState?.currentPage) {
			setNextPage(currentState.currentPage);
		}

		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);
		const token = params.get("access_token");

		if (token) {
			storeStateData({
				spotify_access_token: token,
				spotify_login_time: String(new Date()),
				spotify_session_length: params.get("expires_in") as string,
			});
			setIsSignedIn(true);
			setToken(token);
			window.location.href = "/";
		} else {
			const currentState = getStateData();
			if (currentState?.spotify_access_token) {
				if (
					currentState.spotify_session_length &&
					currentState.spotify_login_time
				) {
					const currentSessionLength =
						(new Date().getTime() -
							new Date(currentState.spotify_login_time).getTime()) /
						1000;

					if (
						currentSessionLength > Number(currentState.spotify_session_length)
					) {
						clearStateData();
						setIsSignedIn(false);
						setToken(null);
					} else {
						setIsSignedIn(true);
						setToken(currentState.spotify_access_token);
					}
				}
			} else {
				setIsSignedIn(false);
				setToken(null);
			}
		}
	}, []);

	useEffect(() => {
		triggerScreenChange(nextPage);
		storeStateData({ currentPage: nextPage });
	}, [nextPage]);

	useEffect(() => {
		if (currentAlbum) {
			setNextPage("play");
		}
	}, [currentAlbum]);

	const triggerScreenChange = (page: string) => {
		setDisableTabChange(true);
		if (page === "play") {
			setFadeScan(false);
			setFadePlayer(true);
		} else {
			setFadePlayer(false);
			setFadeScan(true);
		}
		setDisableTabChange(false);
	};

	return (
		<ErrorProvider>
			<UsernameContext.Provider value={{ username, setUsername }}>
				<SpotifyTokenContext.Provider value={{ token, setToken }}>
					<div className="flex flex-col h-screen">
						<NavigationContext.Provider
							value={{
								isSignedIn,
								setIsSignedIn,
								nextPage,
								setNextPage,
								disableTabChange,
								setDisableTabChange,
							}}
						>
							<NavigationBar />
						</NavigationContext.Provider>
						<MusicContext.Provider value={{ currentAlbum, setCurrentAlbum }}>
							<div className="flex flex-row h-full">
								<div
									style={{
										transform: fadePlayer
											? "translateX(0)"
											: "translateX(-100%)",
										transition: "transform 0.5s ease-in-out",
									}}
									className="h-full"
								>
									<MusicPlayer />
								</div>
								<div
									style={{
										transform: fadeScan
											? "translateX(-100%)"
											: "translateX(100%)",
										transition: "transform 0.5s ease-in-out",
									}}
									className="h-full"
								>
									<ScanPage />
								</div>
							</div>
						</MusicContext.Provider>
					</div>
					<ErrorDisplay />
				</SpotifyTokenContext.Provider>
			</UsernameContext.Provider>
		</ErrorProvider>
	);
}

export default App;
