import ErrorDisplay from "@/components/ErrorDisplay.tsx";
import LoggedOutPage from "@/components/LoggedOutPage.tsx";
import MusicPlayer from "@/components/MusicPlayer.tsx";
import NavigationBar from "@/components/NavigationBar.tsx";
import ScanPage from "@/components/ScanPage.tsx";
import SocialPage from "@/components/SocialPage.tsx";
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
		currentPage,
		setCurrentPage,
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
								currentPage,
								setCurrentPage,
							}}
						>
							<NavigationBar />

							{isSignedIn ? (
								<MusicContext.Provider
									value={{ currentAlbum, setCurrentAlbum }}
								>
									<div className="flex flex-row h-full">
										<div
											className="flex transition-transform duration-500 ease-in-out h-full"
											style={{
												transform: `translateX(-${currentPage * 100}%)`,
											}}
										>
											<MusicPlayer />
										</div>
										<div
											className="flex transition-transform duration-500 ease-in-out h-full"
											style={{
												transform: `translateX(-${currentPage * 100}%)`,
											}}
										>
											<ScanPage />
										</div>
										<div
											className="flex transition-transform duration-500 ease-in-out h-full"
											style={{
												transform: `translateX(-${currentPage * 100}%)`,
											}}
										>
											<SocialPage />
										</div>
									</div>
								</MusicContext.Provider>
							) : (
								<LoggedOutPage />
							)}
						</NavigationContext.Provider>
					</div>
					<ErrorDisplay />
				</SpotifyTokenContext.Provider>
			</UsernameContext.Provider>
		</ErrorProvider>
	);
}

export default App;
