import { render, screen, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import ImageCapture from "../../src/components/ImageCapture";
import { useError } from "../../src/contexts/ErrorContext";
import { useUpload } from "../../src/contexts/UploadContext";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { act } from "react";
import ImageToAlbum from "../../src/api_calls/ImageToAlbum";
import { useNavigation } from "../../src/contexts/NavigationContext";
import type Album from "../../src/interfaces/Album";
import GetScreenShot from "../../src/utils/GetScreenShot";

vi.mock("../../src/contexts/UploadContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/utils/GetScreenShot");
vi.mock("../../src/api_calls/ImageToAlbum");
vi.mock("../../src/contexts/NavigationContext");

const scannedAlbum = null;
const setScannedAlbum = vi.fn();
const isUploading = false;
const setIsUploading = vi.fn();
const fadeConfirm = false;
const setFadeConfirm = vi.fn();
const currentImage = "";
const setCurrentImage = vi.fn();
const album: Album = {
	title: "title",
	artists: ["artist"],
	image_url: "image_url",
	album_uri: "album_uri",
	tracks_url: "tracks_url",
	songs: [],
} as Album;

const swapToCamera = async () => {
	await waitFor(() => {
		expect(screen.getByTitle("Swap to camera")).toBeInTheDocument();
	});

	act(() => {
		userEvent.click(screen.getByTitle("Swap to camera"));
	});
	await waitFor(() => {
		expect(screen.getByTitle("Webcam")).toBeInTheDocument();
	});
};

describe("ImageCapture upload", () => {
	beforeEach(() => {
		// @ts-ignore
		(useUpload as vi.mock).mockReturnValue({
			scannedAlbum,
			setScannedAlbum,
			isUploading,
			setIsUploading,
			fadeConfirm,
			setFadeConfirm,
			currentImage,
			setCurrentImage,
		});

		// @ts-ignore
		(useNavigation as vi.mock).mockReturnValue({
			isSignedIn: true,
			setIsSignedIn: vi.fn(),
			currentPage: 1,
			setCurrentPage: vi.fn(),
		});

		// @ts-ignore
		(useError as vi.mock).mockReturnValue({
			showError: vi.fn(),
		});

		// Define navigator.mediaDevices if it's not already defined
		if (!navigator.mediaDevices) {
			Object.defineProperty(navigator, "mediaDevices", {
				value: {},
				writable: true,
			});
		}

		// Mock the enumerateDevices method
		navigator.mediaDevices.enumerateDevices = vi.fn().mockResolvedValue([]);
	});

	it("should render when no cameras are found", () => {
		render(<ImageCapture />);
		expect(screen.getByTitle("Detecting cameras...")).toBeInTheDocument();
	});
});

describe("ImageCapture camera", () => {
	beforeEach(() => {
		// @ts-ignore
		(useUpload as vi.mock).mockReturnValue({
			scannedAlbum,
			setScannedAlbum,
			isUploading,
			setIsUploading,
			fadeConfirm,
			setFadeConfirm,
			currentImage,
			setCurrentImage,
		});

		// @ts-ignore
		(useNavigation as vi.mock).mockReturnValue({
			isSignedIn: true,
			setIsSignedIn: vi.fn(),
			currentPage: 1,
			setCurrentPage: vi.fn(),
		});

		// @ts-ignore
		(useError as vi.mock).mockReturnValue({
			showError: vi.fn(),
		});

		// Define navigator.mediaDevices if it's not already defined
		if (!navigator.mediaDevices) {
			Object.defineProperty(navigator, "mediaDevices", {
				value: {},
				writable: true,
			});
		}

		navigator.mediaDevices.enumerateDevices = vi
			.fn()
			.mockResolvedValue([{ kind: "videoinput" }]);

		// @ts-ignore
		(GetScreenShot as vi.mock).mockReturnValue("image");

		// @ts-ignore
		(ImageToAlbum as vi.mock).mockReturnValue(Promise.resolve(album));
	});

	it("should render when cameras are found", async () => {
		render(<ImageCapture />);
		await swapToCamera();
	});

	it("should get album when capture is done", async () => {
		render(<ImageCapture />);

		await swapToCamera();

		act(() => {
			userEvent.click(screen.getByText("Capture"));
		});
		await waitFor(() => {
			expect(setIsUploading).toHaveBeenCalledWith(true);
			expect(setFadeConfirm).toHaveBeenCalledWith(true);
			expect(setCurrentImage).toHaveBeenCalledWith("image");
			expect(setScannedAlbum).toHaveBeenCalledWith(album);
		});
	});

	it("should render with image", async () => {
		// @ts-ignore
		(useUpload as vi.mock).mockReturnValue({
			scannedAlbum,
			setScannedAlbum,
			isUploading,
			setIsUploading,
			fadeConfirm,
			setFadeConfirm,
			currentImage: "image",
			setCurrentImage,
		});

		render(<ImageCapture />);
		await swapToCamera();
		await waitFor(() => {
			expect(screen.getByAltText("Captured Image")).toBeInTheDocument();
		});
	});

	it("should show an error if the screenshot fails", async () => {
		// @ts-ignore
		(GetScreenShot as vi.mock).mockReturnValue(undefined);

		render(<ImageCapture />);
		await swapToCamera();

		act(() => {
			userEvent.click(screen.getByText("Capture"));
		});
		await waitFor(() => {
			expect(setIsUploading).toHaveBeenCalledWith(true);
			expect(setFadeConfirm).toHaveBeenCalledWith(true);
			expect(useError().showError).toHaveBeenCalledWith(
				"Failed to capture image",
			);
		});
	});

	it("should show an error if the image to album call fails", async () => {
		// @ts-ignore
		(ImageToAlbum as vi.mock).mockImplementation(() =>
			Promise.reject(new Error("test_error")),
		);

		render(<ImageCapture />);
		await swapToCamera();

		await userEvent.click(screen.getByText("Capture"));

		await waitFor(async () => {
			expect(useError().showError).toHaveBeenCalledWith("test_error");
			expect(useError().showError).toHaveBeenCalledTimes(1);
		});
	});
});
