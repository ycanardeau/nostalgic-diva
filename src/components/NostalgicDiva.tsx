import React from 'react';

import { LogLevel } from '../controllers/ILogger';
import {
	IPlayerController,
	PlayerOptions,
	PlayerType,
} from '../controllers/PlayerController';
import { useNostalgicDiva } from './NostalgicDivaProvider';
import { PlayerProps } from './PlayerContainer';

const AudioPlayer = React.lazy(() => import('./AudioPlayer'));
const DailymotionPlayer = React.lazy(() => import('./DailymotionPlayer'));
const NiconicoPlayer = React.lazy(() => import('./NiconicoPlayer'));
const SoundCloudPlayer = React.lazy(() => import('./SoundCloudPlayer'));
const TwitchPlayer = React.lazy(() => import('./TwitchPlayer'));
const VimeoPlayer = React.lazy(() => import('./VimeoPlayer'));
const YouTubePlayer = React.lazy(() => import('./YouTubePlayer'));

const players: Record<PlayerType, React.ElementType<PlayerProps>> = {
	Audio: AudioPlayer,
	Dailymotion: DailymotionPlayer,
	Niconico: NiconicoPlayer,
	SoundCloud: SoundCloudPlayer,
	Twitch: TwitchPlayer,
	Vimeo: VimeoPlayer,
	YouTube: YouTubePlayer,
};

export interface NostalgicDivaProps {
	type: `${PlayerType}`;
	videoId: string;
	options?: PlayerOptions;
	onControllerChange?: (value: IPlayerController | undefined) => void;
}

export const NostalgicDiva = React.memo(
	({
		type,
		videoId,
		options,
		onControllerChange,
	}: NostalgicDivaProps): React.ReactElement => {
		const { logger, controllerRef } = useNostalgicDiva();

		logger.log(LogLevel.Debug, 'NostalgicDiva');

		const handleControllerChange = React.useCallback(
			(value: IPlayerController | undefined) => {
				controllerRef.current = value;

				onControllerChange?.(value);
			},
			[controllerRef, onControllerChange],
		);

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
