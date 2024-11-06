import { Resizable } from "re-resizable";
// import {useState} from "react";

const SocialPage = () => {
	// const [publicCollections, setPublicCollections] = useState([]);
	// const [sharedCollections, setSharedCollections] = useState([]);

	return (
		<div className="flex h-screen w-screen bg-gray-700">
			<Resizable
				className="min-h-screen text-left p-2"
				minWidth="20%"
				maxWidth="80%"
			>
				<span className="font-bold text-xl">Public Collections</span>
				<div className="w-full h-full">
					{/* Add a list of public collections here */}
				</div>
			</Resizable>
			<div className="min-h-screen text-right flex-grow p-2 border-l-1 border-black">
				<span className="font-bold text-xl">Shared With You</span>
				<div className="w-full h-full">
					{/* Add a list of collections shared with the user here here */}
				</div>
			</div>
		</div>
	);
};

export default SocialPage;
