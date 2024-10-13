import {SetStateAction, useEffect, useState} from "react";
import {Button} from "@nextui-org/button";
import axios from "axios";
import AlbumDisplay from "@/components/AlbumDisplay.tsx";
import {Card, CardBody} from "@nextui-org/card";
import SongDetails from "@/components/SongDetails.tsx";
import TrackList from "@/components/TrackList.tsx";
import Song from "@/interfaces/Song.tsx";
import Album from "@/interfaces/Album.tsx";
import TrackScrubber from "@/components/TrackScrubber.tsx";
import VolumeScrubber from "@/components/VolumeScrubber.tsx";


const MusicPlayer = (props: { token: string | null, albumURI: string | null }) => {
    const [player, setPlayer] = useState<SpotifyPlayer | null>(null);
    const [deviceID, setDeviceID] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const [songs, setSongs] = useState<Song[]>([]);
    const [currentSong, setCurrentSong] = useState<Song | null>(null);
    const [currentAlbum, setCurrentAlbum] = useState<Album | null>(null);
    const [isPaused, setIsPaused] = useState(false);
    const [trackPosition, setTrackPosition] = useState(0); // In ms
    const [trackDuration, setTrackDuration] = useState(0);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        script.async = true;
        document.body.appendChild(script);

        window.onSpotifyWebPlaybackSDKReady = async () => {
            const player = new window.Spotify.Player({
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

            player.on('ready', (event: { device_id: string }) => {
                setDeviceID(event.device_id);
            });

            player.addListener('player_state_changed', (state: { paused: boolean | ((prevState: boolean) => boolean); position: SetStateAction<number>; duration: SetStateAction<number>; }) => {
                if (!state) return;

                setIsPaused(state.paused);
                setTrackPosition(state.position);
                setTrackDuration(state.duration);
            });

            setPlayer(player);
        }
    }, [props.token]);




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
        if (player)
        {
            await player.pause()
            setIsPaused(true);
        }
    }

    const playSong = async () => {
        if (player)
        {
            await player.resume()
            setIsPaused(false);
        }
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
                        <TrackScrubber player={player} trackPosition={trackPosition} trackDuration={trackDuration}/>
                        <VolumeScrubber player={player}/>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row'
                        }}>
                            {!isPaused ? <Button onClick={pauseSong}>Pause</Button> :
                                <Button onClick={playSong}>Play</Button>}
                        </div>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}>
                            <TrackList songs={songs} setCurrentSong={setCurrentSong}/>
                        </div>


                    </> : <div>Not connected to spotify</div>}</>
                </CardBody>
            </Card>
        </div>
    );
}

export default MusicPlayer;
