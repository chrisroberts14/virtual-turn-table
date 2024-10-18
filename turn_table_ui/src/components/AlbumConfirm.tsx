import AlbumDisplay from "@/components/AlbumDisplay.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { Spacer } from "@nextui-org/spacer";
import { useEffect, useState } from "react";

const AlbumConfirm = (props: { scannedAlbum: Album | null }) => {
	const [buttonsDisabled, setButtonsDisabled] = useState(true);

	useEffect(() => {
		if (props.scannedAlbum) {
			setButtonsDisabled(false);
		} else {
			setButtonsDisabled(true);
		}
	}, [props.scannedAlbum]);

	return (
		<div className="h-full flex flex-row">
			<div className="w-full flex flex-row h-full justify-center">
				<div className="flex flex-col flex-grow max-w-[100%]">
					<Card className="flex-shrink max-w-[100%] text-center h-full">
						<CardHeader className="justify-center">Album selection</CardHeader>
						<CardBody>
							{props.scannedAlbum ? (
								<AlbumDisplay album={props.scannedAlbum} />
							) : (
								<Skeleton
									className="min-h-[30%]"
									style={{ width: "100%", paddingBottom: "100%" }}
								>
									<div />
								</Skeleton>
							)}
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
								>
									No
								</Button>
								<Spacer className="flex flex-grow" />
								<Button
									isDisabled={buttonsDisabled}
									style={{ background: "#0b6b02" }}
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
