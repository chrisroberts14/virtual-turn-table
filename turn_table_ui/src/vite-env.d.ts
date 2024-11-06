/// <reference types="vite/client" />

interface Window {
	onSpotifyWebPlaybackSDKReady: () => void;
	Spotify: {
		Player: new (options: {
			name: string;
			getOAuthToken: (cb: (token: string) => void) => void;
			volume?: number;
		}) => SpotifyPlayer;
	};
}

interface SpotifyPlayerState {
	duration: number; // Total duration of the current track in milliseconds
	position: number; // Current playback position in milliseconds
	paused: boolean; // Whether the track is paused
	shuffle: boolean; // Whether shuffle mode is enabled
	repeat_mode: number; // Repeat mode (0: off, 1: context, 2: track)
	track_window: {
		current_track: {
			id: string; // The Spotify ID of the current track
			uri: string; // The URI of the current track
			name: string; // The name of the current track
			duration_ms: number; // Duration of the current track in milliseconds
			artists: Array<{
				name: string; // Name of the artist
				uri: string; // Spotify URI of the artist
			}>;
			album: {
				name: string; // Name of the album
				images: Array<{
					url: string; // URL of the album cover image
				}>;
			};
		};
		next_tracks: Array<{
			id: string; // The Spotify ID of the next track
			uri: string; // URI of the next track
			name: string; // Name of the next track
		}>;
		previous_tracks: Array<{
			id: string; // The Spotify ID of the previous track
			uri: string; // URI of the previous track
			name: string; // Name of the previous track
		}>;
	};
	context: {
		uri: string; // URI of the current playback context (playlist, album, etc.)
		metadata: {
			[key: string]: any; // Additional metadata about the context
		};
	};
}

interface SpotifyPlayer {
	connect: () => Promise<boolean>; // Connect to the Web Playback SDK
	disconnect: () => void; // Disconnect from the Web Playback SDK
	setVolume: (volume: number) => Promise<void>; // Set the volume (0-1)
	seek: (positionMs: number) => Promise<void>; // Seek to a position in the current track (in milliseconds)
	on: (event: string, callback: (eventData: any) => void) => void; // Add an event listener
	getCurrentState: () => Promise<SpotifyPlayerState>; // Get the current player state
	togglePlay: () => Promise<void>; // Toggle playback
	pause: () => void; // Pause playback
	resume: () => void; // Resume playback
}
