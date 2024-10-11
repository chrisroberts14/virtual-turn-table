import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import axios from "axios";

const MusicPlayer = (props: {token: string | null, albumURI: string | null}) => {
    const [player, setPlayer] = useState<any>(null);
    const [deviceID, setDeviceID] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [songURIs, setSongURIs] = useState<string[]>([]);

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
                    setIsConnected(true);
                } else {
                    // TODO: ADD ERROR MESSAGE ON FRONTEND
                    setIsConnected(false);
                }
            })

            player.on('ready', (event: {device_id: string}) => {
                setDeviceID(event.device_id);
            });

            setPlayer(player);
        }
    }, []);

    useEffect(() => {
        axios.get(import.meta.env.VITE_BFF_ADDRESS + "get_songs_in_album/", {
            params: {
                spotify_access_token: props.token,
                album_uri: props.albumURI
            }
        })
            .then(function (response) {
                console.log(response);
                setSongURIs(response.data);
                console.log(songURIs);
                console.log(player);
            })
            .catch(function (error) {
                console.log(error);

        })
    }, [props.albumURI]);


    const playSong = async () => {
        axios.post(import.meta.env.VITE_BFF_ADDRESS + "play_track/", null, {
            params: {
                spotify_access_token: props.token,
                track_uri: "spotify:track:5gmv3BgePSYiHnPJgY7oTJ",
                device_id: deviceID
            }
        })
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    return (
        <>{isConnected ? <Button onClick={playSong}>Play</Button> : <div>Not connected to spotify</div>}</>
    );
}

export default MusicPlayer;
