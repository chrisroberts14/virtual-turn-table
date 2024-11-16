import SoundWave from "@/components/SoundWave.tsx";
import SpeakerWaves from "@/components/SpeakerWaves.tsx";
import SpinningVinyl from "@/components/SpinningVinyl.tsx";
import { MusicContext } from "@/contexts/MusicContext.tsx";
import { SongControlContext } from "@/contexts/SongControlContext.tsx";

const LoggedOutPage = () => {
	// Weird braces are to ignore errors which are not relevant to this
	return (
		<div className="flex bg-gray-900 h-fit flex-col">
			<div className="flex w-fill h-[9%]">
				<div className="min-w-[20%] text-center content-center">
					<header className="text-white font-extrabold text-2xl">
						Scan your albums
					</header>
				</div>
				<SoundWave />
				<div className="min-w-[20%] text-center content-center">
					<span className="text-white font-extrabold text-2xl">
						Play them instantly!
					</span>
				</div>
			</div>

			<div className="flex flex-col w-fill pt-5">
				<div className="flex h-screen w-full justify-center pt-2">
					<div className="flex pb-48 w-full justify-center align-middle">
						<div className="min-w-[20%] content-center">
							<SpeakerWaves rotation={180} />
						</div>
						<div className="w-[60%] content-center justify-items-center">
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
						<div className="min-w-[20%] content-center">
							<SpeakerWaves rotation={0} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoggedOutPage;
