import React from 'react';

import { LogLevel } from '../players/ILogger';
import { PlayerOptions, PlayerType } from '../players/PlayerApi';
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

interface NostalgicDivaProps {
	type: PlayerType;
	videoId: string;
	options?: PlayerOptions;
}

export const NostalgicDiva = React.memo(
	({ type, videoId, options }: NostalgicDivaProps): React.ReactElement => {
		const { logger, playerApiRef } = useNostalgicDiva();

		logger.log(LogLevel.Debug, 'NostalgicDiva');

		const Player = players[type];
		return (
			<React.Suspense fallback={null}>
				<Player
					logger={logger}
					type={type}
					playerApiRef={playerApiRef}
					videoId={videoId}
					options={options}
				/>
			</React.Suspense>
		);
	},
);
