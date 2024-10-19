import AlbumDisplay from "@/components/AlbumDisplay.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { Spacer } from "@nextui-org/spacer";
import type React from "react";
import { type SetStateAction, useEffect, useState } from "react";

const AlbumConfirm = (props: {
	scannedAlbum: Album | null;
	setScannedAlbum: React.Dispatch<SetStateAction<Album | null>>;
	setCurrentAlbum: React.Dispatch<SetStateAction<Album | null>>;
}) => {
	const [buttonsDisabled, setButtonsDisabled] = useState(true);

	useEffect(() => {
		if (props.scannedAlbum) {
			setButtonsDisabled(false);
		} else {
			setButtonsDisabled(true);
		}
	}, [props.scannedAlbum]);

	const confirmAlbum = () => {
		props.setCurrentAlbum(props.scannedAlbum);
		props.setScannedAlbum(null);
	};

	const rejectAlbum = () => {
		props.setCurrentAlbum(null);
		props.setScannedAlbum(null);
	};

	return (
		<div className="h-full flex flex-row max-h-full">
			<div className="w-full flex flex-row h-full justify-center max-h-full">
				<div className="flex flex-col flex-grow max-w-[100%] max-h-full">
					<Card className="flex-shrink max-w-[100%] text-center h-full min-w-0 max-h-full">
						<CardHeader className="justify-center">Album selection</CardHeader>
						<CardBody className="flex flex-shrink max-h-[70%]">
							<div
								className="max-h-[50%] flex-grow"
								style={{ width: "100%", paddingBottom: "100%" }}
							>
								{props.scannedAlbum ? (
									<div>
										<AlbumDisplay album={props.scannedAlbum} />
									</div>
								) : (
									<Skeleton style={{ width: "100%", paddingBottom: "100%" }}>
										<div />
									</Skeleton>
								)}
							</div>

							<Spacer className="flex pt-2 flex-shrink" />
							<div className="w-full flex-grow max-h-[10%]">
								{props.scannedAlbum ? (
									<Card className="bg-default-200 h-full">
										<div>
											<div className="text-center">
												{props.scannedAlbum.title}
											</div>
											<div className="text-center">
												{props.scannedAlbum.artists.join(", ")}
											</div>
										</div>
									</Card>
								) : (
									<Skeleton className="h-full">
										<div />
									</Skeleton>
								)}
							</div>
						</CardBody>
						<CardFooter className="flex flex-grow justify-center">
							<div className="flex flex-col flex-grow px-6">
								<p className="pb-10">Is this the correct album?</p>
								<div className="flex flex-row flex-grow px-6">
									<Button
										isDisabled={buttonsDisabled}
										style={{ background: "#8c0606" }}
										onClick={rejectAlbum}
									>
										No
									</Button>
									<Spacer className="flex flex-grow" />
									<Button
										isDisabled={buttonsDisabled}
										style={{ background: "#0b6b02" }}
										onClick={confirmAlbum}
									>
										Yes
									</Button>
								</div>
							</div>
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AlbumConfirm;
