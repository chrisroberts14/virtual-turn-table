import GetUsersBySearch from "@/api_calls/GetUsersBySearch";
import { useShare } from "@/contexts/ShareContext";
import type User from "@/interfaces/User";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { User as UserComp } from "@nextui-org/user";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";

const UserSelect = () => {
	const [users, setUsers] = useState<User[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const { shareInputValue, setShareInputValue } = useShare();
	const [value] = useDebounce(shareInputValue, 1000);

	useEffect(() => {
		setIsLoading(true);
		GetUsersBySearch(value)
			.then((data) => {
				setUsers(data);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [value]);

	return (
		<Autocomplete
			value={shareInputValue}
			label="Select a user"
			placeholder="Type to search..."
			isLoading={isLoading}
			onInputChange={(e) => setShareInputValue(e)}
			isDisabled={isLoading && shareInputValue.length === 0}
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
