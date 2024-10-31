import PlayingAlbum from "@/components/PlayingAlbum.tsx";
import SongControls from "@/components/SongControls.tsx";
import SongList from "@/components/SongList.tsx";
import SpinningVinyl from "@/components/SpinningVinyl.tsx";
import VolumeScrubber from "@/components/VolumeScrubber.tsx";
import { useMusic } from "@/contexts/MusicContext.tsx";
import { SongControlContext } from "@/contexts/SongControlContext.tsx";
import useMusicPlayer from "@/hooks/UseMusicPlayer.tsx";
import useResizeHandler from "@/hooks/UseResizeHandler.tsx";
import { Resizable } from "re-resizable";

const MusicPlayer = () => {
	const contentHeight = useResizeHandler(240);
	const { currentAlbum } = useMusic();
	const {
		isPaused,
		setIsPaused,
		currentSong,
		setCurrentSong,
		deviceId,
		setDeviceId,
		player,
		setPlayer,
		trackPosition,
		setTrackPosition,
		trackDuration,
		setTrackDuration,
		nextSong,
		setNextSong,
		isPlayerReady,
		setIsPlayerReady,
	} = useMusicPlayer();

	return (
		<div className="flex flex-col h-full">
			<SongControlContext.Provider
				value={{
					isPaused,
					setIsPaused,
					currentSong,
					setCurrentSong,
					deviceId,
					setDeviceId,
					player,
					setPlayer,
					trackPosition,
					setTrackPosition,
					trackDuration,
					setTrackDuration,
					nextSong,
					setNextSong,
					isPlayerReady,
					setIsPlayerReady,
				}}
			>
				<Resizable
					defaultSize={{ width: "100%", height: contentHeight }}
					maxHeight={contentHeight}
					minHeight={contentHeight}
					enable={{
						top: false,
						right: false,
						bottom: false,
						left: false,
						topRight: false,
						bottomRight: false,
						bottomLeft: false,
						topLeft: false,
					}}
				>
					<div className="flex flex-row h-full">
						<div className="animate-slideRight overflow-y-auto overflow-x-hidden max-w-full md:max-w-[50%] bg-content1">
							{currentAlbum ? (
								<Resizable
									enable={{
										top: false,
										right: true,
										bottom: false,
										left: false,
										topRight: false,
										bottomRight: false,
										bottomLeft: false,
										topLeft: false,
									}}
									maxHeight={contentHeight}
								>
									<div className="overflow-y-auto h-full max-w-full">
										<SongList />
									</div>
								</Resizable>
							) : null}
						</div>
						<div className="flex sm:p-10 bg-gray-700 justify-center flex-grow z-0 sm:visible">
							<SpinningVinyl />
						</div>
					</div>
				</Resizable>
				<div className="flex-grow bg-gray-900 flex justify-center pt-2 pl-2 w-screen h-full z-10">
					<div
						className="flex flex-row justify-center w-screen"
						title="Song Details"
					>
						<div className="hidden sm:block">
							<PlayingAlbum />
						</div>
						<div className="flex-grow">
							<SongControls />
						</div>
						<div>
							<VolumeScrubber />
						</div>
					</div>
				</div>
			</SongControlContext.Provider>
		</div>
	);
};

export default MusicPlayer;
