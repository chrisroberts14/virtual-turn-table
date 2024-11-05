import CreateUser from "@/api_calls/CreateUser.tsx";
import GetUserInfo from "@/api_calls/GetUserInfo.tsx";
import type Album from "@/interfaces/Album.tsx";
import { getStateData, storeStateData } from "@/interfaces/StateData.tsx";
import { useEffect, useState } from "react";

// Hook used in the main app.tsx file
// Is defined in its own file for easier testing

const useApp = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
	const [token, setToken] = useState<string | null>(null);
	// Two pages are defined in the state: "play" and "scan"
	const [nextPage, setNextPage] = useState("");
	const [fadeScan, setFadeScan] = useState(false);
	const [fadePlayer, setFadePlayer] = useState(false);

	useEffect(() => {
		// Set to the correct page based on the page the user was on last time
		// they were on the page
		const currentState = getStateData();
		if (currentState?.currentPage && currentState?.currentAlbum) {
			setNextPage(currentState.currentPage);
		} else {
			setNextPage("scan");
		}

		// Try to access URL parameters
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);
		const token = params.get("access_token");

		// If there is a token in the URL parameters, the user is signing in
		if (token) {
			// Is signing in
			storeStateData({
				spotify_access_token: token,
			});
			setIsSignedIn(true);
			setToken(token);

			// Create a user if they are logging in
			// This does nothing if the user already exists
			GetUserInfo(token).then((user) => {
				CreateUser(user.display_name, user.email).catch((error) => {
					console.error(error);
				});
				// Set the location back to the root (removes all the query parameters)
				window.location.href = "/";
			});
		} else if (currentState?.spotify_access_token) {
			// Is already signed in
			setIsSignedIn(true);
			setToken(currentState.spotify_access_token);
		} else {
			// Is not signed in
			setIsSignedIn(false);
			setToken(null);
		}
	}, []);

	useEffect(() => {
		// Trigger the animation when the page changes
		triggerScreenChange(nextPage);
		storeStateData({ currentPage: nextPage });
	}, [nextPage]);

	useEffect(() => {
		// When the album changes always set to play screen
		if (currentAlbum) {
			setNextPage("play");
		}
	}, [currentAlbum]);

	const triggerScreenChange = (page: string) => {
		// Trigger the animation when the page changes
		// Will probably need changing when a social page is added
		if (page === "play") {
			setFadeScan(false);
			setFadePlayer(true);
		} else {
			setFadePlayer(false);
			setFadeScan(true);
		}
	};

	return {
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
	};
};

export default useApp;
