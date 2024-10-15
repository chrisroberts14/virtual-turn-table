import MusicPlayer from "@/components/MusicPlayer.tsx";
import NavigationBar from "@/components/NavigationBar.tsx";
import Upload from "@/components/Upload.tsx";
import { useEffect, useState } from "react";

function App() {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [albumUri, setAlbumUri] = useState("");
	const [spotifyToken, setSpotifyToken] = useState("");

	// Two pages are defined in the state: "play" and "scan"
	const [currentPage, setCurrentPage] = useState("play");

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

	return (
		<>
			<NavigationBar
				isSignedIn={isSignedIn}
				currentPage={currentPage}
				setCurrentPage={setCurrentPage}
			/>
			<Upload setAlbumURI={setAlbumUri} />
			{isSignedIn ? (
				<MusicPlayer token={spotifyToken} albumURI={albumUri} />
			) : (
				<div>Please sign into spotify to use</div>
			)}
		</>
	);
}

export default App;
