import type Song from "@/interfaces/Song.tsx";

interface Album {
	title: string;
	artists: string[];
	image_url: string;
	album_uri: string;
	tracks_url: string;
	songs: Song[];
}

export default Album;
