import { useCollectionShareConfirm } from "@/contexts/CollectionShareConfirmContext.tsx";
import type Notification from "@/interfaces/Notification.tsx";
import { Button } from "@nextui-org/button";
import { Modal, ModalContent } from "@nextui-org/modal";
import {
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
} from "@nextui-org/table";

const CollectionShareModal = () => {
	const {
		socket,
		notifications,
		setNotifications,
		isCollectionShareModalOpen,
		setIsCollectionShareModalOpen,
	} = useCollectionShareConfirm();

	const confirmShare = (notification: Notification) => {
		// Confirm that the user has accepted the shared collection
		// and remove the sharer from the list
		setNotifications((prevNotifications) =>
			prevNotifications.filter((n) => n.id !== notification.id),
		);
		const message = {
			notification_id: notification.id,
			accepted: true,
		};
		socket?.send(JSON.stringify(message));
	};

	const rejectShare = (notification: Notification) => {
		// Reject the shared collection and remove the sharer from the list
		setNotifications((prevNotifications) =>
			prevNotifications.filter((n) => n.id !== notification.id),
		);
		const message = {
			notification_id: notification.id,
			accepted: false,
		};
		socket?.send(JSON.stringify(message));
	};

	return (
		<Modal
			backdrop="blur"
			isOpen={isCollectionShareModalOpen}
			onClose={() => {
				setIsCollectionShareModalOpen(false);
			}}
			className="dark"
		>
			<ModalContent>
				<header className="w-full text-center pb-4 font-bold text-white">
					Confirm Share
				</header>
				{/* Each sharer gets a row with their username and buttons to accept or reject the shared collection */}
				<Table
					isStriped
					selectionMode="none"
					aria-label="Share confirm"
					className="text-white"
				>
					<TableHeader>
						<TableColumn className="text-center">Username</TableColumn>
						<TableColumn className="text-center">Actions</TableColumn>
					</TableHeader>
					<TableBody items={notifications} emptyContent="No users to display">
						{(notification: Notification) => (
							<TableRow key={notification.id}>
								<TableCell>{notification.sender_id}</TableCell>
								<TableCell>
									<div className="flex justify-center space-x-2">
										<Button onPress={() => confirmShare(notification)}>
											Accept
										</Button>
										<Button onPress={() => rejectShare(notification)}>
											Reject
										</Button>
									</div>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</ModalContent>
		</Modal>
	);
};

export default CollectionShareModal;
