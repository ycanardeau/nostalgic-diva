import React from 'react';

import { LogLevel } from '../players/ILogger';
import { TwitchPlayerApi } from '../players/TwitchPlayerApi';
import { ensureScriptLoaded } from '../players/ensureScriptLoaded';
import { PlayerContainer, PlayerProps } from './PlayerContainer';

export const TwitchPlayer = React.memo(
	({ ...props }: PlayerProps): React.ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'TwitchPlayer');

		const loadScript = React.useCallback(async () => {
			await ensureScriptLoaded(
				'https://embed.twitch.tv/embed/v1.js',
				logger,
			);
		}, [logger]);

		const playerFactory = React.useCallback(
			async (
				element: HTMLDivElement,
				videoId: string,
			): Promise<Twitch.Player> => {
				return Promise.resolve(
					new Twitch.Player(element, {
						video: videoId,
						width: '100%',
						height: '100%',
					}),
				);
			},
			[],
		);

		return (
			<PlayerContainer<HTMLDivElement, Twitch.Player, TwitchPlayerApi>
				{...props}
				loadScript={loadScript}
				playerFactory={playerFactory}
				playerApiFactory={TwitchPlayerApi}
			>
				{(playerElementRef): React.ReactElement => (
					<div
						ref={playerElementRef}
						style={{ width: '100%', height: '100%' }}
					/>
				)}
			</PlayerContainer>
		);
	},
);
