import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Login from "../../src/components/Login";

describe("Login", () => {
	it("should redirect", async () => {
		const originalLocation = window.location;
		// @ts-ignore
		window.location = { href: "" };

		render(<Login />);
		await userEvent.click(screen.getByText("Login"));
		expect(window.location.href).not.toEqual("https://localhost:3000/");
		window.location = originalLocation;
	});
});
