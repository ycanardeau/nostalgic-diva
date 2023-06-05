declare namespace nico {
	export interface NicoPlayer {
		iframeElement: HTMLIFrameElement;
		playerId: string;
		play(): void;
		pause(): void;
	}

	export interface NicoPlayerFactory {
		create(element: HTMLElement, watchId: string): Promise<NicoPlayer>;
	}

	export interface PlayerStatusEvent {
		eventName: 'playerStatusChange';
		data: {
			playerStatus: PlayerStatus;
		};
	}

	export interface StatusEvent {
		eventName: 'statusChange';
		data: {
			playerStatus: PlayerStatus;
		};
	}

	export interface MetadataEvent {
		eventName: 'playerMetadataChange';
		data: {
			currentTime: number;
			duration: number;
			volume: number;
		};
	}

	export interface LoadCompleteEvent {
		eventName: 'loadComplete';
		data: {
			videoInfo: {
				watchId: string;
				lengthInSeconds: number;
			};
		};
	}

	export interface ErrorEvent {
		eventName: 'error';
		data: {
			message: string;
		};
	}

	export interface PlayerErrorEvent {
		eventName: 'player-error:video:play' | 'player-error:video:seek';
		data: {
			message: string;
		};
	}

	type EventData =
		| PlayerStatusEvent
		| StatusEvent
		| MetadataEvent
		| LoadCompleteEvent
		| ErrorEvent
		| PlayerErrorEvent;

	export interface PlayerEvent {
		origin: string;
		data: EventData;
	}
}

declare namespace SC {
	export const Widget: {
		(iframeElementId: string | HTMLIFrameElement): SoundCloudWidget;
		Events: SoundCloudEvents;
	};

	interface SoundCloudWidget {
		bind(eventName: string, listener: (e: any) => void);
		load(url: string, options: SoundCloudLoadOptions);
		pause();
		play();
		seekTo(milliseconds: number);
		setVolume(volume: number);
		unbind(eventName: string);
		getDuration(callback: (duration: number) => void): void;
		getPosition(callback: (position: number) => void): void;
		getVolume(callback: (volume: number) => void): void;
	}

	interface SoundCloudLoadOptions {
		auto_play?: boolean;

		callback?: () => void;
	}

	interface SoundCloudEvents {
		ERROR: string;
		FINISH: string;
		PAUSE: string;
		PLAY: string;
		READY: string;
		PLAY_PROGRESS: string;
	}
}

declare namespace Vimeo {
	// Type definitions for @vimeo/player 2.16.4
	// Project: https://github.com/vimeo/player.js
	// Definitions by: Denis Yılmaz <https://github.com/denisyilmaz>
	//                 Felix Albert <f.albert.work@icloud.com>
	//                 Tim Chen <https://github.com/timc13>
	//                 Terry Mun <https://github.com/terrymun>
	//                 Coskun Deniz <deniz@tassomai.com>
	//                 Kohei Watanabe <https://github.com/kou029w>
	//                 Michael Markey <https://github.com/mikeamarkey>
	// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

	export type TrackKind = 'captions' | 'subtitles';

	export type CallbackFunction = (...args: any[]) => any;

	export interface Error {
		name: string;
		message: string;
		method: string;
	}

	export interface PasswordError extends Error {
		name: 'PasswordError';
		message: string;
		method: string;
	}
	export interface PrivacyError extends Error {
		name: 'PrivacyError';
		message: string;
		method: string;
	}
	export interface InvalidTrackLanguageError extends Error {
		name: 'InvalidTrackLanguageError';
		message: string;
		method: string;
	}
	export interface InvalidTrackError extends Error {
		name: 'InvalidTrackError';
		message: string;
		method: string;
	}
	export interface UnsupportedError extends Error {
		name: 'UnsupportedError';
		message: string;
		method: string;
	}
	export interface ContrastError extends Error {
		name: 'ContrastError';
		message: string;
		method: string;
	}
	export interface InvalidCuePoint extends Error {
		name: 'InvalidCuePoint';
		message: string;
		method: string;
	}
	export interface RangeError extends Error {
		name: 'RangeError';
		message: string;
		method: string;
	}
	export interface TypeError extends Error {
		name: 'TypeError';
		message: string;
		method: string;
	}

