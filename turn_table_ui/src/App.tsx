import MusicPlayer from "@/components/MusicPlayer.tsx";
import NavigationBar from "@/components/NavigationBar.tsx";
import ScanPage from "@/components/ScanPage.tsx";
import type Album from "@/interfaces/Album.tsx";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, useTransition } from "react";

function App() {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
	const [spotifyToken, setSpotifyToken] = useState("");

	// Two pages are defined in the state: "play" and "scan"
	const [currentPage, setCurrentPage] = useState("play");

	const [fadeScan, setFadeScan] = useState(false);
	const [fadePlayer, setFadePlayer] = useState(false);
	const [disableTabChange, setDisableTabChange] = useState(false);

	useEffect(() => {
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);
		const token = params.get("access_token");

		if (token) {
			localStorage.setItem("spotify_access_token", token);
			localStorage.setItem("spotify_login_time", String(new Date()));
			localStorage.setItem(
				"spotify_session_length",
				params.get("expires_in") as string,
			);
			setIsSignedIn(true);
			setSpotifyToken(token);
			window.location.href = "/";
		} else {
			const storageToken = localStorage.getItem("spotify_access_token");
			if (storageToken) {
				const startTime = localStorage.getItem("spotify_login_time");
				const sessionLength = Number(
					localStorage.getItem("spotify_session_length"),
				);
				if (startTime) {
					const currentSessionLength =
						(new Date().getTime() - new Date(startTime).getTime()) / 1000;

					if (currentSessionLength > Number(sessionLength)) {
						localStorage.removeItem("spotify_access_token");
						localStorage.removeItem("spotify_login_time");
						localStorage.removeItem("spotify_session_length");
						setIsSignedIn(false);
						setSpotifyToken("");
					} else {
						setIsSignedIn(true);
						setSpotifyToken(storageToken);
					}
				}
			} else {
				setIsSignedIn(false);
				setSpotifyToken("");
			}
		}
	});

	useEffect(() => {
		triggerScreenChange("play");
	}, []);

	const triggerScreenChange = (page: string) => {
		if (page === "play") {
			setFadeScan(false);
			setFadePlayer(true);
			setTimeout(() => setCurrentPage("play"), 500);
		} else {
			setFadePlayer(false);
			setFadeScan(true);
			setTimeout(() => setCurrentPage("scan"), 500);
		}
	};

	return (
		<div className="flex flex-col h-screen">
			<NavigationBar
				isSignedIn={isSignedIn}
				currentPage={currentPage}
				triggerScreenChange={triggerScreenChange}
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
