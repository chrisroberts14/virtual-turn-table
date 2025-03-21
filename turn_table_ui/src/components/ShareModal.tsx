import ShareCollection from "@/api_calls/ShareCollection";
import UserSelect from "@/components/UserSelect";
import { useBFFToken } from "@/contexts/BFFTokenContext.ts";
import { useError } from "@/contexts/ErrorContext";
import { useShare } from "@/contexts/ShareContext";
import { useSuccess } from "@/contexts/SuccessContext.tsx";
import { Button } from "@heroui/button";
import { Modal, ModalContent } from "@heroui/modal";

const ShareModal = () => {
	const { BFFToken } = useBFFToken();
	const { showError } = useError();
	const { showSuccess } = useSuccess();
	const {
		shareInputValue,
		setShareInputValue,
		isShareModalOpen,
		setIsShareModalOpen,
	} = useShare();

	const handleShare = () => {
		setIsShareModalOpen(false);
		// Share the users collection
		if (BFFToken === null) {
			showError("Failed to share collection");
			return;
		}
		ShareCollection(BFFToken, shareInputValue)
			.then(() => {
				showSuccess("Collection shared");
			})
			.catch(() => {
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
						onPress={handleShare}
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
