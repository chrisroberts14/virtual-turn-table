import GetUserInfo from "@/api_calls/GetUserInfo.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import { clearStateData, getStateData } from "@/interfaces/StateData.tsx";
import { Avatar } from "@nextui-org/avatar";
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

	const logout = () => {
		clearStateData();
		window.location.href = "/";
	};

	return (
		<Dropdown>
			<DropdownTrigger>
				<div>
					<User
						name={username}
						description={email}
						avatarProps={{
							src: profileImage,
						}}
						isFocusable={true}
						className="hidden sm:flex"
					/>
					<Avatar src={profileImage} className="block sm:hidden" />
				</div>
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
