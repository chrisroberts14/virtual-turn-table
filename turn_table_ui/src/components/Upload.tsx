import UploadFile from "@/api_calls/UploadFile.tsx";
import { useError } from "@/contexts/ErrorContext.tsx";
import { useUpload } from "@/contexts/UploadContext.tsx";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import type React from "react";
import { useState } from "react";

const Upload: React.FC<{ triggerConfirmSlide: () => void }> = ({
	triggerConfirmSlide,
}) => {
	const [file, setFile] = useState<File | null>(null);
	const { showError } = useError();
	const { setIsUploading, setScannedAlbum, isUploading } = useUpload();

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
							onChange={(e) => {
								if (e.target.files) {
									setFile(e.target.files[0]);
								}
							}}
							accept={".png, .jpg"}
							title={"Upload file input"}
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
							<Button
								onClick={handleUpload}
								className="submit"
								isDisabled={isUploading}
							>
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
