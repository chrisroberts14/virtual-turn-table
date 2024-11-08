import ToggleCollectionPublic from "@/api_calls/ToggleCollectionPublic.tsx";
import ShareModal from "@/components/ShareModal.tsx";
import useUserBox from "@/hooks/UseUserBox.tsx";
import { Avatar } from "@nextui-org/avatar";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { User } from "@nextui-org/user";
import { useState } from "react";

const UserBox = () => {
	const {
		profileImage,
		username,
		logout,
		isCollectionPublic,
		setIsCollectionPublic,
	} = useUserBox();
	const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

	return (
		<div>
			<Dropdown>
				<DropdownTrigger>
					<div>
						<User
							name={username}
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
						} else if (key === "togglePublic") {
							if (username) {
								ToggleCollectionPublic(username).then(() => {
									// Set the state to the opposite of the current state
									setIsCollectionPublic(!isCollectionPublic);
								});
							}
						} else if (key === "share") {
							setIsShareModalOpen(true);
						}
					}}
				>
					{isCollectionPublic ? (
						<DropdownItem key={"togglePublic"}>
							Set collection public
						</DropdownItem>
					) : (
						<DropdownItem key={"togglePublic"}>
							Set collection private
						</DropdownItem>
					)}
					<DropdownItem key={"share"}>Share collection</DropdownItem>
					<DropdownItem key={"logout"}>Logout</DropdownItem>
				</DropdownMenu>
			</Dropdown>
			<ShareModal isOpen={isShareModalOpen} setIsOpen={setIsShareModalOpen} />
		</div>
	);
};

export default UserBox;
