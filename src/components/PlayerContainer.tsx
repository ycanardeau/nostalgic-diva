import React from 'react';

import { ILogger, LogLevel } from '../controllers/Logger';
import {
	IPlayerController,
	PlayerController,
	PlayerOptions,
	PlayerType,
} from '../controllers/PlayerController';
import { PlayerControllerImpl } from '../controllers/PlayerControllerImpl';
import usePreviousDistinct from './usePreviousDistinct';

export interface PlayerProps {
	logger: ILogger;
	type: PlayerType;
	onControllerChange:
		| ((value: IPlayerController | undefined) => void)
		| undefined;
	videoId: string;
	options: PlayerOptions | undefined;
}

interface PlayerContainerProps<
	TElement extends HTMLElement,
	TPlayer extends object,
	TController extends PlayerControllerImpl<TPlayer>,
> extends PlayerProps {
	loadScript: (() => Promise<void>) | undefined;
	playerFactory: (element: TElement, videoId: string) => Promise<TPlayer>;
	controllerFactory: new (
		logger: ILogger,
		player: TPlayer,
		options: PlayerOptions | undefined,
	) => TController;
	children: (
		elementRef: React.MutableRefObject<TElement>,
		videoId: string,
	) => React.ReactNode;
}

export const PlayerContainer = <
	TElement extends HTMLElement,
	TPlayer extends object,
	TController extends PlayerControllerImpl<TPlayer>,
>({
	logger,
	type,
	loadScript,
	playerFactory,
	onControllerChange,
	videoId,
	options,
	controllerFactory,
	children,
}: PlayerContainerProps<TElement, TPlayer, TController>): React.ReactElement<
	PlayerContainerProps<TElement, TPlayer, TController>
> => {
	logger.log(LogLevel.Debug, 'PlayerContainer');

	const videoIdRef = React.useRef(videoId);

	// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
	const elementRef = React.useRef<TElement>(undefined!);

	const [player, setPlayer] = React.useState<TPlayer>();

	const [controller, setController] = React.useState<IPlayerController>();
	React.useEffect(() => {
		onControllerChange?.(controller);
	}, [controller, onControllerChange]);

	React.useEffect(() => {
		(loadScript?.() ?? Promise.resolve()).then(() => {
			playerFactory(elementRef.current, videoIdRef.current).then(
				(player) => {
					setPlayer(player);
				},
			);
		});
	}, [loadScript, playerFactory]);

	// Make sure that `options` do not change between re-rendering.
	React.useEffect(() => {
		if (player === undefined) {
			return;
		}

		const controller = new PlayerController(
			logger,
			type,
			player,
			options,
			controllerFactory,
		);

		controller
			.attach(videoIdRef.current)
			.then(() => setController(controller));

		return (): void => {
			controller.detach().finally(() => setController(undefined));
		};
	}, [logger, type, loadScript, player, options, controllerFactory]);

	const previousVideoId = usePreviousDistinct(videoId);
	React.useEffect(() => {
		// If `previousVideoId` is undefined, then it means that the video has already been loaded by either
		// 1. `<audio>`s `src` attribute (e.g. `AudioPlayer`),
		// 2. `<iframe>`'s `src` attribute (e.g. `NiconicoPlayer`, `SoundCloudPlayer` and `VimeoPlayer`), or
		// 3. the `attach` method of the player API (e.g. `YouTubePlayer`).
		if (previousVideoId === undefined) {
			return;
		}

		controller?.loadVideo(videoId);
	}, [previousVideoId, videoId, controller]);

	// Make sure that `videoId` does not change between re-rendering.
	return <>{children(elementRef, videoIdRef.current)}</>;
};
