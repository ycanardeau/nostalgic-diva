import React from 'react';

import { IPlayerController } from '../controllers';
import { ILogger, Logger } from '../controllers/Logger';

interface NostalgicDivaContextProps extends IPlayerController {
	logger: ILogger;
	controllerRef: React.MutableRefObject<IPlayerController | undefined>;
}

const NostalgicDivaContext = React.createContext<NostalgicDivaContextProps>(
	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	undefined!,
);

interface NostalgicDivaProviderProps {
	logger?: ILogger;
	children?: React.ReactNode;
}

const defaultLogger = new Logger();

export const NostalgicDivaProvider = ({
	logger = defaultLogger,
	children,
}: NostalgicDivaProviderProps): React.ReactElement => {
	const controllerRef = React.useRef<IPlayerController>();

	const loadVideo = React.useCallback(async (id: string) => {
		await controllerRef.current?.loadVideo(id);
	}, []);

	const play = React.useCallback(async () => {
		await controllerRef.current?.play();
	}, []);

	const pause = React.useCallback(async () => {
		await controllerRef.current?.pause();
	}, []);

	const setCurrentTime = React.useCallback(async (seconds: number) => {
		const controller = controllerRef.current;
		if (!controller) return;

		await controller.setCurrentTime(seconds);
		await controller.play();
	}, []);

	const setVolume = React.useCallback(async (volume: number) => {
		await controllerRef.current?.setVolume(volume);
	}, []);

	const setMuted = React.useCallback(async (muted: boolean) => {
		await controllerRef.current?.setMuted(muted);
	}, []);

	const setPlaybackRate = React.useCallback(async (playbackRate: number) => {
		await controllerRef.current?.setPlaybackRate(playbackRate);
	}, []);

	const getDuration = React.useCallback(async () => {
		return await controllerRef.current?.getDuration();
	}, []);

	const getCurrentTime = React.useCallback(async () => {
		return await controllerRef.current?.getCurrentTime();
	}, []);

	const getVolume = React.useCallback(async () => {
		return await controllerRef.current?.getVolume();
	}, []);

	const getPlaybackRate = React.useCallback(async () => {
		return await controllerRef.current?.getPlaybackRate();
	}, []);

	const value = React.useMemo(
		(): NostalgicDivaContextProps => ({
			logger,
			controllerRef: controllerRef,
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
			logger,
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
	return React.useContext(NostalgicDivaContext);
};
