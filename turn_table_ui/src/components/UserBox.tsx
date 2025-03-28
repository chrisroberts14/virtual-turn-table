import DeleteUser from "@/api_calls/DeleteUser";
import GetIsCollectionPublic from "@/api_calls/GetIsCollectionPublic";
import GetUserAlbums from "@/api_calls/GetUserAlbums";
import ToggleCollectionPublic from "@/api_calls/ToggleCollectionPublic";
import ShareModal from "@/components/ShareModal";
import { useBFFToken } from "@/contexts/BFFTokenContext.ts";
import { useError } from "@/contexts/ErrorContext";
import { ShareContext } from "@/contexts/ShareContext";
import { useSuccess } from "@/contexts/SuccessContext.tsx";
import useUserBox from "@/hooks/UseUserBox";
import { clearStateData } from "@/interfaces/StateData.tsx";
import eventEmitter from "@/utils/EventEmitter";
import {
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownSection,
	DropdownTrigger,
} from "@heroui/dropdown";
import { User } from "@heroui/user";
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
	const { showError } = useError();
	const { showSuccess } = useSuccess();
	const { BFFToken } = useBFFToken();

	const deleteAccount = async () => {
		if (!username || !BFFToken) {
			showError("No user logged in");
			return;
		}
		clearStateData();
		return await DeleteUser(BFFToken);
	};

	useEffect(() => {
		if (username && BFFToken) {
			GetUserAlbums(username, BFFToken).then((albums) => {
				if (albums.length === 0) {
					setDisabledKeys(["share", "togglePublic"]);
				} else {
					setDisabledKeys([]);
				}
			});
			GetIsCollectionPublic(username).then((isPublic) => {
				setIsCollectionPublic(isPublic);
			});
		}
	}, [username, setIsCollectionPublic, BFFToken]);

	useEffect(() => {
		eventEmitter.on("albumAdded", () => {
			setDisabledKeys([]);
		});
	}, []);

	return (
		<div>
			<Dropdown backdrop="blur">
				{profileImage && (
					<DropdownTrigger>
						<User
							name={username}
							as="button"
							avatarProps={{
								src: profileImage,
								alt: "Profile image",
							}}
							isFocusable={true}
							className="hidden sm:flex"
						/>
					</DropdownTrigger>
				)}
				<DropdownMenu
					disabledKeys={disabledKeys}
					onAction={(key) => {
						if (key === "logout") {
							logout();
						} else if (key === "togglePublic") {
							if (BFFToken) {
								ToggleCollectionPublic(BFFToken).then(() => {
									// Set the state to the opposite of the current state
									setIsCollectionPublic(!isCollectionPublic);
									showSuccess(
										isCollectionPublic
											? "Collection is now private"
											: "Collection is now public",
									);
								});
							}
						} else if (key === "share") {
							setIsShareModalOpen(true);
						} else if (key === "delete") {
							deleteAccount()
								.then((response) => {
									showSuccess("Account deleted");
									if (response.success) {
										// Redirect to the login page
										window.location.href = "/";
									} else {
										showError(response.message);
									}
								})
								.catch((error) => {
									showError(error.message);
								});
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
						{!isCollectionPublic ? (
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
