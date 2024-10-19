import type Album from "@/interfaces/Album.tsx";
import { Button } from "@nextui-org/button";
import { Card, CardBody, CardFooter, CardHeader } from "@nextui-org/card";
import { Divider } from "@nextui-org/divider";
import { Input } from "@nextui-org/input";
import axios from "axios";
import type React from "react";
import { type Dispatch, type SetStateAction, useState } from "react";

const Upload: React.FC<{
	setScannedAlbum: Dispatch<SetStateAction<Album | null>>;
	setIsUploading: Dispatch<SetStateAction<boolean>>;
	triggerConfirmSlide: () => void;
}> = ({ setScannedAlbum, setIsUploading, triggerConfirmSlide }) => {
	const [file, setFile] = useState<File | null>(null);

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
		const convertToBase64 = (file: File) => {
			return new Promise((resolve, reject) => {
				const reader = new FileReader();
				reader.readAsDataURL(file);
				reader.onload = () => resolve(reader.result);
				reader.onerror = (error) => reject(error);
			});
		};

		if (file) {
			setIsUploading(true);
			triggerConfirmSlide();
			const base64 = await convertToBase64(file);
			await axios
				.post(
					`${import.meta.env.VITE_BFF_ADDRESS}image_to_album/`,
					{ image: base64 },
					{
						headers: {
							"Content-Type": "application/json",
						},
					},
				)
				.then((response) => {
					const newAlbum: Album = response.data;
					setScannedAlbum(newAlbum);
				})
				.catch((error) => {
					console.log(error);
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
