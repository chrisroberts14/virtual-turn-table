import AddAlbum from "@/api_calls/AddAlbum";
import AlbumDisplay from "@/components/AlbumDisplay";
import Top10Select from "@/components/Top10Select.tsx";
import { useBFFToken } from "@/contexts/BFFTokenContext.ts";
import { useMusic } from "@/contexts/MusicContext";
import { useUpload } from "@/contexts/UploadContext";
import { useUsername } from "@/contexts/UsernameContext";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";
import { Spacer } from "@heroui/spacer";
import { useEffect, useState } from "react";

const AlbumConfirm = () => {
	const [buttonsDisabled, setButtonsDisabled] = useState(true);
	useUsername();
	const {
		scannedAlbum,
		setScannedAlbum,
		fadeConfirm,
		setFadeConfirm,
		setCurrentImage,
		isUploading,
	} = useUpload();
	const { setCurrentAlbum } = useMusic();
	const [isOnTop10Select, setIsOnTop10Select] = useState(false);
	const { BFFToken } = useBFFToken();

	const triggerConfirmSlide = () => {
		setFadeConfirm(!fadeConfirm);
	};

	useEffect(() => {
		if (fadeConfirm || isUploading) {
			setIsOnTop10Select(false);
		}
	}, [fadeConfirm, isUploading]);

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
		if (BFFToken && scannedAlbum) {
			AddAlbum(BFFToken, scannedAlbum.album_uri).catch((error) => {
				console.error(error);
			});
		}
		setScannedAlbum(null);
		setCurrentImage(null);
	};

	const rejectAlbum = () => {
		setIsOnTop10Select(true);
	};

	const goBack = () => {
		setIsOnTop10Select(false);
	};

	return (
		<div className="h-full flex flex-row max-h-full">
			<Card className="text-center w-full">
				<CardHeader className="justify-center">Album selection</CardHeader>
				{!isOnTop10Select ? (
					<>
						<CardBody className="flex flex-shrink max-h-[70%]">
							<div className="max-h-[20%] pb-[100%] justify-center text-center w-full">
								<div>
									<AlbumDisplay album={scannedAlbum} />
								</div>
							</div>
							<Spacer className="flex flex-shrink" />
							<div className="w-full">
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
								<p className="pb-4">Is this the correct album?</p>
								<div className="flex flex-row flex-grow px-6">
									<Button
										isDisabled={buttonsDisabled}
										style={{ background: "#8c0606" }}
										onPress={() => {
											rejectAlbum();
										}}
									>
										No
									</Button>
									<Spacer className="flex flex-grow" />
									<Button
										isDisabled={buttonsDisabled}
										style={{ background: "#0b6b02" }}
										onPress={() => {
											confirmAlbum();
										}}
									>
										Yes
									</Button>
								</div>
							</div>
						</CardFooter>
					</>
				) : (
					<CardBody className="flex flex-shrink">
						<div className="flex justify-center">
							<Button onPress={goBack} color="danger" className="max-w-[25%]">
								Back
							</Button>
						</div>
						<Top10Select />
					</CardBody>
				)}
			</Card>
		</div>
	);
};

export default AlbumConfirm;
