import { LogLevel } from '@/controllers/Logger';
import {
	SpotifyEmbedController,
	SpotifyIFrameAPI,
	SpotifyPlayerController,
} from '@/controllers/SpotifyPlayerController';
import { ensureScriptLoaded } from '@/controllers/ensureScriptLoaded';
import React from 'react';

import { PlayerContainer, PlayerProps } from './PlayerContainer';

let IFrameAPI: SpotifyIFrameAPI | undefined;

const SpotifyPlayer = React.memo(
	({ ...props }: PlayerProps): React.ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'SpotifyPlayer');

		const loadScript = React.useCallback((): Promise<void> => {
			return new Promise(async (resolve, reject) => {
				const { first } = await ensureScriptLoaded(
					'https://open.spotify.com/embed/iframe-api/v1',
					logger,
				);

				if (first) {
					window.onSpotifyIframeApiReady = (iFrameAPI): void => {
						logger.log(LogLevel.Debug, 'Spotify iframe API ready');
						IFrameAPI = iFrameAPI;
						resolve();
					};
				} else {
					resolve();
				}
			});
		}, [logger]);

		const playerFactory = React.useCallback(
			(
				element: HTMLDivElement,
				videoId: string,
			): Promise<SpotifyEmbedController> => {
				return new Promise((resolve, reject) => {
					if (IFrameAPI) {
						IFrameAPI.createController(
							element,
							{ uri: videoId, width: '100%', height: '100%' },
							(EmbedController) => resolve(EmbedController),
						);
					} else {
						reject();
					}
				});
			},
			[],
		);

		return (
			<PlayerContainer
				{...props}
				loadScript={loadScript}
				playerFactory={playerFactory}
				controllerFactory={SpotifyPlayerController}
			>
				{(elementRef): React.ReactElement => (
					<div style={{ width: '100%', height: '100%' }}>
						<div ref={elementRef} id="embed-iframe" />
					</div>
				)}
			</PlayerContainer>
		);
	},
);

export default SpotifyPlayer;
