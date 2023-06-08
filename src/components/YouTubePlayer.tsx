import React from 'react';

import { LogLevel } from '../players/ILogger';
import { YouTubePlayerApi } from '../players/YouTubePlayerApi';
import { ensureScriptLoaded } from '../players/ensureScriptLoaded';
import { PlayerContainer, PlayerProps } from './PlayerContainer';

const origin = 'https://www.youtube-nocookie.com';

const YouTubePlayer = React.memo(
	({ ...props }: PlayerProps): React.ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'YouTubePlayer');

		const loadScript = React.useCallback((): Promise<void> => {
			return new Promise(async (resolve, reject) => {
				const first = await ensureScriptLoaded(
					'https://www.youtube.com/iframe_api',
					logger,
				);

				if (first) {
					// https://stackoverflow.com/a/18154942.
					window.onYouTubeIframeAPIReady = (): void => {
						logger.log(LogLevel.Debug, 'YouTube iframe API ready');
						resolve();
					};
				} else {
					resolve();
				}
			});
		}, [logger]);

		const playerFactory = React.useCallback(
			(element: HTMLDivElement): Promise<YT.Player> => {
				return Promise.resolve(
					new YT.Player(element, {
						host: origin,
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
				playerApiFactory={YouTubePlayerApi}
			>
				{(playerElementRef): React.ReactElement => (
					<div style={{ width: '100%', height: '100%' }}>
						<div ref={playerElementRef} />
					</div>
				)}
			</PlayerContainer>
		);
	},
);

export default YouTubePlayer;
