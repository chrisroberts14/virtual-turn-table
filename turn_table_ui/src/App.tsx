import MusicPlayer from "@/components/MusicPlayer.tsx";
import NavigationBar from "@/components/NavigationBar.tsx";
import ScanPage from "@/components/ScanPage.tsx";
import type Album from "@/interfaces/Album.tsx";
import { getStateData, storeStateData } from "@/interfaces/StateData.tsx";
import { useEffect, useState } from "react";

function App() {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
	const [spotifyToken, setSpotifyToken] = useState("");

	// Two pages are defined in the state: "play" and "scan"
	const [currentPage, setCurrentPage] = useState("");
	const [nextPage, setNextPage] = useState("");

	const [fadeScan, setFadeScan] = useState(false);
	const [fadePlayer, setFadePlayer] = useState(false);
	const [disableTabChange, setDisableTabChange] = useState(false);

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
			setSpotifyToken(token);
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
						storeStateData({
							spotify_access_token: "",
							spotify_login_time: "",
							spotify_session_length: "",
						});
						setIsSignedIn(false);
						setSpotifyToken("");
					} else {
						setIsSignedIn(true);
						setSpotifyToken(currentState.spotify_access_token);
					}
				}
			} else {
				setIsSignedIn(false);
				setSpotifyToken("");
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
			setTimeout(() => setCurrentPage("play"), 500);
		} else {
			setFadePlayer(false);
			setFadeScan(true);
			setTimeout(() => setCurrentPage("scan"), 500);
		}
		setDisableTabChange(false);
	};

	return (
		<div className="flex flex-col h-screen">
			<NavigationBar
				isSignedIn={isSignedIn}
				currentPage={nextPage}
				setNextPage={setNextPage}
				disableTabChange={disableTabChange}
			/>
			<div className="flex flex-row h-full">
				<div
					style={{
						transform: fadePlayer ? "translateX(0)" : "translateX(-100%)",
						transition: "transform 0.5s ease-in-out",
					}}
					className="h-full"
				>
					<MusicPlayer token={spotifyToken} album={currentAlbum} />
				</div>
				<div
					style={{
						transform: fadeScan ? "translateX(-100%)" : "translateX(100%)",
						transition: "transform 0.5s ease-in-out",
					}}
					className="h-full"
				>
					<ScanPage
						currentAlbum={currentAlbum}
						setCurrentAlbum={setCurrentAlbum}
					/>
				</div>
			</div>
		</div>
	);
}

export default App;
