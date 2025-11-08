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
import { nullPlayerController } from '@/controllers/NullPlayerController';

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

	const controller = controllerRef.current;

	const loadVideo = useCallback(
		async (id: string): Promise<void> => {
			await controller.loadVideo(id);
		},
		[controller],
	);

	const play = useCallback(async (): Promise<void> => {
		await controller.play();
	}, [controller]);

	const pause = useCallback(async (): Promise<void> => {
		await controller.pause();
	}, [controller]);

	const setCurrentTime = useCallback(
		async (seconds: number): Promise<void> => {
			await controller.setCurrentTime(seconds);
			await controller.play();
		},
		[controller],
	);

	const setVolume = useCallback(
		async (volume: number): Promise<void> => {
			await controller.setVolume(volume);
		},
		[controller],
	);

	const setMuted = useCallback(
		async (muted: boolean): Promise<void> => {
			await controller.setMuted(muted);
		},
		[controller],
	);

	const setPlaybackRate = useCallback(
		async (playbackRate: number): Promise<void> => {
			await controller.setPlaybackRate(playbackRate);
		},
		[controller],
	);

	const getDuration = useCallback(async (): Promise<number | undefined> => {
		return await controller.getDuration();
	}, [controller]);

	const getCurrentTime = useCallback(async (): Promise<
		number | undefined
	> => {
		return await controller.getCurrentTime();
	}, [controller]);

	const getVolume = useCallback(async (): Promise<number | undefined> => {
		return await controller.getVolume();
	}, [controller]);

	const getPlaybackRate = useCallback(async (): Promise<
		number | undefined
	> => {
		return await controller.getPlaybackRate();
	}, [controller]);

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
