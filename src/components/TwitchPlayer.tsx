import React from 'react';

import { LogLevel } from '../controllers/Logger';
import { TwitchPlayerController } from '../controllers/TwitchPlayerController';
import { ensureScriptLoaded } from '../controllers/ensureScriptLoaded';
import { PlayerContainer, PlayerProps } from './PlayerContainer';

const TwitchPlayer = React.memo(
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
			<PlayerContainer
				{...props}
				loadScript={loadScript}
				playerFactory={playerFactory}
				controllerFactory={TwitchPlayerController}
			>
				{(elementRef): React.ReactElement => (
					<div
						ref={elementRef}
						style={{ width: '100%', height: '100%' }}
					/>
				)}
			</PlayerContainer>
		);
	},
);

export default TwitchPlayer;
