import GetAllUsers from "@/api_calls/GetAllUsers.tsx";
import type User from "@/interfaces/User.tsx";
import { Autocomplete, AutocompleteItem } from "@nextui-org/autocomplete";
import { useEffect, useState } from "react";

const UserSelect = () => {
	const [users, setUsers] = useState<User[]>([]);

	useEffect(() => {
		// Get all users
		GetAllUsers().then((data) => {
			setUsers(data);
		});
	}, []);

	return (
		<Autocomplete label="Select a user" placeholder="Type to search...">
			{users.map((user) => (
				<AutocompleteItem key={user.username} value={user.username}>
					{user.username}
				</AutocompleteItem>
			))}
		</Autocomplete>
	);
};

export default UserSelect;
