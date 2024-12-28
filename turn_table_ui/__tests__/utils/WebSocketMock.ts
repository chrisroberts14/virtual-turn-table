import { vi } from "vitest";

class WebSocketMock {
	private url: string;
	private readyState: number;
	public onopen: () => void;
	public onmessage: (event: { data: string }) => void;
	public onerror: () => void;
	public onclose: () => void;

	constructor(url: string) {
		this.url = url;
		this.readyState = 1; // Open
		this.onopen = vi.fn();
		this.onmessage = vi.fn();
		this.onerror = vi.fn();
		this.onclose = vi.fn();
	}

	send(data: string) {
		// You can add functionality to handle data sent to the mock
		this.onmessage({ data });
	}

	close() {
		this.readyState = 3; // Closed
		this.onclose();
	}
}

export default WebSocketMock;
