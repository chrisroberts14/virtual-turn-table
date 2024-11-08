import UserSelect from "@/components/UserSelect.tsx";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent } from "@nextui-org/modal";

interface ShareModalProps {
	isOpen: boolean;
	setIsOpen: (value: boolean) => void;
}

const ShareModal = ({ isOpen, setIsOpen }: ShareModalProps) => {
	return (
		<Modal
			className="bg-gray-600"
			backdrop="blur"
			isOpen={isOpen}
			placement="top-center"
			onClose={() => {
				setIsOpen(false);
			}}
		>
			<ModalContent>
				<div className="justify-center w-full text-center space-y-2 p-2">
					<h1 className="w-full text-center font-bold pb-2">Share</h1>
					<UserSelect />
					<Button className="bg-primary font-bold text-white">Share</Button>
				</div>
			</ModalContent>
		</Modal>
	);
};

export default ShareModal;
