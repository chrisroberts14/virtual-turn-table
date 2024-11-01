import createUser from "@/api_calls/CreateUser.tsx";
import GetUserInfo from "@/api_calls/GetUserInfo.tsx";
import type Album from "@/interfaces/Album.tsx";
import { getStateData, storeStateData } from "@/interfaces/StateData.tsx";
import { useEffect, useState } from "react";

const useApp = () => {
	const [isSignedIn, setIsSignedIn] = useState(false);
	const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
	const [token, setToken] = useState<string | null>(null);
	// Two pages are defined in the state: "play" and "scan"
	const [nextPage, setNextPage] = useState("");
	const [fadeScan, setFadeScan] = useState(false);
	const [fadePlayer, setFadePlayer] = useState(false);
	const [disableTabChange, setDisableTabChange] = useState(false);

	useEffect(() => {
		// Set to the correct page
		const currentState = getStateData();
		if (currentState?.currentPage && currentState?.currentAlbum) {
			setNextPage(currentState.currentPage);
		} else {
			setNextPage("scan");
		}

		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);
		const token = params.get("access_token");

		if (token) {
			// Is signing in
			storeStateData({
				spotify_access_token: token,
			});
			setIsSignedIn(true);
			setToken(token);
			console.log("Token: ", token);

			GetUserInfo(token)
				.then((data) => {
					createUser(data.username, data.email).catch((error) => {
						console.error(error);
					});
				})
				.catch((error) => {
					console.error(error);
				});
			// Set the location back to the root (removes all the query parameters)
			window.location.href = "/";
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
		disableTabChange,
		setDisableTabChange,
	};
};

export default useApp;
