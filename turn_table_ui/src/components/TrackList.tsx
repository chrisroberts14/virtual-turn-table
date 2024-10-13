import {Select, SelectItem} from "@nextui-org/select";
import Song from "@/interfaces/Song.tsx";
import {Dispatch, SetStateAction} from "react";

const TrackList = (props : {songs: Song[], setCurrentSong: Dispatch<SetStateAction<Song | null>>}) => {
    return (
        <Select
        label="Select song"
        className="max-w-xs">
            {props.songs.map((song) => (
                <SelectItem key={song.title} onClick={() => props.setCurrentSong(song)}>
                    {song.title}
                </SelectItem>
            ))}
        </Select>
    );
}

export default TrackList;
