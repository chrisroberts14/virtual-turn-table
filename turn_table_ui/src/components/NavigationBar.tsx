import {Navbar, NavbarBrand, NavbarItem} from "@nextui-org/navbar";
import {Logo} from "@/components/Logo.tsx";
import Login from "@/components/Login.tsx";
import UserBox from "@/components/UserBox.tsx";

const NavigationBar = (props: {isSignedIn: boolean}) => {
    return (
        <Navbar
                style={{
                    backgroundColor: '#383838',
                    borderBottom: '2px solid #000',
                }}>
                <NavbarBrand>
                    <Logo/>
                    <p className="font-bold text-inherit" style={{padding: 10}}>Virtual Turn Table</p>
                </NavbarBrand>
                <NavbarItem>
                    {!props.isSignedIn ? <Login/> : <UserBox/>}
                </NavbarItem>
            </Navbar>
    )
}

export default NavigationBar;
