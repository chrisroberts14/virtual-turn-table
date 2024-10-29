import ErrorDisplay from "@/components/ErrorDisplay.tsx";
import MusicPlayer from "@/components/MusicPlayer.tsx";
import NavigationBar from "@/components/NavigationBar.tsx";
import ScanPage from "@/components/ScanPage.tsx";
import { ErrorProvider } from "@/contexts/ErrorContext.tsx";
import { MusicContext } from "@/contexts/MusicContext.tsx";
import { NavigationContext } from "@/contexts/NavigationContext.tsx";
import { SpotifyTokenContext } from "@/contexts/SpotifyTokenContext.tsx";
import { UsernameContext } from "@/contexts/UsernameContext.tsx";
import useApp from "@/hooks/UseApp.tsx";
import { useState } from "react";

function App() {
	const [username, setUsername] = useState<string | null>(null);
	const {
		isSignedIn,
		setIsSignedIn,
		currentAlbum,
		setCurrentAlbum,
		token,
		setToken,
		nextPage,
		setNextPage,
		fadeScan,
		fadePlayer,
		disableTabChange,
		setDisableTabChange,
	} = useApp();

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
						{isSignedIn ? (
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
						) : null}
					</div>
					<ErrorDisplay />
				</SpotifyTokenContext.Provider>
			</UsernameContext.Provider>
		</ErrorProvider>
	);
}

export default App;
