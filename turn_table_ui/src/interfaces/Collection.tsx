// Collection Interface

import type Album from "@/interfaces/Album.tsx";

export interface Collection {
	user_id: string;
	albums: Album[];
}

export default Collection;
