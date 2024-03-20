import React from 'react';

import { AudioPlayerController } from '../controllers/AudioPlayerController';
import { LogLevel } from '../controllers/ILogger';
import { PlayerContainer, PlayerProps } from './PlayerContainer';

const AudioPlayer = React.memo(
	({ ...props }: PlayerProps): React.ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'AudioPlayer');

		const playerFactory = React.useCallback(
			(element: HTMLAudioElement): Promise<HTMLAudioElement> => {
				return Promise.resolve(element);
			},
			[],
		);

		return (
			<PlayerContainer
				{...props}
				loadScript={undefined}
				playerFactory={playerFactory}
				controllerFactory={AudioPlayerController}
			>
				{(elementRef, videoId): React.ReactElement => (
					<audio
						ref={elementRef}
						src={videoId}
						style={{ width: '100%', height: '100%' }}
						preload="auto"
						autoPlay
						controls
					/>
				)}
			</PlayerContainer>
		);
	},
);

export default AudioPlayer;
