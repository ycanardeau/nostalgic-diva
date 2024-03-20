import React from 'react';

import { LogLevel } from '../controllers/ILogger';
import { VimeoPlayerController } from '../controllers/VimeoPlayerController';
import { ensureScriptLoaded } from '../controllers/ensureScriptLoaded';
import { PlayerContainer, PlayerProps } from './PlayerContainer';

const VimeoPlayer = React.memo(
	({ ...props }: PlayerProps): React.ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'VimeoPlayer');

		const loadScript = React.useCallback(async () => {
			await ensureScriptLoaded(
				'https://player.vimeo.com/api/player.js',
				logger,
			);
		}, [logger]);

		const playerFactory = React.useCallback(
			(element: HTMLIFrameElement): Promise<Vimeo.Player> => {
				return Promise.resolve(new Vimeo.Player(element));
			},
			[],
		);

		return (
			<PlayerContainer
				{...props}
				loadScript={loadScript}
				playerFactory={playerFactory}
				controllerFactory={VimeoPlayerController}
			>
				{(elementRef, videoId): React.ReactElement => (
					// eslint-disable-next-line jsx-a11y/iframe-has-title
					<iframe
						ref={elementRef}
						src={`https://player.vimeo.com/video/${videoId}`}
						frameBorder={0}
						allow="autoplay"
						style={{ width: '100%', height: '100%' }}
					/>
				)}
			</PlayerContainer>
		);
	},
);

export default VimeoPlayer;
