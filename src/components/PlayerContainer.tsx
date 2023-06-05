import React from 'react';

import { ILogger, LogLevel } from '../players/ILogger';
import {
	IPlayerApi,
	PlayerApi,
	PlayerOptions,
	PlayerType,
} from '../players/PlayerApi';
import { PlayerApiImpl } from '../players/PlayerApiImpl';
import usePreviousDistinct from './usePreviousDistinct';

export interface PlayerProps {
	logger: ILogger;
	type: PlayerType;
	playerApiRef: React.MutableRefObject<IPlayerApi | undefined> | undefined;
	videoId: string;
	options: PlayerOptions | undefined;
}

interface PlayerContainerProps<
	TElement extends HTMLElement,
	TPlayer extends object,
	TPlayerApi extends PlayerApiImpl<TPlayer>,
> extends PlayerProps {
	loadScript: (() => Promise<void>) | undefined;
	playerFactory: (element: TElement) => Promise<TPlayer>;
	playerApiFactory: new (
		logger: ILogger,
		player: TPlayer,
		options: PlayerOptions | undefined,
	) => TPlayerApi;
	children: (
		playerElementRef: React.MutableRefObject<TElement>,
		videoId: string,
	) => React.ReactNode;
}

export const PlayerContainer = <
	TElement extends HTMLElement,
	TPlayer extends object,
	TPlayerApi extends PlayerApiImpl<TPlayer>,
>({
	logger,
	type,
	loadScript,
	playerFactory,
	playerApiRef,
	videoId,
	options,
	playerApiFactory,
	children,
}: PlayerContainerProps<TElement, TPlayer, TPlayerApi>): React.ReactElement<
	PlayerContainerProps<TElement, TPlayer, TPlayerApi>
> => {
	logger.log(LogLevel.Debug, 'PlayerContainer');

	const videoIdRef = React.useRef(videoId);

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const playerElementRef = React.useRef<TElement>(undefined!);

	const [player, setPlayer] = React.useState<TPlayer>();
	const [playerApi, setPlayerApi] = React.useState<IPlayerApi>();

	React.useEffect(() => {
		(loadScript?.() ?? Promise.resolve()).then(() => {
			playerFactory(playerElementRef.current).then((player) => {
				setPlayer(player);
			});
		});
	}, [loadScript, playerFactory]);

	// Make sure that `options` do not change between re-rendering.
	React.useEffect(() => {
		if (player === undefined) {
			return;
		}

		const playerApi = new PlayerApi(
			logger,
			type,
			player,
			options,
			playerApiFactory,
		);

		if (playerApiRef) {
			playerApiRef.current = playerApi;
		}

		playerApi
			.attach(videoIdRef.current)
			.then(() => setPlayerApi(playerApi));

		return (): void => {
			if (playerApiRef) {
				if (playerApi !== playerApiRef.current) {
					throw new Error('playerApi differs');
				}
			}

			playerApi.detach().finally(() => setPlayerApi(undefined));
		};
	}, [
		logger,
		type,
		loadScript,
		player,
		options,
		playerApiFactory,
		playerApiRef,
	]);

	const previousVideoId = usePreviousDistinct(videoId);
	React.useEffect(() => {
		// If `previousVideoId` is undefined, then it means that the video has already been loaded by either
		// 1. `<audio>`s `src` attribute (e.g. `AudioPlayer`),
		// 2. `<iframe>`'s `src` attribute (e.g. `NiconicoPlayer`, `SoundCloudPlayer` and `VimeoPlayer`), or
		// 3. the `attach` method of the player API (e.g. `YouTubePlayer`).
		if (previousVideoId === undefined) {
			return;
		}

		playerApi?.loadVideo(videoId);
	}, [previousVideoId, videoId, playerApi]);

	// Make sure that `videoId` does not change between re-rendering.
	return <>{children(playerElementRef, videoIdRef.current)}</>;
};
