import React from 'react';

import { LogLevel } from '../controllers/Logger';
import { NiconicoPlayerController } from '../controllers/NiconicoPlayerController';
import { PlayerContainer, PlayerProps } from './PlayerContainer';

const NiconicoPlayer = React.memo(
	({ ...props }: PlayerProps): React.ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'NiconicoPlayer');

		const playerFactory = React.useCallback(
			(element: HTMLIFrameElement): Promise<HTMLIFrameElement> => {
				return Promise.resolve(element);
			},
			[],
		);

		return (
			<PlayerContainer
				{...props}
				loadScript={undefined}
				playerFactory={playerFactory}
				controllerFactory={NiconicoPlayerController}
			>
				{(elementRef, videoId): React.ReactElement => (
					<div style={{ width: '100%', height: '100%' }}>
						{/* eslint-disable-next-line jsx-a11y/iframe-has-title */}
						<iframe
							ref={elementRef}
							src={`https://embed.nicovideo.jp/watch/${videoId}?jsapi=1&playerId=1`}
							width="100%"
							height="100%"
							allowFullScreen
							style={{ border: 'none' }}
							// The player has to have the allow="autoplay" attribute.
							// Otherwise it throws a NotAllowedError: "play() failed because the user didn't interact with the document first".
							// See also: https://github.com/vimeo/player.js/issues/389.
							// NOTE: An iframe element created by `PVPlayerNiconico.playerFactory.create` doesn't have the allow="autoplay" attribute,
							// which causes the above issue when trying to autoplay a video.
							allow="autoplay; fullscreen"
						/>
					</div>
				)}
			</PlayerContainer>
		);
	},
);

export default NiconicoPlayer;
