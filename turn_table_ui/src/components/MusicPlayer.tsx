import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import axios from "axios";
import Album from "@/components/Album.tsx";
import {Card, CardBody} from "@nextui-org/card";
import SongDetails from "@/components/SongDetails.tsx";

const MusicPlayer = (props: {token: string | null, albumURI: string | null}) => {
    const [player, setPlayer] = useState<any>(null);
    const [deviceID, setDeviceID] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [currentSongIndex, setCurrentSongIndex] = useState(-1);
    const [currentAlbumTitle, setCurrentAlbumTitle] = useState("");
    const [currentAlbumArtist, setCurrentAlbumArtist] = useState("");
    const [currentAlbumImage, setCurrentAlbumImage] = useState("");
    const [songs, setSongs] = useState<string[]>([]);
    const [currentSong, setCurrentSong] = useState("");
    const [currentSongArtist, setCurrentSongArtist] = useState("");

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
                },
                volume: 0.5
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
        axios.get(import.meta.env.VITE_BFF_ADDRESS + "album_details/", {
            params: {
                spotify_access_token: localStorage.getItem('spotify_access_token'),
                album_uri: props.albumURI
            }
        }).then(function (response) {
            setCurrentAlbumTitle(response.data["title"]);
            setCurrentAlbumArtist(response.data["artists"]);
            setCurrentAlbumImage(response.data["image_url"]);
        }).catch(function (error) {
            console.log(error);
        });

        axios.get(import.meta.env.VITE_BFF_ADDRESS + "get_songs_in_album/", {
            params: {
                spotify_access_token: props.token,
                album_uri: props.albumURI
            }
        })
            .then(function (response) {
                setSongs(response.data);
            })
            .catch(function (error) {
                console.log(error);
        })
    }, [props.albumURI]);

    const nextSong = async () => {
        setCurrentSongIndex(currentSongIndex + 1);
        // @ts-ignore
        setCurrentSong(songs.at(currentSongIndex)["title"]);
        // @ts-ignore
        setCurrentSongArtist(songs.at(currentSongIndex)["artists"].join(", "));
        if (songs && player) {
            if (currentSongIndex < songs.length) {
                // @ts-ignore
                const trackURI = songs.at(currentSongIndex)["uri"];
                axios.post(import.meta.env.VITE_BFF_ADDRESS + "play_track/", null, {
                    params: {
                        spotify_access_token: props.token,
                        track_uri: trackURI,
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
        }
    }

    const pauseSong = async () => {
        player.pause()
    }

    const playSong = async () => {
        player.resume()
    }

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '50vh',
            }}
        >
            <Card className="max-w-[400px]">
                <CardBody className="flex gap-3">
                    <>{isConnected ? <>
                        <Album title={currentAlbumTitle} artist={currentAlbumArtist} img_url={currentAlbumImage}/>
                        <SongDetails song={currentSong} artist={currentSongArtist}/>
                        <Button onClick={playSong}>Play</Button>
                        <Button onClick={pauseSong}>Pause</Button>
                        <Button onClick={nextSong}>Skip</Button>
                    </> : <div>Not connected to spotify</div>}</>
                </CardBody>
            </Card>
        </div>
    );
}

export default MusicPlayer;
