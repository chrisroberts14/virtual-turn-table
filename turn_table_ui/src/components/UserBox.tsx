import {User} from "@nextui-org/user";
import {useEffect} from "react";

const UserBox = () => {

    useEffect(() => {
        // Make call to BFF to retrieve the items of data we want
        }
    )

    return (
        <User
            name="Jane Doe"
            description="Product Designer"
            avatarProps={{
                src: "https://i.pravatar.cc/150?u=a04258114e29026702d"
            }}
        />
    );
}

export default UserBox;