	export interface TimeEvent {
		duration: number;
		percent: number;
		seconds: number;
	}

	export interface TextTrackChangeEvent {
		kind: TrackKind | null;
		label: string | null;
		language: string | null;
	}

	export interface VimeoChapter {
		startTime: number;
		title: string;

		/**
		 * The `index` property of each chapter is the place it holds in the order of all the chapters. It starts at 1.
		 */
		index: number;
	}

	export interface Cue {
		/**
		 * The `html` property contains the HTML that the Player renders for that cue.
		 */
		html: string;

		/**
		 * The `text` property of each cue is the raw value parsed from the caption or subtitle file.
		 */
		text: string;
	}

	export interface CueChangeEvent {
		cues: Cue[];
		kind: TrackKind;
		label: string;
		language: string;
	}

	export interface CuePointEvent {
		time: number;

		/**
		 * The `data` property will be the custom data provided in the `addCuePoint()` call, or an empty object if none was provided.
		 */
		data: VimeoCuePointData;
		id: string;
	}

	export interface VolumeChangeEvent {
		volume: number;
	}

	export interface PlaybackRateEvent {
		playbackRate: number;
	}

	export interface LoadedEvent {
		id: number;
	}

	export interface DurationChangeEvent {
		duration: number;
	}

	export interface FullScreenChangeEvent {
		fullscreen: boolean;
	}

	export interface VimeoVideoQualityObject {
		label: string;
		id: string;
		active: boolean;
	}

	export interface QualityChangeEvent {
		quality: VimeoVideoQuality;
	}

	export interface VimeoCameraProps {
		yaw: number;
		pitch: number;
		roll: number;
		fov: number;
	}

	export interface ResizeEvent {
		videoWidth: number;
		videoHeight: number;
	}

	export interface EventMap {
		/**
		 * Triggered when video playback is initiated.
		 */
		play: TimeEvent;

		/**
		 * Triggered when the video starts playing.
		 */
		playing: TimeEvent;

		/**
		 * Triggered when the video pauses.
		 */
		pause: TimeEvent;

		/**
		 * Triggered any time the video playback reaches the end. _Note_: when loop is turned on, the ended `event` will not fire.
		 */
		ended: TimeEvent;

		/**
		 * Triggered as the `currentTime` of the video updates. It generally fires every 250ms, but it may vary depending on the browser.
		 */
		timeupdate: TimeEvent;

		/**
		 * Triggered as the video is loaded. Reports back the amount of the video that has been buffered.
		 */
		progress: TimeEvent;

		/**
		 * Triggered when the player starts seeking to a specific time. A `timeupdate` event will also be fired at the same time.
		 */
		seeking: TimeEvent;

		/**
		 * Triggered when the player seeks to a specific time. A `timeupdate` event will also be fired at the same time.
		 */
		seeked: TimeEvent;

		/**
		 * Triggered when the active text track (captions/subtitles) changes. The values will be null if text tracks are turned off.
		 */
		texttrackchange: TextTrackChangeEvent;

		/**
		 * Triggered when the current chapter changes.
		 */
		chapterchange: VimeoChapter;

		/**
		 * Triggered when the active cue for the current text track changes. It also fires when the active text track changes. There may be multiple cues active.
		 */
		cuechange: CueChangeEvent;

		/**
		 * Triggered when the current time hits a registered cue point.
		 */
		cuepoint: CuePointEvent;

		/**
		 * Triggered when the volume in the player changes. Some devices do not support setting the volume of the video independently from the system volume, so this event will never fire on those
		 * devices.
		 */
		volumechange: VolumeChangeEvent;

		/**
		 * Triggered when the playback rate of the video in the player changes. The ability to change rate can be disabled by the creator and the event will not fire for those videos. The new playback
		 * rate is returned with the event.
		 */
		playbackratechange: PlaybackRateEvent;

