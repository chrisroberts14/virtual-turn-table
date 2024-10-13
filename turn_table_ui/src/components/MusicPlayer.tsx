import {useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import axios from "axios";
import AlbumDisplay from "@/components/AlbumDisplay.tsx";
import {Card, CardBody} from "@nextui-org/card";
import SongDetails from "@/components/SongDetails.tsx";
import TrackList from "@/components/TrackList.tsx";
import Song from "@/interfaces/Song.tsx";
import Album from "@/interfaces/Album.tsx";


declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: () => void;
        Spotify: typeof Spotify;
    }
}

declare namespace Spotify {
    interface PlayerOptions {
        name: string;
        getOAuthToken: (cb: (token: string) => void) => void;
        volume?: number;
    }

    interface PlaybackState {
        context: {
            uri: string;
        };
        position: number;
        duration: number;
        paused: boolean;
        track_window: {
            current_track: {
                name: string;
                uri: string;
                artists: Array<{ name: string; uri: string }>;
            };
        };
    }

    interface ReadyEvent {
        device_id: string;
    }

    class Player {
        constructor(options: PlayerOptions);

        // The 'connect' method returns a promise
        connect(): Promise<boolean>;

        // The 'on' method to listen to various events
        on(event: 'ready', callback: (event: ReadyEvent) => void): void;
        on(event: 'not_ready', callback: (event: ReadyEvent) => void): void;
        on(event: 'player_state_changed', callback: (state: PlaybackState) => void): void;
        on(event: string, callback: (...args: any[]) => void): void; // Catch-all for other events
    }
}


const MusicPlayer = (props: {token: string | null, albumURI: string | null}) => {
    const [player, setPlayer] = useState<any>(null);
    const [deviceID, setDeviceID] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = async () => {
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
                    // TODO: REVERT BACK TO false
                    setIsConnected(true);
                }
            })

            player.on('ready', (event: {device_id: string}) => {
                setDeviceID(event.device_id);
            });

            setPlayer(player);
        }
    }, []);

    useEffect(() => {
        if (props.albumURI)
        {
            axios.get(import.meta.env.VITE_BFF_ADDRESS + "album_details/", {
                params: {
                    spotify_access_token: localStorage.getItem('spotify_access_token'),
                    album_uri: props.albumURI
                }
            }).then(function (response) {
                const album: Album = response.data;
                setCurrentAlbum({
                    title: album.title,
                    artists: album.artists,
                    image_url: album.image_url,
                    album_uri: album.album_uri,
                    tracks_url: album.tracks_url
                });
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
                setSongs(response.data.map((song: Song) => ({
                    title: song.title,
                    artists: song.artists,
                    uri: song.uri,
                    album_uri: song.album_uri
                })));
            })
            .catch(function (error) {
                console.log(error);
            })
        }

    }, [props.albumURI]);


    useEffect(() => {
        if (currentSong) {
            axios.post(import.meta.env.VITE_BFF_ADDRESS + "play_track/", null, {
                params: {
                    spotify_access_token: props.token,
                    track_uri: currentSong.uri,
                    device_id: deviceID
                }
            })
                .catch(function (error) {
                    console.log(error);
                });
        }
    }, [currentSong]);

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
                            {currentAlbum ? <AlbumDisplay currentAlbum={currentAlbum}/> : <div>No album</div>}
                            {currentSong ? <SongDetails currentSong={currentSong}/> : <div>No song</div>}
                        <Button onClick={playSong}>Play</Button>
                        <Button onClick={pauseSong}>Pause</Button>
                        <TrackList songs={songs} setCurrentSong={setCurrentSong}/>
                    </> : <div>Not connected to spotify</div>}</>
                </CardBody>
            </Card>
        </div>
    );
}

export default MusicPlayer;
