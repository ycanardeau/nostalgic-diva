import React, {
	ReactElement,
	ReactNode,
	createContext,
	useCallback,
	useContext,
	useMemo,
	useRef,
} from 'react';

import { IPlayerController } from '../controllers';

interface NostalgicDivaContextProps extends IPlayerController {
	handleControllerChange: (value: IPlayerController | undefined) => void;
}

const NostalgicDivaContext = createContext<NostalgicDivaContextProps>(
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	undefined!,
);

interface NostalgicDivaProviderProps {
	children?: ReactNode;
}

export const NostalgicDivaProvider = ({
	children,
}: NostalgicDivaProviderProps): ReactElement => {
	const controllerRef = useRef<IPlayerController>();

	const handleControllerChange = useCallback(
		(value: IPlayerController | undefined) => {
			controllerRef.current = value;
		},
		[],
	);

	const loadVideo = useCallback(async (id: string) => {
		await controllerRef.current?.loadVideo(id);
	}, []);

	const play = useCallback(async () => {
		await controllerRef.current?.play();
	}, []);

	const pause = useCallback(async () => {
		await controllerRef.current?.pause();
	}, []);

	const setCurrentTime = useCallback(async (seconds: number) => {
		const controller = controllerRef.current;
		if (!controller) return;

		await controller.setCurrentTime(seconds);
		await controller.play();
	}, []);

	const setVolume = useCallback(async (volume: number) => {
		await controllerRef.current?.setVolume(volume);
	}, []);

	const setMuted = useCallback(async (muted: boolean) => {
		await controllerRef.current?.setMuted(muted);
	}, []);

	const setPlaybackRate = useCallback(async (playbackRate: number) => {
		await controllerRef.current?.setPlaybackRate(playbackRate);
	}, []);

	const getDuration = useCallback(async () => {
		return await controllerRef.current?.getDuration();
	}, []);

	const getCurrentTime = useCallback(async () => {
		return await controllerRef.current?.getCurrentTime();
	}, []);

	const getVolume = useCallback(async () => {
		return await controllerRef.current?.getVolume();
	}, []);

	const getPlaybackRate = useCallback(async () => {
		return await controllerRef.current?.getPlaybackRate();
	}, []);

	const value = useMemo(
		(): NostalgicDivaContextProps => ({
			handleControllerChange,
			loadVideo,
			play,
			pause,
			setCurrentTime,
			setVolume,
			setMuted,
			setPlaybackRate,
			getDuration,
			getCurrentTime,
			getVolume,
			getPlaybackRate,
		}),
		[
			handleControllerChange,
			loadVideo,
			play,
			pause,
			setCurrentTime,
			setVolume,
			setMuted,
			setPlaybackRate,
			getDuration,
			getCurrentTime,
			getVolume,
			getPlaybackRate,
		],
	);

	return (
		<NostalgicDivaContext.Provider value={value}>
			{children}
		</NostalgicDivaContext.Provider>
	);
};

export const useNostalgicDiva = (): NostalgicDivaContextProps => {
	return useContext(NostalgicDivaContext);
};
