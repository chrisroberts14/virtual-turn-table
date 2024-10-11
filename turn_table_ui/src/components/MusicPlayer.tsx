import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";

const MusicPlayer = (props: {token: string | null}) => {
    const [player, setPlayer] = useState<any>(null);
    const [deviceID, setDeviceID] = useState("");

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        // @ts-ignore
        window.onSpotifyWebPlaybackSDKReady = async () => {
            // @ts-ignore
            const player = new Spotify.Player({
                name: 'Vinyl Scanner',
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(props.token as string);
                }
            })
            player.connect().then((success: any) => {
                if (success) {
                    console.log('The Web Playback SDK successfully connected to Spotify!');

                }
            })
            // @ts-ignore
            player.on('ready', ({device_id}) => {
                console.log('Ready with Device ID', device_id);
                setDeviceID(device_id);
            });
            setPlayer(player);
        }
    }, []);

    const printCurrentData = () => {
        player.getCurrentState().then((state: { track_window: { current_track: any; next_tracks: any[]; }; }) => {
            if (!state) {
                console.error('User is not playing music through the Web Playback SDK');
                return;
            }

            var current_track = state.track_window.current_track;
            var next_track = state.track_window.next_tracks[0];

            console.log('Currently Playing', current_track);
            console.log('Playing Next', next_track);
        });
    }

    const playSong = async () => {
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${props.token}`
                },
                body: JSON.stringify({
                    uris: ['spotify:track:3F2N8N0qHrQ32cQaX8DWRS'] // Replace with the desired track
                }),
            });
            if (response.status === 204) {
                console.log('Playback started');
            } else {
                console.error('Failed to start playback.', await response.text());
            }
        } catch (error) {
            console.error('Error starting playback:', error);
        }
    }

    return (
        <><Button onClick={printCurrentData}>Print Current Data</Button><Button onClick={playSong}>Play</Button></>
    );
}

export default MusicPlayer;
