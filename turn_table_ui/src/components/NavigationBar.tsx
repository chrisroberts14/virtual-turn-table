import Login from "@/components/Login.tsx";
import { Logo } from "@/components/Logo.tsx";
import UserBox from "@/components/UserBox.tsx";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/navbar";
import { Tab, Tabs } from "@nextui-org/tabs";
import type { Dispatch, SetStateAction } from "react";

const NavigationBar = (props: {
	isSignedIn: boolean;
	currentPage: string;
	setNextPage: Dispatch<SetStateAction<string>>;
	disableTabChange: boolean;
}) => {
	const switchPage = (key: string) => {
		props.setNextPage(key);
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
				<Tabs
					aria-label="Tab control"
					selectedKey={props.currentPage}
					onSelectionChange={switchPage}
				>
					<Tab key="play" title="Play" />
					<Tab key="scan" title="Scan" />
				</Tabs>
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>{props.isSignedIn ? <UserBox /> : <Login />}</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};

export default NavigationBar;
