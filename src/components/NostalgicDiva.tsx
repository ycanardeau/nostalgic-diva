import React, {
	ElementType,
	ReactElement,
	Suspense,
	lazy,
	memo,
	useCallback,
} from 'react';

import { ILogger, LogLevel, Logger } from '../controllers/Logger';
import {
	IPlayerController,
	PlayerOptions,
	PlayerType,
} from '../controllers/PlayerController';
import { findVideoService } from '../services/findVideoService';
import { useNostalgicDiva } from './NostalgicDivaProvider';
import { PlayerProps } from './PlayerContainer';

const players: Record<PlayerType, ElementType<PlayerProps>> = {
	Audio: lazy(() => import('./AudioPlayer')),
	Dailymotion: lazy(() => import('./DailymotionPlayer')),
	Niconico: lazy(() => import('./NiconicoPlayer')),
	SoundCloud: lazy(() => import('./SoundCloudPlayer')),
	Twitch: lazy(() => import('./TwitchPlayer')),
	Vimeo: lazy(() => import('./VimeoPlayer')),
	YouTube: lazy(() => import('./YouTubePlayer')),
};

export interface NostalgicDivaProps {
	src: string;
	options?: PlayerOptions;
	logger?: ILogger;
	onControllerChange?: (value: IPlayerController | undefined) => void;
}

const defaultLogger = new Logger();

function getTypeAndVideoId(
	url: string,
): { type: PlayerType; videoId: string } | undefined {
	const videoService = findVideoService(url);
	if (videoService === undefined) {
		return undefined;
	}

	const { type, extractVideoId } = videoService;

	const videoId = extractVideoId(url);
	if (videoId === undefined) {
		return undefined;
	}

	return { type: type, videoId: videoId };
}

export const NostalgicDiva = memo(
	({
		src,
		options,
		logger = defaultLogger,
		onControllerChange,
	}: NostalgicDivaProps): ReactElement => {
		// useNostalgicDiva may return undefined if NostalgicDiva is used without NostalgicDivaProvider.
		const diva = useNostalgicDiva() as
			| ReturnType<typeof useNostalgicDiva>
			| undefined;

		const handleControllerChange = useCallback(
			(value: IPlayerController | undefined) =>
				(onControllerChange ?? diva?.handleControllerChange)?.(value),
			[diva?.handleControllerChange, onControllerChange],
		);

		logger.log(LogLevel.Debug, 'NostalgicDiva');

		const typeAndVideoId = getTypeAndVideoId(src);
		if (typeAndVideoId === undefined) {
			return (
				<div style={{ width: '100%', height: '100%' }}>
					<iframe
						src="about:blank"
						title="about:blank"
						style={{
							width: '100%',
							height: '100%',
							border: 0,
						}}
					/>
				</div>
			);
		}

		const { type, videoId } = typeAndVideoId;

		const Player = players[type];

		return (
			<Suspense fallback={null}>
				<Player
					logger={logger}
					type={type}
					onControllerChange={handleControllerChange}
					videoId={videoId}
					options={options}
				/>
			</Suspense>
		);
	},
);
