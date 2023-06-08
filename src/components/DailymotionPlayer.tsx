import React from 'react';

import { DailymotionPlayerApi } from '../players/DailymotionPlayerApi';
import { LogLevel } from '../players/ILogger';
import { ensureScriptLoaded } from '../players/ensureScriptLoaded';
import { PlayerContainer, PlayerProps } from './PlayerContainer';

const DailymotionPlayer = React.memo(
	({ options, ...props }: PlayerProps): React.ReactElement => {
		const { logger } = props;

		logger.log(LogLevel.Debug, 'DailymotionPlayer');

		const loadScript = React.useCallback(async () => {
			await ensureScriptLoaded('https://api.dmcdn.net/all.js', logger);
		}, [logger]);

		const playerFactory = React.useCallback(
			(element: HTMLDivElement, videoId: string): Promise<DM.player> => {
				return Promise.resolve(
					new DM.player(element, {
						video: videoId,
						width: '100%',
						height: '100%',
						events: {
							apiready: (): void => {
								options?.onLoaded?.({ id: videoId });
							},
							seeked: (): void => {
								options?.onTimeUpdate?.({
									duration: 0,
									percent: 0,
									seconds: 0,
								});
							},
							video_end: (): void => {
								options?.onEnded?.();
							},
							durationchange: (): void => {},
							pause: (): void => {
								options?.onPause?.();
							},
							playing: (): void => {
								options?.onPlay?.();
							},
							waiting: (): void => {},
							error: (error): void => {
								options?.onError?.(error);
							},
						},
					}),
				);
			},
			[options],
		);

		return (
			<PlayerContainer
				{...props}
				options={options}
				loadScript={loadScript}
				playerFactory={playerFactory}
				playerApiFactory={DailymotionPlayerApi}
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

export default DailymotionPlayer;