		/**
		 * Triggered when buffering starts in the player. This is also triggered during preload and while seeking. There is no associated data with this event.
		 */
		bufferstart: never;

		/**
		 * Triggered when buffering ends in the player. This is also triggered at the end of preload and seeking. There is no associated data with this event.
		 */
		bufferend: never;

		/**
		 * Triggered when some kind of error is generated in the player. In general if you are using this API library, you should use `.catch()` on each method call instead of globally listening for
		 * error events.
		 *
		 * If the error was generated from a method call, the name of that method will be included.
		 */
		error: Error;

		/**
		 * Triggered when a new video is loaded in the player.
		 */
		loaded: LoadedEvent;

		/**
		 * Triggered when the duration attribute has been updated.
		 */
		durationchange: DurationChangeEvent;

		/**
		 * Triggered when the player enters or exits fullscreen.
		 */
		fullscreenchange: FullScreenChangeEvent;

		/**
		 * Triggered when the set quality changes.
		 */
		qualitychange: QualityChangeEvent;

		/**
		 * Triggered when any of the camera properties change for 360° videos.
		 */
		camerachange: VimeoCameraProps;

		/**
		 * Triggered when the intrinsic size of the media changes.
		 */
		resize: ResizeEvent;

		/**
		 * Triggered when the player enters picture-in-picture.
		 */
		enterpictureinpicture: never;

		/**
		 * Triggered when the player leaves picture-in-picture.
		 */
		leavepictureinpicture: never;
	}

	export type EventCallback<Data = any> = (data: Data) => any;

	export type VimeoTimeRange = [number, number];
	export type VimeoVideoQuality =
		| 'auto'
		| '4K'
		| '2K'
		| '1080p'
		| '720p'
		| '540p'
		| '360p'
		| '240p';

	export class Player {
		constructor(
			element: HTMLIFrameElement | HTMLElement | string,
			options?: Options,
		);

