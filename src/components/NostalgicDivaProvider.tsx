import { nullPlayerController } from '@/controllers/NullPlayerController';
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
	handleControllerChange: (value: IPlayerController) => void;
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
	const controllerRef = useRef<IPlayerController>(nullPlayerController);

	const handleControllerChange = useCallback(
		(value: IPlayerController): void => {
			controllerRef.current = value;
		},
		[],
	);

	const loadVideo = useCallback(async (id: string): Promise<void> => {
		await controllerRef.current.loadVideo(id);
	}, []);

	const play = useCallback(async (): Promise<void> => {
		await controllerRef.current.play();
	}, []);

	const pause = useCallback(async (): Promise<void> => {
		await controllerRef.current.pause();
	}, []);

	const setCurrentTime = useCallback(
		async (seconds: number): Promise<void> => {
			await controllerRef.current.setCurrentTime(seconds);
			await controllerRef.current.play();
		},
		[],
	);

	const setVolume = useCallback(async (volume: number): Promise<void> => {
		await controllerRef.current.setVolume(volume);
	}, []);

	const setMuted = useCallback(async (muted: boolean): Promise<void> => {
		await controllerRef.current.setMuted(muted);
	}, []);

	const setPlaybackRate = useCallback(
		async (playbackRate: number): Promise<void> => {
			await controllerRef.current.setPlaybackRate(playbackRate);
		},
		[],
	);

	const getDuration = useCallback(async (): Promise<number | undefined> => {
		return await controllerRef.current.getDuration();
	}, []);

	const getCurrentTime = useCallback(async (): Promise<
		number | undefined
	> => {
		return await controllerRef.current.getCurrentTime();
	}, []);

	const getVolume = useCallback(async (): Promise<number | undefined> => {
		return await controllerRef.current.getVolume();
	}, []);

	const getPlaybackRate = useCallback(async (): Promise<
		number | undefined
	> => {
		return await controllerRef.current.getPlaybackRate();
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
