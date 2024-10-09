import {Navbar, NavbarBrand, NavbarItem} from "@nextui-org/navbar";
import {Button} from "@nextui-org/button";
import Login from "./components/Login";
import React, {useEffect} from "react";

function App() {
    const [isSignedIn, setIsSignedIn] = React.useState(false);
    useEffect(() => {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const token = params.get("access_token")

        if (token) {
            localStorage.setItem('spotify_access_token', token);
            setIsSignedIn(true);
        } else {
            setIsSignedIn(false);
        }
    });

    return (
    <Navbar shouldHideOnScroll>
        <NavbarBrand>
            <p className="font-bold text-2xl">Virtual Turn Table</p>
        </NavbarBrand>
        <NavbarItem>
            {!isSignedIn ? <Login></Login> : <Button>Sign Out</Button>}
        </NavbarItem>
    </Navbar>
    );
}

export default App;
