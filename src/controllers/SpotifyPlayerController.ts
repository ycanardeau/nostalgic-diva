import { PlayerControllerImpl } from './PlayerControllerImpl';

interface PlaybackUpdateEvent {
	data: {
		isPaused: boolean;
		isBuffering: boolean;
		duration: number;
		position: number;
	};
}

// https://developer.spotify.com/documentation/embeds/references/iframe-api#methods
export interface SpotifyEmbedController {
	/**
	 * Use this method to load a new podcast episode into an Embed that you have created.
	 * @param spotifyId String of a podcast episode URI you'd like to load in the Embed
	 */
	loadUri(spotifyId: string): void;
	/**
	 * This method begins playing the content that had been previously loaded.
	 */
	play(): void;
	/**
	 * This method pauses playback.
	 */
	pause(): void;
	/**
	 * If playback is paused, this method can be used to resume it. If playback was not started, this method will start playback.
	 */
	resume(): void;
	/**
	 * This method toggles between play and pause.
	 */
	togglePlay(): void;
	/**
	 * Use this method to restart playback from the beginning.
	 */
	restart(): void;
	/**
	 * Use this method to seek to a given point in the podcast episode that has been loaded in the Embed.
	 * @param seconds The number of seconds into the podcast episode after which you would like to move the cursor
	 */
	seek(seconds: number): void;
	/**
	 * Destroys the Embed and removes its DOM element from the page.
	 */
	destroy(): void;
	addListener(type: 'ready', listener: () => void): void;
	addListener(
		type: 'playback_update',
		listener: (e: PlaybackUpdateEvent) => void,
	): void;
	removeListener(type: 'ready', listener: () => void): void;
	removeListener(
		type: 'playback_update',
		listener: (e: PlaybackUpdateEvent) => void,
	): void;
}

export interface SpotifyIFrameAPI {
	/**
	 * Call createController for each Embed that you'd like to position on the web page.
	 * @param element DOM element that you'd like replaced by the Embed
	 * @param options Key value pairs that configure the new controller. The available options are uri, the Spotify URI of the content you'd like loaded first; width, the width in pixels of the Embed, and height, the height in pixels of the Embed. See the sample below for an example.
	 * @param callback Function that receives the created controller object (EmbedController in the following examples)
	 */
	createController(
		element: HTMLDivElement,
		options: {
			uri: string;
			width?: string;
			height?: string;
		},
		callback: (EmbedController: SpotifyEmbedController) => void,
	): void;
}

declare global {
	interface Window {
		/**
		 * Define this global function so that your app knows when the iFrame API is ready to use. It receives an object (IFrameAPI in our example) which you can use to create controllers.
		 * @param IFrameAPI Object you can use to create iFrame API controllers
		 */
		onSpotifyIframeApiReady(IFrameAPI: SpotifyIFrameAPI): void;
	}
}

export class SpotifyPlayerController extends PlayerControllerImpl<SpotifyEmbedController> {
	private duration = 0;
	private currentTime = 0;

	private handlePlaybackUpdate = (e: PlaybackUpdateEvent): void => {
		this.duration = e.data.duration / 1000;
		this.currentTime = e.data.position / 1000;

		this.options?.onTimeUpdate?.({
			duration: this.duration,
			percent: this.currentTime / this.duration,
			seconds: this.currentTime,
		});
	};

	attach(id: string): Promise<void> {
		return new Promise((resolve, reject /* TODO: Reject. */) => {
			const handleReady = (): void => {
				this.player.removeListener('ready', handleReady);

				this.player.addListener(
					'playback_update',
					this.handlePlaybackUpdate,
				);

				resolve();
			};

			this.player.addListener('ready', handleReady);
		});
	}

	detach(): Promise<void> {
		this.player.removeListener(
			'playback_update',
			this.handlePlaybackUpdate,
		);
		return Promise.resolve();
	}

	loadVideo(id: string): Promise<void> {
		this.player.loadUri(id);
		return Promise.resolve();
	}

	play(): Promise<void> {
		this.player.resume();
		return Promise.resolve();
	}

	pause(): Promise<void> {
		this.player.pause();
		return Promise.resolve();
	}

	setCurrentTime(seconds: number): Promise<void> {
		this.player.seek(seconds);
		return Promise.resolve();
	}

	setVolume = undefined;

	setMuted = undefined;

	setPlaybackRate = undefined;

	getDuration(): Promise<number> {
		return Promise.resolve(this.duration);
	}

	getCurrentTime(): Promise<number> {
		return Promise.resolve(this.currentTime);
	}

	getVolume = undefined;

	getMuted = undefined;

	getPlaybackRate = undefined;
}
