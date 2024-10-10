import {Navbar, NavbarBrand, NavbarItem} from "@nextui-org/navbar";
import Login from "./components/Login";
import UserBox from "./components/UserBox";
import React, {useEffect} from "react";
import Upload from "@/components/Upload.tsx";

function App() {
    const [isSignedIn, setIsSignedIn] = React.useState(false);

    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token")

        if (token) {
            localStorage.setItem('spotify_access_token', token);
            localStorage.setItem('spotify_login_time', String(new Date()));
            localStorage.setItem("spotify_session_length", params.get("expires_in") as string);
            setIsSignedIn(true);
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
            <Upload></Upload>
        </>
    );
}

export default App;
