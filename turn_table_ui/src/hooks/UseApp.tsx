import getToken from "@/api_calls/Auth.ts";
import CreateUser from "@/api_calls/CreateUser";
import GetUserInfo from "@/api_calls/GetUserInfo";
import type Album from "@/interfaces/Album";
import { getStateData, storeStateData } from "@/interfaces/StateData";
import { useEffect, useState } from "react";

// Hook used in the main app.tsx file
// Is defined in its own file for easier testing

enum tabs {
	play = 0,
	scan = 1,
	social = 2,
}

const useApp = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
	const [BFFToken, setBFFToken] = useState<string | null>(null);
	const [spotifyToken, setSpotifyToken] = useState<string | null>(null);
	// Three pages are defined in the state: "play", "scan" and "social"
	const [currentPage, setCurrentPage] = useState(tabs.scan);

	useEffect(() => {
		// Set to the correct page based on the page the user was on last time
		// they were on the page
		const currentState = getStateData();
		if (currentState?.currentPage && currentState?.currentAlbum) {
			setCurrentPage(currentState.currentPage);
		} else {
			setCurrentPage(tabs.scan);
		}

		// Try to access URL parameters
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);
		const spotify_token = params.get("access_token");

		// If there is a token in the URL parameters, the user is signing in
		if (spotify_token) {
			// Is signing in
			// Get the auth token for the BFF
			getToken(spotify_token).then((bffToken) => {
				storeStateData({
					bff_token: bffToken,
					spotify_token: spotify_token,
				});
				setIsSignedIn(true);
				setBFFToken(bffToken);
				setSpotifyToken(spotify_token);
				// Create a user if they are logging in
				// This does nothing if the user already exists
				GetUserInfo(bffToken).then((user) => {
					CreateUser(user.display_name, user.image_url).catch((error) => {
						console.error(error);
					});
				});
			});
		} else if (currentState?.bff_token && currentState?.spotify_token) {
			// Is already signed in
			setIsSignedIn(true);
			setBFFToken(currentState.bff_token);
			setSpotifyToken(currentState.spotify_token);
		} else {
			// Is not signed in
			setIsSignedIn(false);
			setBFFToken(null);
			setSpotifyToken(null);
		}
	}, []);

	useEffect(() => {
		// Trigger the animation when the page changes
		storeStateData({ currentPage: currentPage });
	}, [currentPage]);

	useEffect(() => {
		// When the album changes always set to play screen
		if (currentAlbum) {
			setCurrentPage(tabs.play);
		}
	}, [currentAlbum]);

	return {
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
	};
};

export default useApp;
