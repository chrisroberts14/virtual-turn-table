import { getStateData, storeStateData } from "@/interfaces/StateData.tsx";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { User } from "@nextui-org/user";
import axios from "axios";
import React, { useEffect } from "react";

const UserBox = () => {
	const [displayName, setDisplayName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [profileImage, setProfileImage] = React.useState();

	useEffect(() => {
		const state = getStateData();
		if (state && "spotify_access_token" in state) {
			axios
				.get(`${import.meta.env.VITE_BFF_ADDRESS}get_user_info/`, {
					params: {
						spotify_access_token: state.spotify_access_token,
					},
				})
				.then((response) => {
					setDisplayName(response.data.display_name);
					setEmail(response.data.email);
					setProfileImage(response.data.image_url);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	});

	const logout = () => {
		storeStateData({
			spotify_access_token: "",
			spotify_login_time: "",
			spotify_session_length: "",
		});
		window.location.href = "/";
	};

	return (
		<Dropdown>
			<DropdownTrigger>
				<User
					name={displayName}
					description={email}
					avatarProps={{
						src: profileImage,
					}}
					isFocusable={true}
				/>
			</DropdownTrigger>
			<DropdownMenu
				onAction={(key) => {
					if (key === "logout") {
						logout();
					}
				}}
			>
				<DropdownItem key={"logout"}>Logout</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	);
};

export default UserBox;
