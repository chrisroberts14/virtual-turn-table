import GetUsersBySearch from "@/api_calls/GetUsersBySearch.tsx";
import { useSpotifyToken } from "@/contexts/SpotifyTokenContext.tsx";
import type User from "@/interfaces/User.tsx";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { User as UserComp } from "@nextui-org/user";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const UserSelect = () => {
	const [users, setUsers] = useState<User[]>([]);
	const { token } = useSpotifyToken();
	const [isLoading, setIsLoading] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const [value] = useDebounce(inputValue, 1000);

	useEffect(() => {
		if (!token) {
			return;
		}
		setIsLoading(true);
		GetUsersBySearch(value, token)
			.then((data) => {
				setUsers(data);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [value, token]);

	return (
		<Autocomplete
			value={inputValue}
			label="Select a user"
			placeholder="Type to search..."
			isLoading={isLoading}
			onInputChange={(e) => setInputValue(e)}
		>
			{users.map((user) => (
				<AutocompleteItem key={user.username} textValue={user.username}>
					<UserComp
						name={user.username}
						avatarProps={{
							src: user.image_url,
						}}
						isFocusable={false}
					/>
				</AutocompleteItem>
			))}
		</Autocomplete>
	);
};

export default UserSelect;
