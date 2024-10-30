import Login from "@/components/Login.tsx";
import { Logo } from "@/components/Logo.tsx";
import UserBox from "@/components/UserBox.tsx";
import { useNavigation } from "@/contexts/NavigationContext.tsx";
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
} from "@nextui-org/navbar";
import { Tab, Tabs } from "@nextui-org/tabs";
import type { Key } from "@react-types/shared";
import { FaPlay } from "react-icons/fa";
import { IoScan } from "react-icons/io5";

const NavigationBar = () => {
	const { nextPage, setNextPage, isSignedIn } = useNavigation();

	const switchPage = (key: Key) => {
		setNextPage(key.toString());
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
				{isSignedIn && (
					<Tabs
						aria-label="Tab control"
						selectedKey={nextPage}
						onSelectionChange={switchPage}
					>
						<Tab
							key="play"
							title={
								<div className="flex items-center space-x-2">
									<FaPlay />
									<span> Play </span>
								</div>
							}
						/>
						<Tab
							key="scan"
							title={
								<div className="flex items-center space-x-2">
									<IoScan />
									<span> Scan </span>
								</div>
							}
						/>
					</Tabs>
				)}
			</NavbarContent>
			<NavbarContent justify="end">
				<NavbarItem>{isSignedIn ? <UserBox /> : <Login />}</NavbarItem>
			</NavbarContent>
		</Navbar>
	);
};

export default NavigationBar;
