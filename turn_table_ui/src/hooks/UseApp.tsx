import CreateUser from "@/api_calls/CreateUser.tsx";
import GetUserInfo from "@/api_calls/GetUserInfo.tsx";
import type Album from "@/interfaces/Album.tsx";
import { getStateData, storeStateData } from "@/interfaces/StateData.tsx";
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
	const [token, setToken] = useState<string | null>(null);
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
				CreateUser(user.display_name, user.image_url).catch((error) => {
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
		token,
		setToken,
		currentPage,
		setCurrentPage,
	};
};

export default useApp;
