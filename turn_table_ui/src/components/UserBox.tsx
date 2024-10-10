import {User} from "@nextui-org/user";
import React, {useEffect} from "react";
import axios from "axios";

const UserBox = () => {
    const [displayName, setDisplayName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [profileImage, setProfileImage] = React.useState()

    useEffect(() => {
            axios.get(import.meta.env.VITE_BFF_ADDRESS + "/get_user_info/", {
                params: {
                    spotify_access_token: localStorage.getItem('spotify_access_token')
                }
            })
            .then(function (response) {
                console.log(response);
                setDisplayName(response.data["display_name"]);
                setEmail(response.data["email"]);
                setProfileImage(response.data["image_url"]);
            })
            .catch(function (error) {
                console.log(error);
            });
        }
    )

    return (
        <User
            name={displayName}
            description={email}
            avatarProps={{
                src: profileImage
            }}
        />
    );
}

export default UserBox;
