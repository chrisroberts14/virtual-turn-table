import AlbumCollectionDisplay from "@/components/AlbumCollectionDisplay.tsx";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";

const AlbumHistorySelector = () => {
	return (
		<>
			<div className="min-w-[20%] h-full pt-2">
				<Card>
					<CardBody>
						<div className="flex flex-col items-center">
							<div className="text-center">Album History</div>
						</div>
					</CardBody>
				</Card>
				<div className="px-4 py-2">
					<Card>
						<CardHeader className="justify-center">
							<div className="flex flex-col items-center">
								<div className="text-center">Selected Album</div>
							</div>
						</CardHeader>
						<CardFooter className="justify-center">
							<div className="flex flex-col items-center">
								<div className="text-center">Selected Album</div>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
			<div className="flex-grow flex justify-center w-screen overflow-x-auto">
				<AlbumCollectionDisplay />
			</div>
		</>
	);
};

export default AlbumHistorySelector;
