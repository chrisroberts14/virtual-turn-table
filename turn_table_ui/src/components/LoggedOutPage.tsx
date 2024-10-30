import SoundWave from "@/components/SoundWave.tsx";
import SpinningVinyl from "@/components/SpinningVinyl.tsx";
import { MusicContext } from "@/contexts/MusicContext.tsx";
import { SongControlContext } from "@/contexts/SongControlContext.tsx";

const LoggedOutPage = () => {
	// Weird braces are to ignore errors which are not relevant to this
	return (
		<div className="flex bg-gray-900 h-fit">
			<div className="min-w-[15%] text-center content-center pb-52">SCAN</div>
			<div className="flex flex-col w-[70%] pt-5">
				<SoundWave />
				<div className="flex h-screen w-full justify-center pt-2">
					<div className="flex pb-52 w-full justify-center">
						{
							// @ts-ignore
							<SongControlContext.Provider value={{ isPaused: false }}>
								{
									// @ts-ignore
									<MusicContext.Provider value={{ currentAlbum: null }}>
										<SpinningVinyl />
									</MusicContext.Provider>
								}
							</SongControlContext.Provider>
						}
					</div>
				</div>
			</div>
			<div className="min-w-[15%] text-center content-center pb-52">PLAY</div>
		</div>
	);
};

export default LoggedOutPage;