		on<EventName extends keyof EventMap>(
			event: EventName,
			callback: EventCallback<EventMap[EventName]>,
		): void;
		on(event: string, callback: EventCallback): void;
		off<EventName extends keyof EventMap>(
			event: EventName,
			callback: EventCallback<EventMap[EventName]>,
		): void;
		off(event: string, callback?: EventCallback): void;
		loadVideo(
			id: number,
		): VimeoPromise<
			number,
			TypeError | PasswordError | PrivacyError | Error
		>;
		loadVideo(
			url: string,
		): VimeoPromise<
			string,
			TypeError | PasswordError | PrivacyError | Error
		>;
		loadVideo(
			options: Options,
		): VimeoPromise<
			{ [prop: string]: any },
			TypeError | PasswordError | PrivacyError | Error
		>;
		ready(): VimeoPromise<void, Error>;
		enableTextTrack(
			language: string,
			kind?: TrackKind,
		): VimeoPromise<
			VimeoTextTrack,
			InvalidTrackLanguageError | InvalidTrackError | Error
		>;
		disableTextTrack(): VimeoPromise<void, Error>;
		pause(): VimeoPromise<void, PasswordError | PrivacyError | Error>;
		play(): VimeoPromise<void, PasswordError | PrivacyError | Error>;
		unload(): VimeoPromise<void, Error>;
		requestFullscreen(): VimeoPromise<void, Error>;
		exitFullscreen(): VimeoPromise<void, Error>;
		getFullscreen(): VimeoPromise<boolean, Error>;
		requestPictureInPicture(): VimeoPromise<void, Error>;
		exitPictureInPicture(): VimeoPromise<void, Error>;
		getPictureInPicture(): VimeoPromise<boolean, Error>;
		getAutopause(): VimeoPromise<boolean, UnsupportedError | Error>;
		setAutopause(
			autopause: boolean,
		): VimeoPromise<boolean, UnsupportedError | Error>;
		getColor(): VimeoPromise<string, Error>;
		setColor(
			color: string,
		): VimeoPromise<string, ContrastError | TypeError | Error>;
		getChapters(): VimeoPromise<VimeoChapter[], Error>;
		getCurrentChapter(): VimeoPromise<VimeoChapter, Error>;
		addCuePoint(
			time: number,
			data: VimeoCuePointData,
		): VimeoPromise<string, UnsupportedError | RangeError | Error>;
		removeCuePoint(
			id: string,
		): VimeoPromise<string, UnsupportedError | InvalidCuePoint | Error>;
		getCuePoints(): VimeoPromise<VimeoCuePoint[], UnsupportedError | Error>;
		getBuffered(): VimeoPromise<VimeoTimeRange[], Error>;
		getCurrentTime(): VimeoPromise<number, Error>;
		setCurrentTime(
			seconds: number,
		): VimeoPromise<number, RangeError | Error>;
		getDuration(): VimeoPromise<number, Error>;
		getEnded(): VimeoPromise<boolean, Error>;
		getLoop(): VimeoPromise<boolean, Error>;
		setLoop(loop: boolean): VimeoPromise<boolean, Error>;
		getMuted(): VimeoPromise<boolean, Error>;
		setMuted(muted: boolean): VimeoPromise<boolean, Error>;
		getPaused(): VimeoPromise<boolean, Error>;
		getPlayed(): VimeoPromise<VimeoTimeRange[], Error>;
		getSeekable(): VimeoPromise<VimeoTimeRange[], Error>;
		getSeeking(): VimeoPromise<boolean, Error>;
		getPlaybackRate(): VimeoPromise<number, Error>;
		setPlaybackRate(
			playbackRate: number,
		): VimeoPromise<number, RangeError | Error>;
		getTextTracks(): VimeoPromise<VimeoTextTrack[], Error>;
		getVideoEmbedCode(): VimeoPromise<string, Error>;
		getVideoId(): VimeoPromise<number, Error>;
		getVideoTitle(): VimeoPromise<string, Error>;
		getVideoWidth(): VimeoPromise<number, Error>;
		getVideoHeight(): VimeoPromise<number, Error>;
		getVideoUrl(): VimeoPromise<string, PrivacyError | Error>;
		getVolume(): VimeoPromise<number, Error>;
		setVolume(volume: number): VimeoPromise<number, RangeError | Error>;
		getQualities(): VimeoPromise<VimeoVideoQualityObject[], Error>;
		getQuality(): VimeoPromise<VimeoVideoQuality, Error>;
		setQuality(
			quality: VimeoVideoQuality,
		): VimeoPromise<VimeoVideoQuality, TypeError | Error>;
		getCameraProps(): VimeoPromise<VimeoCameraProps, Error>;
		setCameraProps(
			cameraProps: VimeoCameraProps,
		): VimeoPromise<VimeoCameraProps, RangeError | Error>;
		destroy(): VimeoPromise<void, Error>;
	}

	export interface VimeoCuePoint {
		time: number;
		data: VimeoCuePointData;
		id: string;
	}

	export interface VimeoCuePointData {
		[key: string]: any;
	}

	export interface VimeoTextTrack {
		language: string;
		kind: TrackKind;
		label: string;
		mode?: string | undefined;
	}

	export interface Options {
		id?: number | undefined;
		url?: string | undefined;
		autopause?: boolean | undefined;
		autoplay?: boolean | undefined;
		background?: boolean | undefined;
		byline?: boolean | undefined;
		color?: string | undefined;
		controls?: boolean | undefined;
		dnt?: boolean | undefined;
		height?: number | undefined;
		interactive_params?: string | undefined;
		keyboard?: boolean | undefined;
		loop?: boolean | undefined;
		maxheight?: number | undefined;
		maxwidth?: number | undefined;
		muted?: boolean | undefined;
		pip?: boolean | undefined;
		playsinline?: boolean | undefined;
		portrait?: boolean | undefined;
		responsive?: boolean | undefined;
		speed?: boolean | undefined;
		quality?: VimeoVideoQuality | undefined;
		texttrack?: string | undefined;
		title?: boolean | undefined;
		transparent?: boolean | undefined;
		width?: number | undefined;
	}

