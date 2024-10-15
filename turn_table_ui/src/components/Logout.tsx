import { Button } from "@nextui-org/button";

const Logout = () => {
	const handleLogout = () => {
		localStorage.removeItem("spotify_access_token");
		localStorage.removeItem("spotify_login_time");
		localStorage.removeItem("spotify_session_length");
		window.location.href = "/";
	};

	return <Button onClick={handleLogout}>Logout</Button>;
};

export default Logout;
