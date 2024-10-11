import {useEffect, useState} from "react";

const MusicPlayer = (props: { token: string | null}) => {
    const [player, setPlayer] = useState(undefined);
    const [deviceId, setDeviceId] = useState("");
    const [currentTrack, setCurrentTrack] = useState(undefined);

    useEffect(() => {
        if (props.token) {
            initializeMusicPlayer(props.token);
        }
    }, []);

    const initializeMusicPlayer = (token: string) => {
        const script = document.createElement("script");
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;

        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = () => {
            const player = new window.Spotify.Player({
                name: "TurnTable",
                getOAuthToken: (cb: (token: string) => void) => {
                    cb(token);
                },
                volume: 0.5
            });

            // @ts-ignore
            player.addListener("ready", ({deviceId}) => {
                setDeviceId(deviceId);
            });

            player.connect();
            setPlayer(player);
        }
    }

    const playTrack = async () => {
        if (!deviceId)
        {
            return
        }

    }

    return (
        <div></div>
    );
}

export default MusicPlayer;