	export interface VimeoPromise<Result, Reason> extends Promise<Result> {
		(
			successCallback?: (promiseValue: Result) => void,
			rejectCallback?: (reasonValue: Reason) => void,
		): Promise<Result>;
	}
}

// Type definitions for YouTube
// Project: https://developers.google.com/youtube/
// Definitions by: Daz Wilkin <https://github.com/DazWilkin/>, Ian Obermiller <http://ianobermiller.com>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

declare namespace YT {
	interface EventArgs {
		target: Player;
		data: any;
	}

	interface EventHandler {
		(event: EventArgs): void;
	}

	export interface Events {
		onReady?: EventHandler;
		onPlayback?: EventHandler;
		onStateChange?: EventHandler;
		onError?: EventHandler;
	}

	export enum ListType {
		search,
		user_uploads,
		playlist,
	}

	export interface PlayerVars {
		autohide?: number;
		autoplay?: number;
		cc_load_policy?: any;
		color?: string;
		controls?: number;
		disablekb?: number;
		enablejsapi?: number;
		end?: number;
		fs?: number;
		iv_load_policy?: number;
		list?: string;
		listType?: ListType;
		loop?: number;
		modestbranding?: number;
		origin?: string;
		playerpiid?: string;
		playlist?: string[];
		playsinline?: number;
		rel?: number;
		showinfo?: number;
		start?: number;
		theme?: string;
	}

	export interface PlayerOptions {
		width?: string | number;
		height?: string | number;
		videoId?: string;
		playerVars?: PlayerVars;
		events?: Events;
		host?: string;
	}

	interface VideoByIdParams {
		videoId: string;
		startSeconds?: number;
		endSeconds?: number;
		suggestedQuality?: string;
	}

	interface VideoByUrlParams {
		mediaContentUrl: string;
		startSeconds?: number;
		endSeconds?: number;
		suggestedQuality?: string;
	}

	export interface VideoData {
		video_id: string;
		author: string;
		title: string;
	}

	export class Player {
		// Constructor
		constructor(id: string | HTMLElement, playerOptions: PlayerOptions);

		// Queueing functions
		loadVideoById(
			videoId: string,
			startSeconds?: number,
			suggestedQuality?: string,
		): void;
		loadVideoById(VideoByIdParams: any /* TODO */): void;
		cueVideoById(
			videoId: string,
			startSeconds?: number,
			suggestedQuality?: string,
		): void;
		cueVideoById(VideoByIdParams: any /* TODO */): void;

		loadVideoByUrl(
			mediaContentUrl: string,
			startSeconds?: number,
			suggestedQuality?: string,
		): void;
		loadVideoByUrl(VideoByUrlParams: any /* TODO */): void;
		cueVideoByUrl(
			mediaContentUrl: string,
			startSeconds?: number,
			suggestedQuality?: string,
		): void;
		cueVideoByUrl(VideoByUrlParams: any /* TODO */): void;

		// Properties
		size: any;

		// Playing
		playVideo(): void;
		pauseVideo(): void;
		stopVideo(): void;
		seekTo(seconds: number, allowSeekAhead?: boolean): void;
		clearVideo(): void;

		// Playlist
		nextVideo(): void;
		previousVideo(): void;
		playVideoAt(index: number): void;

		// Volume
		mute(): void;
		unMute(): void;
		isMuted(): boolean;
		setVolume(volume: number): void;
		getVolume(): number;

		// Sizing
		setSize(width: number, height: number): any;

		// Playback
		getPlaybackRate(): number;
		setPlaybackRate(suggestedRate: number): void;
		getAvailablePlaybackRates(): number[];

		// Behavior
		setLoop(loopPlaylists: boolean): void;
		setShuffle(shufflePlaylist: boolean): void;

		// Status
		getVideoLoadedFraction(): number;
		getPlayerState(): number;
		getCurrentTime(): number;
		getVideoStartBytes(): number;
		getVideoBytesLoaded(): number;
		getVideoBytesTotal(): number;

