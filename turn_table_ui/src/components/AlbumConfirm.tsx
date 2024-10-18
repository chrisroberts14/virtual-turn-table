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
	};

	const rejectAlbum = () => {
		props.setCurrentAlbum(null);
	};

	return (
		<div className="h-full flex flex-row max-h-full">
			<div className="w-full flex flex-row h-full justify-center max-h-full">
				<div className="flex flex-col flex-grow max-w-[100%] max-h-full">
					<Card className="flex-shrink max-w-[100%] text-center h-full min-w-0 max-h-full">
						<CardHeader className="justify-center">Album selection</CardHeader>
						<CardBody>
							<div
								className="max-h-[50%]"
								style={{ width: "80%", paddingBottom: "100%" }}
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

							<Spacer className="pt-2" />
							<div className="w-full flex-grow">
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

						<CardFooter className="flex justify-center">
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
						</CardFooter>
					</Card>
				</div>
			</div>
		</div>
	);
};

export default AlbumConfirm;
