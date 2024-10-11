import {Navbar, NavbarBrand, NavbarItem} from "@nextui-org/navbar";
import Login from "./components/Login";
import UserBox from "./components/UserBox";
import {useEffect, useState} from "react";
import Upload from "@/components/Upload.tsx";
import axios from "axios";
import Album from "@/components/Album.tsx";
import MusicPlayer from "@/components/MusicPlayer.tsx";

function App() {
    const [isSignedIn, setIsSignedIn] = useState(false);
    const [albumURI, setAlbumURI] = useState("");
    const [currentAlbumTitle, setCurrentAlbumTitle] = useState("");
    const [currentAlbumArtist, setCurrentAlbumArtist] = useState("");
    const [currentAlbumImage, setCurrentAlbumImage] = useState("");

    useEffect(() => {
        console.log(import.meta.env);
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token")

        if (token) {
            localStorage.setItem('spotify_access_token', token);
            localStorage.setItem('spotify_login_time', String(new Date()));
            localStorage.setItem("spotify_session_length", params.get("expires_in") as string);
            setIsSignedIn(true);
            // @ts-ignore
            window.location = "/";
        } else if (localStorage.getItem('spotify_access_token')) {
            const start_time = localStorage.getItem("spotify_login_time");

            // @ts-ignore
            const session_length = (new Date().getTime() - new Date(start_time).getTime()) / 1000;
            if (session_length > Number(localStorage.getItem("spotify_session_length"))) {
                localStorage.removeItem('spotify_access_token');
                localStorage.removeItem('spotify_login_time');
                localStorage.removeItem("spotify_session_length");
                setIsSignedIn(false);
            } else {
                setIsSignedIn(true);
            }
        } else {
            setIsSignedIn(false);
        }
    });

    useEffect(() => {
        if (localStorage.getItem('spotify_access_token') && albumURI){
            axios.get(import.meta.env.VITE_BFF_ADDRESS + "/album_details/", {
                params: {
                    spotify_access_token: localStorage.getItem('spotify_access_token'),
                    album_uri: albumURI
                }
            }).then(function (response) {
                console.log(response);
                setCurrentAlbumTitle(response.data["title"]);
                setCurrentAlbumArtist(response.data["artists"]);
                setCurrentAlbumImage(response.data["image_url"]);
            }).catch(function (error) {
                console.log(error);
            });
        }
    }, [albumURI]);

    return (
        <>
            <Navbar shouldHideOnScroll>
                <NavbarBrand>
                    <p className="font-bold text-2xl">Virtual Turn Table</p>
                </NavbarBrand>
                <NavbarItem>
                    {!isSignedIn ? <Login></Login> : <UserBox></UserBox>}
                </NavbarItem>
            </Navbar>
            <Upload setAlbumURI={setAlbumURI}></Upload>
            <Album title={currentAlbumTitle} artist={currentAlbumArtist} img_url={currentAlbumImage}></Album>
            <MusicPlayer token={localStorage.getItem('spotify_access_token')}></MusicPlayer>
        </>
    );
}

export default App;