		// Information
		getDuration(): number;
		getVideoUrl(): string;
		getVideoEmbedCode(): string;
		getVideoData(): VideoData;

		// Playlist
		getPlaylist(): any[];
		getPlaylistIndex(): number;

		// Event Listener
		addEventListener(event: string, handler: EventHandler): void;

		// DOM
		destroy(): void;
	}

	export enum PlayerState {
		UNSTARTED,
		BUFFERING,
		CUED,
		ENDED,
		PAUSED,
		PLAYING,
	}
}

declare namespace DM {
	export type EventType =
		| 'apiready'
		| 'play'
		| 'playback_ready'
		| 'playing'
		| 'canplay'
		| 'canplaythrough'
		| 'loadedmetadata'
		| 'timeupdate'
		| 'progress'
		| 'seeking'
		| 'seeked'
		| 'volumechange'
		| 'durationchange'
		| 'controlschange'
		| 'pause'
		| 'start'
		| 'end'
		| 'video_start'
		| 'video_end'
		| 'ended'
		| 'error'
		| 'fullscreenchange'
		| 'qualitiesavailable'
		| 'qualitychange'
		| 'subtitlesavailable'
		| 'subtitlechange'
		| 'ad_start'
		| 'ad_timeupdate'
		| 'ad_play'
		| 'ad_pause'
		| 'ad_end'
		| 'videochange'
		| 'ad_companions';

	export class player {
		constructor(
			container: HTMLDivElement,
			{
				width,
				height,
				video,
				events,
			}: {
				width: string;
				height: string;
				video: string;
				events?: {
					apiready(): void;
					seeked(): void;
					video_end(): void;
					durationchange(): void;
					pause(): void;
					playing(): void;
					waiting(): void;
					error(event): void;
				};
			},
		);

		load(video: string): void;
		play(): void;
		pause(): void;
		seek(second: number): void;
		setVolume(volume: number): void;
		setMuted(muted: boolean): void;
		readonly duration: number;
		readonly currentTime: number;
		readonly volume: number;
		readonly video: { videoId: string };

		addEventListener(
			event: EventType,
			listener: (e: { type: EventType }) => void,
		);
		removeEventListener(
			event: EventType,
			listener: (e: { type: EventType }) => void,
		);
	}
}

declare namespace Twitch {
	export interface PlaybackStats {
		readonly backendVersion: string;
		readonly bufferSize: number;
		readonly codecs: string;
		readonly displayResolution: string;
		readonly fps: number;
		readonly hlsLatencyBroadcaster: number;
		readonly playbackRate: number;
		readonly skippedFrames: number;
		readonly videoResolution: string;
	}

	export class Player {
		static readonly READY: number;
		static readonly PLAYING: number;
		static readonly PAUSE: number;
		static readonly ENDED: number;
		static readonly SEEK: number;

		constructor(
			playerDivId: HTMLDivElement,
			options: (
				| { channel: string }
				| { video: string }
				| { collection: string }
			) & {
				width: number | string;
				height: number | string;
				parent?: string[];
				autoplay?: boolean;
				muted?: boolean;
				time?: string;
			},
		);

		pause(): void;
		play(): void;
		seek(timestamp: number): void;
		setChannel(channel: string): void;
		setCollection(collectionId: string, videoId: string): void;
		setQuality(quality: string): void;
		setVideo(videoId: string, timestamp: number): void;
		getMuted(): boolean;
		setMuted(muted: boolean): void;
		getVolume(): number;
		setVolume(volumelevel: number): void;
		getPlaybackStats(): PlaybackStats;
		getChannel(): string;
		getCurrentTime(): number;
		getDuration(): number;
		getQualities(): readonly string[];
		getQuality(): string;
		getVideo(): string;
		isPaused(): boolean;

		addEventListener(
			event: READY | PLAYING | PAUSE | ENDED | SEEK,
			listener: () => void,
		): void;
	}
}
