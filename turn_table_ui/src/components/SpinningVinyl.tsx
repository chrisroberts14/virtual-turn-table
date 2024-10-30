import { useMusic } from "@/contexts/MusicContext.tsx";
import { useSongControl } from "@/contexts/SongControlContext.tsx";
import { Image } from "@nextui-org/image";
import { useEffect, useState } from "react";

const SpinningVinyl = () => {
	const { currentAlbum } = useMusic();
	const { isPaused } = useSongControl();
	const [isAlbumCoverOffScreen, setIsAlbumCoverOffScreen] = useState(false);

	useEffect(() => {
		setIsAlbumCoverOffScreen(false);
		setTimeout(() => {
			setIsAlbumCoverOffScreen(true);
		}, 2000);
	}, []);

	return (
		<div className="relative w-[70%]">
			<svg
				className="z-0 h-full w-full absolute"
				role="img"
				aria-label="turntable"
			>
				<rect height="100%" width="100%" fill="#D0AC81" rx="20" ry="20" />
			</svg>
			{currentAlbum && (
				<div
					className={`z-20 flex h-full w-full absolute p-10 transition-transform ${isAlbumCoverOffScreen ? "-translate-x-[150%] duration-2000" : "translate-x-0"}`}
				>
					<div className="w-1/5 h-full z-10" />
					<Image
						className="z-20 w-[100%] h-[100%]"
						src={currentAlbum.image_url}
					/>
					<div className="w-1/5 h-full z-10" />
				</div>
			)}
			<svg
				className={
					!isPaused
						? "animate-spin max-h-full p-10 z-10 absolute"
						: "max-h-full p-10 z-10 absolute"
				}
				version="1.1"
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 600 600"
				width="100%"
				height="100%"
			>
				<title>Vinyl</title>
				<g>
					<path
						d="M0 0 C0.90045044 -0.00705963 1.80090088 -0.01411926 2.7286377 -0.02139282 C40.56271231 -0.2507174 40.56271231 -0.2507174 57.20703125 3.203125 C58.69759033 3.50911621 58.69759033 3.50911621 60.21826172 3.82128906 C93.34260524 10.82649885 126.65591416 23.11605557 154.20703125 43.203125 C154.80789551 43.63705566 155.40875977 44.07098633 156.02783203 44.51806641 C175.05950202 58.3081032 192.76520412 73.55571085 207.20703125 92.203125 C208.38652344 93.67458984 208.38652344 93.67458984 209.58984375 95.17578125 C241.21204339 134.89711061 262.14141989 186.83410271 262.41015625 237.99609375 C262.41721588 238.89654419 262.42427551 239.79699463 262.43154907 240.72473145 C262.66087365 278.55880606 262.66087365 278.55880606 259.20703125 295.203125 C258.90104004 296.69368408 258.90104004 296.69368408 258.58886719 298.21435547 C251.5836574 331.33869899 239.29410068 364.65200791 219.20703125 392.203125 C218.77310059 392.80398926 218.33916992 393.40485352 217.89208984 394.02392578 C204.10205305 413.05559577 188.8544454 430.76129787 170.20703125 445.203125 C169.22605469 445.98945313 168.24507813 446.77578125 167.234375 447.5859375 C127.51304564 479.20813714 75.57605354 500.13751364 24.4140625 500.40625 C23.06338684 500.41683945 23.06338684 500.41683945 21.6854248 500.42764282 C-16.14864981 500.6569674 -16.14864981 500.6569674 -32.79296875 497.203125 C-34.28352783 496.89713379 -34.28352783 496.89713379 -35.80419922 496.58496094 C-68.92854274 489.57975115 -102.24185166 477.29019443 -129.79296875 457.203125 C-130.39383301 456.76919434 -130.99469727 456.33526367 -131.61376953 455.88818359 C-150.64543952 442.0981468 -168.35114162 426.85053915 -182.79296875 408.203125 C-183.57929688 407.22214844 -184.365625 406.24117188 -185.17578125 405.23046875 C-216.79798089 365.50913939 -237.72735739 313.57214729 -237.99609375 262.41015625 C-238.00315338 261.50970581 -238.01021301 260.60925537 -238.01748657 259.68151855 C-238.24681115 221.84744394 -238.24681115 221.84744394 -234.79296875 205.203125 C-234.48697754 203.71256592 -234.48697754 203.71256592 -234.17480469 202.19189453 C-227.1695949 169.06755101 -214.88003818 135.75424209 -194.79296875 108.203125 C-194.35903809 107.60226074 -193.92510742 107.00139648 -193.47802734 106.38232422 C-179.68799055 87.35065423 -164.4403829 69.64495213 -145.79296875 55.203125 C-144.81199219 54.41679688 -143.83101563 53.63046875 -142.8203125 52.8203125 C-103.09898314 21.19811286 -51.16199104 0.26873636 0 0 Z "
						fill="#000000"
						transform="translate(287.79296875, 50.203125)"
					/>
				</g>
				{currentAlbum ? (
					<g>
						<clipPath id="pathClip">
							<path
								d="M0 0 C12.93086842 9.99291327 22.35007238 22.71035078 28.0625 38.0625 C28.6503125 39.61517578 28.6503125 39.61517578 29.25 41.19921875 C35.70350991 61.20958106 33.45029073 83.6570544 24.3125 102.375 C12.73971443 124.78780832 -4.72042947 137.73218152 -27.96484375 146.16015625 C-48.91988791 152.2075851 -71.37802445 148.32810181 -90.20703125 138.19921875 C-111.08203533 126.49584118 -124.22120178 108.07542162 -130.8125 85.25 C-135.69253074 61.43428113 -130.76032661 39.20397884 -117.95703125 18.92578125 C-107.91435419 4.55332725 -94.37608958 -5.82081551 -77.9375 -11.9375 C-76.90238281 -12.329375 -75.86726563 -12.72125 -74.80078125 -13.125 C-48.97079174 -21.45538855 -21.7852625 -15.20113721 0 0 Z "
								fill="#FDFDFD"
								transform="translate(349.9375,233.9375)"
							/>
						</clipPath>
						<image
							href={currentAlbum?.image_url}
							height={200}
							width={200}
							x="200"
							y="200"
							clipPath="url(#pathClip)"
							preserveAspectRatio="xMidYMid slice"
						/>
					</g>
				) : (
					<g>
						<path
							d="M0 0 C12.93086842 9.99291327 22.35007238 22.71035078 28.0625 38.0625 C28.6503125 39.61517578 28.6503125 39.61517578 29.25 41.19921875 C35.70350991 61.20958106 33.45029073 83.6570544 24.3125 102.375 C12.73971443 124.78780832 -4.72042947 137.73218152 -27.96484375 146.16015625 C-48.91988791 152.2075851 -71.37802445 148.32810181 -90.20703125 138.19921875 C-111.08203533 126.49584118 -124.22120178 108.07542162 -130.8125 85.25 C-135.69253074 61.43428113 -130.76032661 39.20397884 -117.95703125 18.92578125 C-107.91435419 4.55332725 -94.37608958 -5.82081551 -77.9375 -11.9375 C-76.90238281 -12.329375 -75.86726563 -12.72125 -74.80078125 -13.125 C-48.97079174 -21.45538855 -21.7852625 -15.20113721 0 0 Z "
							fill="#FDFDFD"
							transform="translate(349.9375,233.9375)"
						/>
					</g>
				)}
			</svg>
		</div>
	);
};

export default SpinningVinyl;
