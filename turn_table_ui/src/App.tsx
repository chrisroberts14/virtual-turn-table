import {Navbar, NavbarBrand, NavbarItem} from "@nextui-org/navbar";
import Login from "./components/Login";
import UserBox from "./components/UserBox";
import {useEffect, useState} from "react";
import Upload from "@/components/Upload.tsx";
import MusicPlayer from "@/components/MusicPlayer.tsx";
import { Logo } from "./components/Logo.tsx";

function App() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [albumURI, setAlbumURI] = useState("");
    const [spotifyToken, setSpotifyToken] = useState("");


    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token")

        if (token) {
            localStorage.setItem('spotify_access_token', token);
            localStorage.setItem('spotify_login_time', String(new Date()));
            localStorage.setItem("spotify_session_length", params.get("expires_in") as string);
            setIsSignedIn(true);
            setSpotifyToken(token);
            window.location.href = "/";
        } else{
            const storageToken = localStorage.getItem('spotify_access_token');
            if (storageToken) {
                const start_time = localStorage.getItem("spotify_login_time");
                const session_length = Number(localStorage.getItem("spotify_session_length"));
                if (start_time) {
                    const current_session_length = (new Date().getTime() - new Date(start_time).getTime()) / 1000;

                    if (current_session_length > Number(session_length)) {
                        localStorage.removeItem('spotify_access_token');
                        localStorage.removeItem('spotify_login_time');
                        localStorage.removeItem("spotify_session_length");
                        setIsSignedIn(false);
                        setSpotifyToken("");
                    } else {
                        setIsSignedIn(true);
                        setSpotifyToken(storageToken);
                    }
                }

            } else {
                setIsSignedIn(false);
                setSpotifyToken("");
            }
        }
    });

    return (
        <>
            <Navbar
                style={{
                    backgroundColor: '#383838',
                    borderBottom: '2px solid #000',
                }}>
                <NavbarBrand>
                    <Logo/>
                    <p className="font-bold text-inherit" style={{padding: 10}}>Virtual Turn Table</p>
                </NavbarBrand>
                <NavbarItem>
                    {!isSignedIn ? <Login/> : <UserBox/>}
                </NavbarItem>
            </Navbar>
            <Upload setAlbumURI={setAlbumURI}/>
            {isSignedIn ? <MusicPlayer token={spotifyToken} albumURI={albumURI}/>: <div>Please sign into spotify to use</div>}

        </>
    );
}

export default App;
