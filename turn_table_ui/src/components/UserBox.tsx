import CreateUser from "@/api_calls/CreateUser.tsx";
import GetUserInfo from "@/api_calls/GetUserInfo.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import { clearStateData, getStateData } from "@/interfaces/StateData.tsx";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { User } from "@nextui-org/user";
import { useEffect, useState } from "react";

const UserBox = () => {
	const [email, setEmail] = useState("");
	const [profileImage, setProfileImage] = useState("");
	const { showError } = useError();
	const { username, setUsername } = useUsername();

	useEffect(() => {
		const state = getStateData();
		if (state && "spotify_access_token" in state) {
			GetUserInfo(state.spotify_access_token)
				.then((response) => {
					if (response) {
						setUsername(response.display_name);
						setEmail(response.email);
						setProfileImage(response.image_url);
					}
				})
				.catch((_) => {
					logout();
				});
		}
	}, [setUsername]);

	useEffect(() => {
		if (!username || !email) {
			return;
		}
		CreateUser(username, email).catch((error) => {
			showError(error.message);
		});
	}, [username, email, showError]);

	const logout = () => {
		clearStateData();
		window.location.href = "/";
	};

	return (
		<Dropdown>
			<DropdownTrigger>
				<User
					name={username}
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
