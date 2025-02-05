import { Button } from "@heroui/button";

const Login = () => {
	const handleLogin = () => {
		const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
		const redirectUri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
		const scope = "streaming user-read-email user-read-private";

		window.location.href = `https://accounts.spotify.com/authorize?response_type=token&client_id=${encodeURIComponent(clientId)}&scope=${encodeURIComponent(scope)}&redirect_uri=${encodeURIComponent(redirectUri)}`;
	};

	return <Button onPress={handleLogin}>Login</Button>;
};

export default Login;
