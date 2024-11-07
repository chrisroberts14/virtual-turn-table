// Collection Interface

import type Album from "@/interfaces/Album.tsx";

interface Collection {
	user_id: string;
	albums: Album[];
}

export default Collection;
