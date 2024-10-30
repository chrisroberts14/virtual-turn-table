import type Album from "@/interfaces/Album.tsx";
import {
	clearStateData,
	getStateData,
	storeStateData,
} from "@/interfaces/StateData.tsx";
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
			storeStateData({
				spotify_access_token: token,
				spotify_login_time: String(new Date()),
				spotify_session_length: params.get("expires_in") as string,
			});
			setIsSignedIn(true);
			setToken(token);
			window.location.href = "/";
		} else {
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