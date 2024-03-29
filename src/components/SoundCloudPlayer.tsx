import React from 'react';

import { LogLevel } from '../controllers/Logger';
import { SoundCloudPlayerController } from '../controllers/SoundCloudPlayerController';
import { ensureScriptLoaded } from '../controllers/ensureScriptLoaded';
import { PlayerContainer, PlayerProps } from './PlayerContainer';

const SoundCloudPlayer = React.memo(
	({ ...props }: PlayerProps): React.ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'SoundCloudPlayer');

		const loadScript = React.useCallback(async () => {
			await ensureScriptLoaded(
				'https://w.soundcloud.com/player/api.js',
				logger,
			);
		}, [logger]);

		const playerFactory = React.useCallback(
			(element: HTMLIFrameElement): Promise<SC.SoundCloudWidget> => {
				return Promise.resolve(SC.Widget(element));
			},
			[],
		);

		return (
			<PlayerContainer
				{...props}
				loadScript={loadScript}
				playerFactory={playerFactory}
				controllerFactory={SoundCloudPlayerController}
			>
				{(elementRef, videoId): React.ReactElement => (
					// eslint-disable-next-line jsx-a11y/iframe-has-title
					<iframe
						ref={elementRef}
						src={`https://w.soundcloud.com/player/?url=${videoId}`}
						frameBorder={0}
						allow="autoplay"
						style={{ width: '100%', height: '100%' }}
					/>
				)}
			</PlayerContainer>
		);
	},
);

export default SoundCloudPlayer;
