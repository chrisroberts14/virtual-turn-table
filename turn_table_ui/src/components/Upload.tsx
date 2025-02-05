import UploadFile from "@/api_calls/UploadFile";
import { useError } from "@/contexts/ErrorContext";
import { useUpload } from "@/contexts/UploadContext";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@heroui/button";
import { Card, CardBody, CardFooter, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Image } from "@heroui/image";
import { Input } from "@heroui/input";
import type React from "react";
import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

const Upload: React.FC<{
	triggerConfirmSlide: () => void;
	setTop10: Dispatch<SetStateAction<Album[]>>;
}> = ({ triggerConfirmSlide, setTop10 }) => {
	const [file, setFile] = useState<File | null>(null);
	const [fileImage, setFileImage] = useState<string | null>(null);
	const { showError } = useError();
	const { setIsUploading, setScannedAlbum, isUploading, fadeConfirm } =
		useUpload();

	const handleUpload = async () => {
		if (file) {
			setIsUploading(true);
			if (!fadeConfirm) {
				triggerConfirmSlide();
			}
			await UploadFile(file, setScannedAlbum, setTop10).catch((error) => {
				showError(error.message);
			});
		}
		setIsUploading(false);
	};

	const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files?.[0]) {
			setFileImage(URL.createObjectURL(e.target.files[0]));
		} else {
			setFileImage(null);
		}
	};

	return (
		<>
			<div className="flex flex-col justify-center">
				<Card className="max-w-[400px] max-h-full">
					<CardHeader className="flex gap-3">
						<Input
							type={"file"}
							onChange={(e) => {
								if (e.target.files) {
									setFile(e.target.files[0]);
								}
								onImageChange(e);
							}}
							accept={".png, .jpg"}
							title={"Upload file input"}
						/>
					</CardHeader>
					<Divider />
					<CardBody>
						{fileImage && <Image src={fileImage} alt="Uploaded Image" />}
					</CardBody>
					<Divider />
					<CardFooter className="justify-center">
						<Button
							onPress={handleUpload}
							className="submit"
							isDisabled={isUploading || !file}
						>
							Upload a file
						</Button>
					</CardFooter>
				</Card>
			</div>
		</>
	);
};

export default Upload;
