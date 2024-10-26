import AddAlbum from "@/api_calls/AddAlbum.tsx";
import AlbumDisplay from "@/components/AlbumDisplay.tsx";
import { useUpload } from "@/contexts/CaptureContext.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { useUsername } from "@/contexts/UsernameContext.tsx";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Skeleton } from "@nextui-org/skeleton";
import { Spacer } from "@nextui-org/spacer";
import { useEffect, useState } from "react";

const AlbumConfirm = () => {
	const [buttonsDisabled, setButtonsDisabled] = useState(true);
	const { username } = useUsername();
	const {
		scannedAlbum,
		setScannedAlbum,
		fadeConfirm,
		setFadeConfirm,
		setCurrentImage,
	} = useUpload();
	const { setCurrentAlbum } = useMusic();

	const triggerConfirmSlide = () => {
		setFadeConfirm(!fadeConfirm);
	};

	useEffect(() => {
		if (scannedAlbum) {
			setButtonsDisabled(false);
		} else {
			setButtonsDisabled(true);
		}
	}, [scannedAlbum]);

	const confirmAlbum = () => {
		triggerConfirmSlide();
		setCurrentAlbum(scannedAlbum);
		if (username && scannedAlbum) {
			AddAlbum(username, scannedAlbum.album_uri);
		}
		setScannedAlbum(null);
		setCurrentImage(null);
	};

	const rejectAlbum = () => {
		triggerConfirmSlide();
		setCurrentAlbum(null);
		setScannedAlbum(null);
		setCurrentImage(null);
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
								{scannedAlbum ? (
									<div>
										<AlbumDisplay album={scannedAlbum} />
									</div>
								) : (
									<Skeleton style={{ width: "100%", paddingBottom: "100%" }}>
										<div />
									</Skeleton>
								)}
							</div>

							<Spacer className="flex pt-2 flex-shrink" />
							<div className="w-full flex-grow max-h-[10%]">
								{scannedAlbum ? (
									<Card className="bg-default-200 h-full overflow-y-auto">
										<div>
											<div className="text-center">{scannedAlbum.title}</div>
											<div className="text-center">
												{scannedAlbum.artists.join(", ")}
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
