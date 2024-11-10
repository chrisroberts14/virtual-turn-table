import { useCollectionShareConfirm } from "@/contexts/CollectionShareConfirmContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import type Sharer from "@/interfaces/Sharer.tsx";
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
import { type Key, useCallback } from "react";

const CollectionShareModal = () => {
	const {
		socket,
		sharers,
		setSharers,
		isCollectionShareModalOpen,
		setIsCollectionShareModalOpen,
	} = useCollectionShareConfirm();
	const { username } = useUsername();

	const renderCell = useCallback((item: Sharer, columnKey: Key) => {
		switch (columnKey) {
			case "username":
				return item.username;
			case "actions":
				return (
					<div className="flex space-x-2">
						<Button
							onClick={() => confirmShare(item)}
							className="bg-green-500 text-white p-1 rounded"
						>
							Accept
						</Button>
						<Button
							onClick={() => rejectShare(item)}
							className="bg-red-500 text-white p-1 rounded"
						>
							Reject
						</Button>
					</div>
				);
			default:
				return null;
		}
	}, []);

	const confirmShare = (sharer: Sharer) => {
		// Confirm that the user has accepted the shared collection
		// and remove the sharer from the list
		setSharers(sharers.filter((s) => s !== sharer));
		if (sharer && username) {
			const data = {
				type: "confirm",
				sharer: sharer,
				username: username,
			};
			socket?.send(JSON.stringify(data));
		}
	};

	const rejectShare = (sharer: Sharer) => {
		// Reject the shared collection and remove the sharer from the list
		setSharers(sharers.filter((s) => s !== sharer));
		if (sharer && username) {
			const data = {
				type: "reject",
				sharer: sharer,
				username: username,
			};
			socket?.send(JSON.stringify(data));
		}
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
				<Table isStriped selectionMode="none" aria-label="Share confirm">
					<TableHeader>
						<TableColumn key="username">Sharer</TableColumn>
						<TableColumn key="actions">Actions</TableColumn>
					</TableHeader>
					<TableBody items={sharers} emptyContent={"No rows to display"}>
						{(item: Sharer) => (
							<TableRow key={item.username}>
								{(columnKey) => (
									<TableCell>{renderCell(item, columnKey)}</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</ModalContent>
		</Modal>
	);
};

export default CollectionShareModal;
