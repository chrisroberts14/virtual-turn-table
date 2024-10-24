import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock useNavigation
vi.mock("../src/contexts/NavigationContext", () => ({
	useNavigation: vi.fn(),
}));

// Mock useError
vi.mock("../src/contexts/ErrorContext", () => ({
	useError: vi.fn(),
}));

// Mock useUsername
vi.mock("../src/contexts/UsernameContext", () => ({
	useUsername: vi.fn(),
}));

vi.mock("@/interfaces/StateData", () => ({
	getStateData: vi.fn(),
	clearStateData: vi.fn(),
}));

vi.mock("@/api_calls/GetUserInfo", () => vi.fn());
vi.mock("@/api_calls/CreateUser", () => vi.fn());
