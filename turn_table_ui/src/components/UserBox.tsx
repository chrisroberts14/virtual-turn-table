import CreateUser from "@/api_calls/CreateUser.tsx";
import GetUserInfo from "@/api_calls/GetUserInfo.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { clearStateData, getStateData } from "@/interfaces/StateData.tsx";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { User } from "@nextui-org/user";
import React, { useEffect } from "react";

const UserBox = () => {
	const [displayName, setDisplayName] = React.useState("");
	const [email, setEmail] = React.useState("");
	const [profileImage, setProfileImage] = React.useState("");
	const { showError } = useError();

	useEffect(() => {
		const state = getStateData();
		if (state && "spotify_access_token" in state) {
			GetUserInfo(
				state.spotify_access_token,
				setDisplayName,
				setEmail,
				setProfileImage,
			).catch((error) => {
				showError(error.message);
			});
		}
	}, [showError]);

	useEffect(() => {
		if (displayName === "" || email === "") {
			return;
		}
		CreateUser(displayName, email).catch((error) => {
			showError(error.message);
		});
	}, [displayName, email, showError]);

	const logout = () => {
		clearStateData();
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
