import type Album from "@/interfaces/Album.tsx";
import {
	type Dispatch,
	type SetStateAction,
	createContext,
	useContext,
} from "react";

// Context used for uploading images to the backend

interface UploadContextType {
	isUploading: boolean;
	setIsUploading: Dispatch<SetStateAction<boolean>>;
	scannedAlbum: Album | null;
	setScannedAlbum: Dispatch<SetStateAction<Album | null>>;
	fadeConfirm: boolean;
	setFadeConfirm: Dispatch<SetStateAction<boolean>>;
	currentImage: string | null;
	setCurrentImage: Dispatch<SetStateAction<string | null>>;
	top10: Album[];
	setTop10: Dispatch<SetStateAction<Album[]>>;
}

export const UploadContext = createContext<UploadContextType | undefined>(
	undefined,
);
export const useUpload = () => {
	const context = useContext(UploadContext);
	if (context === undefined) {
		throw new Error("useUpload must be used within an UploadProvider");
	}
	return context;
};
