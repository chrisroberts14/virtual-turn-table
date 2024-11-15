import { render, waitFor } from "@testing-library/react";
import { act } from "react";
import { vi } from "vitest";
import SoundWave from "../../src/components/SoundWave";

describe("SoundWave", () => {
	it("should render", () => {
		render(<SoundWave />);
	});

	it("should resize the number of bars when the window is resized", () => {
		const { container } = render(<SoundWave />);
		const bars = container.querySelectorAll(".bg-green-500");
		expect(bars.length).toBe(100);
		global.innerWidth = 640;
		act(() => {
			global.dispatchEvent(new Event("resize"));
		});
		expect(container.querySelectorAll(".bg-green-500").length).toBe(75);
		global.innerWidth = 639;
		act(() => {
			global.dispatchEvent(new Event("resize"));
		});
		expect(container.querySelectorAll(".bg-green-500").length).toBe(50);
	});

	it("should update the bars every 300ms", () => {
		vi.useFakeTimers();
		const { container } = render(<SoundWave />);
		const bars = container.querySelectorAll(".bg-green-500");
		const initialHeights = Array.from(bars);
		act(() => {
			vi.advanceTimersByTime(300);
		});
		waitFor(() => {
			const newBars = container.querySelectorAll(".bg-green-500");
			const newHeights = Array.from(newBars);
			expect(newHeights).not.toEqual(initialHeights);
		});
	});
});
