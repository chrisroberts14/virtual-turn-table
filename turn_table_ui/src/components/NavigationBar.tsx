import Login from "@/components/Login.tsx";
import { Logo } from "@/components/Logo.tsx";
import UserBox from "@/components/UserBox.tsx";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/navbar";
import type { Dispatch, SetStateAction } from "react";

const NavigationBar = (props: {
	isSignedIn: boolean;
	currentPage: string;
	setCurrentPage: Dispatch<SetStateAction<string>>;
	disableTabChange: boolean;
}) => {
	const isPlayPageActive = () => {
		return props.currentPage === "play";
	};

	return (
		<Navbar className="bg-default-100">
			<NavbarBrand>
				<Logo />
				<p className="font-bold text-inherit" style={{ padding: 10 }}>
					Virtual Turn Table
				</p>
			</NavbarBrand>
			<NavbarContent className="hidden sm:flex gap-4 flex-[2]" justify="center">
				<NavbarItem
					onClick={() => props.setCurrentPage("play")}
					isActive={isPlayPageActive()}
				>
					Play
				</NavbarItem>
				<NavbarItem
					onClick={() => props.setCurrentPage("scan")}
					isActive={!isPlayPageActive()}
				>
					Scan
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>{props.isSignedIn ? <UserBox /> : <Login />}</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};

export default NavigationBar;
