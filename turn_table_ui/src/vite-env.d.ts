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

interface SpotifyPlayer {
    connect: () => Promise<boolean>;
    disconnect: () => void;
    setVolume: (volume: number) => Promise<void>;
    seek: (positionMs: number) => Promise<void>;
    pause: () => Promise<void>;
    resume: () => Promise<void>;
    addListener: (event: string, callback: (state: any) => void) => void;
    on: (event: string, callback: (eventData: any) => void) => void;
}
