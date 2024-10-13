import {User} from "@nextui-org/user";
import React, {useEffect} from "react";
import axios from "axios";
import {Dropdown, DropdownItem, DropdownMenu, DropdownTrigger} from "@nextui-org/dropdown";

const UserBox = () => {
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [profileImage, setProfileImage] = React.useState()

    useEffect(() => {
            axios.get(import.meta.env.VITE_BFF_ADDRESS + "get_user_info/", {
                params: {
                    spotify_access_token: localStorage.getItem('spotify_access_token')
                }
            })
            .then(function (response) {
                setDisplayName(response.data["display_name"]);
                setEmail(response.data["email"]);
                setProfileImage(response.data["image_url"]);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    )

    const logout = () => {
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_login_time');
        localStorage.removeItem("spotify_session_length");
        window.location.href = "/";
    }

    return (
        <Dropdown >
            <DropdownTrigger>
                <User
                    name={displayName}
                    description={email}
                    avatarProps={{
                        src: profileImage
                    }}
                    isFocusable={true}
                />
            </DropdownTrigger>
            <DropdownMenu onAction={(key) => {if (key == "logout") {logout()}}}>
                <DropdownItem key={"logout"}>Logout</DropdownItem>
            </DropdownMenu>
        </Dropdown>

    );
}

export default UserBox;
