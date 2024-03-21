import React from 'react';

import { ILogger, LogLevel, Logger } from '../controllers/Logger';
import {
	IPlayerController,
	PlayerOptions,
	PlayerType,
} from '../controllers/PlayerController';
import { useNostalgicDiva } from './NostalgicDivaProvider';
import { PlayerProps } from './PlayerContainer';

const players: Record<PlayerType, React.ElementType<PlayerProps>> = {
	Audio: React.lazy(() => import('./AudioPlayer')),
	Dailymotion: React.lazy(() => import('./DailymotionPlayer')),
	Niconico: React.lazy(() => import('./NiconicoPlayer')),
	SoundCloud: React.lazy(() => import('./SoundCloudPlayer')),
	Twitch: React.lazy(() => import('./TwitchPlayer')),
	Vimeo: React.lazy(() => import('./VimeoPlayer')),
	YouTube: React.lazy(() => import('./YouTubePlayer')),
};

export interface NostalgicDivaProps {
	type: `${PlayerType}`;
	videoId: string;
	options?: PlayerOptions;
	logger?: ILogger;
	onControllerChange?: (value: IPlayerController | undefined) => void;
}

export const defaultLogger = new Logger();

export const NostalgicDiva = React.memo(
	({
		type,
		videoId,
		options,
		logger = defaultLogger,
		onControllerChange,
	}: NostalgicDivaProps): React.ReactElement => {
		// useNostalgicDiva may return undefined if NostalgicDiva is used without NostalgicDivaProvider.
		const diva = useNostalgicDiva() as
			| ReturnType<typeof useNostalgicDiva>
			| undefined;

		const handleControllerChange = React.useCallback(
			(value: IPlayerController | undefined) =>
				(onControllerChange ?? diva?.handleControllerChange)?.(value),
			[diva?.handleControllerChange, onControllerChange],
		);

		logger.log(LogLevel.Debug, 'NostalgicDiva');

		const Player = players[type];
		return (
			<React.Suspense fallback={null}>
				<Player
					logger={logger}
					type={type}
					onControllerChange={handleControllerChange}
					videoId={videoId}
					options={options}
				/>
			</React.Suspense>
		);
	},
);
