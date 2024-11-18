import ShareCollection from "@/api_calls/ShareCollection";
import UserSelect from "@/components/UserSelect";
import { useError } from "@/contexts/ErrorContext";
import { useShare } from "@/contexts/ShareContext";
import { useUsername } from "@/contexts/UsernameContext";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent } from "@nextui-org/modal";

const ShareModal = () => {
	const { username } = useUsername();
	const { showError } = useError();
	const {
		shareInputValue,
		setShareInputValue,
		isShareModalOpen,
		setIsShareModalOpen,
	} = useShare();

	const handleShare = () => {
		setIsShareModalOpen(false);
		// Share the users collection
		ShareCollection(username, shareInputValue).catch(() => {
			showError("Failed to share collection");
		});
		setShareInputValue("");
	};

	return (
		<Modal
			className="dark"
			backdrop="blur"
			isOpen={isShareModalOpen}
			placement="top-center"
			onClose={() => {
				setIsShareModalOpen(false);
				setShareInputValue("");
			}}
		>
			<ModalContent>
				<div className="justify-center w-full text-center space-y-2 p-2">
					<h1 className="w-full text-center font-bold pb-2 text-white">
						Share
					</h1>
					<UserSelect />
					<Button
						className="bg-primary font-bold text-white"
						onClick={handleShare}
						title="Share button"
						disabled={shareInputValue === ""}
					>
						Share
					</Button>
				</div>
			</ModalContent>
		</Modal>
	);
};

export default ShareModal;