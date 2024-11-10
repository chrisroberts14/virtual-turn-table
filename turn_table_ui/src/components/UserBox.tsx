import GetUserAlbums from "@/api_calls/GetUserAlbums.tsx";
import ToggleCollectionPublic from "@/api_calls/ToggleCollectionPublic.tsx";
import ShareModal from "@/components/ShareModal.tsx";
import { ShareContext } from "@/contexts/ShareContext.tsx";
import useUserBox from "@/hooks/UseUserBox.tsx";
import eventEmitter from "@/utils/EventEmitter.ts";
import { Avatar } from "@nextui-org/avatar";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@nextui-org/dropdown";
import { User } from "@nextui-org/user";
import { useEffect, useState } from "react";
import {
	MdDelete,
	MdLogout,
	MdPrivateConnectivity,
	MdPublic,
	MdShare,
} from "react-icons/md";

const UserBox = () => {
	const {
		profileImage,
		username,
		logout,
		isCollectionPublic,
		setIsCollectionPublic,
	} = useUserBox();
	const [disabledKeys, setDisabledKeys] = useState<string[]>([
		"share",
		"togglePublic",
	]);
	const [shareInputValue, setShareInputValue] = useState<string>("");
	const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

	useEffect(() => {
		if (username) {
			GetUserAlbums(username).then((albums) => {
				if (albums.length === 0) {
					setDisabledKeys(["share", "togglePublic"]);
				} else {
					setDisabledKeys([]);
				}
			});
		}
	}, [username]);

	useEffect(() => {
		eventEmitter.on("albumAdded", () => {
			setDisabledKeys([]);
		});
	}, []);

	return (
		<div>
			<Dropdown backdrop="blur">
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
					disabledKeys={disabledKeys}
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
					<DropdownSection
						title={
							disabledKeys.length !== 0
								? "You can't share an empty collection"
								: "Your collection"
						}
					>
						{isCollectionPublic ? (
							<DropdownItem
								key={"togglePublic"}
								description="Share your collection pubicly"
								startContent={<MdPublic />}
							>
								Set collection public
							</DropdownItem>
						) : (
							<DropdownItem
								key={"togglePublic"}
								description="Unshare your collection pubicly"
								startContent={<MdPrivateConnectivity />}
							>
								Set collection private
							</DropdownItem>
						)}
						<DropdownItem
							key={"share"}
							description="Share your collection with select users"
							startContent={<MdShare />}
						>
							Share collection
						</DropdownItem>
					</DropdownSection>
					<DropdownSection title="Account">
						<DropdownItem
							key={"delete"}
							color="danger"
							startContent={<MdDelete />}
						>
							Delete your account
						</DropdownItem>
						<DropdownItem
							key={"logout"}
							color="danger"
							startContent={<MdLogout />}
						>
							Logout
						</DropdownItem>
					</DropdownSection>
				</DropdownMenu>
			</Dropdown>
			<ShareContext.Provider
				value={{
					isShareModalOpen,
					setIsShareModalOpen,
					shareInputValue,
					setShareInputValue,
				}}
			>
				<ShareModal />
			</ShareContext.Provider>
		</div>
	);
};

export default UserBox;
