import {useEffect, useState} from "react";

const MusicPlayer = (props: {token: string | null}) => {
    const [player, setPlayer] = useState(undefined);
    const [isReady, setIsReady] = useState(false);

    const test = () => {
        player.togglePlay()
        console.log(player.getCurrentState());
    }

    useEffect(() => {

        if (props.token) {

            // Load Spotify Web Playback SDK script
            const script = document.createElement('script');
            script.src = 'https://sdk.scdn.co/spotify-player.js';
            script.async = true;
            document.body.appendChild(script);

            // @ts-ignore
            window.onSpotifyWebPlaybackSDKReady = () => {
                // @ts-ignore
                const player = new window.Spotify.Player({
                    name: 'Web Playback SDK Player',
                    getOAuthToken: (cb: (arg0: any) => void) => { cb(props.token); },
                    volume: 0.5
                });

                setPlayer(player);

                // Ready
                // @ts-ignore
                player.addListener('ready', ({ device_id }) => {
                    console.log('Ready with Device ID', device_id);
                    setIsReady(true);
                });

                // Not Ready
                // @ts-ignore
                player.addListener('not_ready', ({ device_id }) => {
                    console.log('Device ID has gone offline', device_id);
                });

                // @ts-ignore
                player.addListener('initialization_error', ({ message }) => {
                    console.error(message);
                });

                // @ts-ignore
                player.addListener('authentication_error', ({ message }) => {
                    console.error(message);
                });

                // @ts-ignore
                player.addListener('account_error', ({ message }) => {
                    console.error(message);
                });

                // Connect to the player!
                player.connect();
            };
        }
    }, []);

    // @ts-ignore
    return (
        <div>
            <div>
                <h1>Spotify Web Player</h1>
                {!isReady ? <div></div> : <button onClick={() => test()}>Play/Pause</button>}
            </div>
        </div>
    );
}

export default MusicPlayer;
