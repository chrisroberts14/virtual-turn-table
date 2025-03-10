import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import UploadFile from "../../src/api_calls/UploadFile";
import Upload from "../../src/components/Upload";
import { useError } from "../../src/contexts/ErrorContext";
import { useUpload } from "../../src/contexts/UploadContext";

vi.mock("../../src/contexts/UploadContext");
vi.mock("../../src/contexts/ErrorContext");
vi.mock("../../src/api_calls/UploadFile");

const mockFile = new File([""], "test.png", { type: "image/png" });

describe("Upload", () => {
	const mockShowError = vi.fn();

	beforeEach(() => {
		// @ts-ignore
		useUpload.mockReturnValue({
			setIsUploading: vi.fn(),
			setScannedAlbum: vi.fn(),
			isUploading: false,
		});
		// @ts-ignore
		useError.mockReturnValue({ showError: mockShowError });
		// @ts-ignore
		UploadFile.mockReturnValue(Promise.resolve());

		// @ts-ignore
		global.URL.createObjectURL = vi.fn(() => "mocked_url");
	});

	it("should render", () => {
		render(<Upload triggerConfirmSlide={vi.fn()} />);
	});

	it("should correctly upload a file", async () => {
		const triggerConfirmSlide = vi.fn();
		render(
			<Upload
				triggerConfirmSlide={triggerConfirmSlide}
				setTop10={() => {
					return;
				}}
			/>,
		);
		const fileSelector = screen.getByTitle("Upload file input");
		await userEvent.upload(fileSelector, mockFile);
		const uploadButton = screen.getByText("Upload a file");
		await userEvent.click(uploadButton);

		await waitFor(() => {
			expect(triggerConfirmSlide).toHaveBeenCalled();
			expect(UploadFile).toHaveBeenCalledWith(
				mockFile,
				expect.any(Function),
				expect.any(Function),
			);
		});
	});

	it("should show an error if the upload fails", async () => {
		// @ts-ignore
		(UploadFile as vi.mock).mockRejectedValue(new Error("Upload failed"));
		render(
			<Upload
				triggerConfirmSlide={vi.fn()}
				setTop10={() => {
					return;
				}}
			/>,
		);
		const fileSelector = screen.getByTitle("Upload file input");
		await userEvent.upload(fileSelector, mockFile);
		const uploadButton = screen.getByText("Upload a file");
		await userEvent.click(uploadButton);

		await waitFor(() => {
			expect(mockShowError).toHaveBeenCalledWith("Upload failed");
		});
	});
});
