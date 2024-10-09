import {Button} from "@nextui-org/button";

const Login = () => {
    const handleLogin = () => {
        const client_id = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
        const redirect_uri = import.meta.env.VITE_SPOTIFY_REDIRECT_URI;
        const scope = "streaming user-read-email user-read-private";

        // @ts-ignore
        window.location = 'https://accounts.spotify.com/authorize' +
            `?response_type=token` +
            `&client_id=${encodeURIComponent(client_id)}` +
            `&scope=${encodeURIComponent(scope)}` +
            `&redirect_uri=${encodeURIComponent(redirect_uri)}`;
    }

    return (
        <Button onClick={handleLogin}>Login</Button>
    );
}

export default Login;
