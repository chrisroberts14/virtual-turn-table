import UploadFile from "@/api_calls/UploadFile.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import type React from "react";
import { type Dispatch, type SetStateAction, useState } from "react";

const Upload: React.FC<{
	setScannedAlbum: Dispatch<SetStateAction<Album | null>>;
	setIsUploading: Dispatch<SetStateAction<boolean>>;
	triggerConfirmSlide: () => void;
}> = ({ setScannedAlbum, setIsUploading, triggerConfirmSlide }) => {
	const [file, setFile] = useState<File | null>(null);
	const { showError } = useError();

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			if (e.target.files?.length > 0) {
				if (e.target.files[0]) {
					setFile(e.target.files[0]);
				}
			}
		}
	};

	const handleUpload = async () => {
		if (file) {
			setIsUploading(true);
			triggerConfirmSlide();
			await UploadFile(file, setScannedAlbum).catch((error) => {
				showError(error.message);
			});
		}
		setIsUploading(false);
	};

	return (
		<>
			<div
				style={{
					display: "flex",
					justifyContent: "center",
					alignItems: "center",
					height: "50vh",
				}}
			>
				<Card className="max-w-[400px]">
					<CardHeader className="flex gap-3">
						<Input
							type={"file"}
							onChange={handleFileChange}
							accept={".png, .jpg"}
						/>
					</CardHeader>

					<Divider />
					<CardBody>
						{file && (
							<section>
								File details:
								<ul>
									<li>Name: {file.name}</li>
								</ul>
							</section>
						)}
					</CardBody>
					<Divider />
					<CardFooter>
						{file && (
							<Button onClick={handleUpload} className="submit">
								Upload a file
							</Button>
						)}
					</CardFooter>
				</Card>
			</div>
		</>
	);
};

export default Upload;
