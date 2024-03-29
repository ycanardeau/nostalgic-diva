import { ILogger, LogLevel } from './Logger';
import { PlayerControllerImpl } from './PlayerControllerImpl';

export enum PlayerType {
	'Audio' = 'Audio',
	'Dailymotion' = 'Dailymotion',
	'Niconico' = 'Niconico',
	'SoundCloud' = 'SoundCloud',
	'Twitch' = 'Twitch',
	'Vimeo' = 'Vimeo',
	'YouTube' = 'YouTube',
}

export function validatePlayerType(value: string): value is PlayerType {
	return PlayerType[value as keyof typeof PlayerType] !== undefined;
}

export interface LoadedEvent {
	id: string;
}

export interface TimeEvent {
	duration: number | undefined;
	percent: number | undefined;
	seconds: number | undefined;
}

export interface PlayerOptions {
	onError?(event: any): void;
	onLoaded?(event: LoadedEvent): void;
	onPlay?(): void;
	onPause?(): void;
	onEnded?(): void;
	onTimeUpdate?(event: TimeEvent): void;
}

export interface IPlayerController {
	loadVideo(id: string): Promise<void>;
	play(): Promise<void>;
	pause(): Promise<void>;
	setCurrentTime(seconds: number): Promise<void>;
	setVolume(volume: number): Promise<void>;
	setMuted(muted: boolean): Promise<void>;
	setPlaybackRate(playbackRate: number): Promise<void>;
	getDuration(): Promise<number | undefined>;
	getCurrentTime(): Promise<number | undefined>;
	getVolume(): Promise<number | undefined>;
	getPlaybackRate(): Promise<number | undefined>;
}

export class PlayerController<
	TPlayer extends object,
	TController extends PlayerControllerImpl<TPlayer>,
> implements IPlayerController
{
	private static nextId = 1;

	private readonly id: number;
	private impl?: TController;

	constructor(
		private readonly logger: ILogger,
		private readonly type: PlayerType,
		private readonly player: TPlayer,
		private readonly options: PlayerOptions | undefined,
		private readonly controllerFactory: new (
			logger: ILogger,
			player: TPlayer,
			options: PlayerOptions | undefined,
		) => TController,
	) {
		this.id = PlayerController.nextId++;
	}

	private createMessage(message: any): string {
		return `${this.type}#${this.id} ${message}`;
	}

	public debug(message?: any, ...optionalParams: any): void {
		this.logger.log(
			LogLevel.Debug,
			this.createMessage(message),
			...optionalParams,
		);
	}

	public error(message?: any, ...optionalParams: any): void {
		this.logger.log(
			LogLevel.Error,
			this.createMessage(message),
			...optionalParams,
		);
	}

	async attach(id: string): Promise<void> {
		this.debug('attach', id);

		if (this.impl) {
			this.debug('player is already attached');
			return;
		}

		this.debug('Attaching player...');

		this.impl = new this.controllerFactory(
			this.logger,
			this.player,
			this.options,
		);

		await this.impl.attach(id);

		this.debug('player attached');
	}

	private createPlayerNotAttachedError(): Error {
		return new Error('player is not attached');
	}

	async detach(): Promise<void> {
		this.debug('detach');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		await this.impl.detach();

		this.impl = undefined;
	}

	async loadVideo(id: string): Promise<void> {
		this.debug('loadVideo', id);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		this.debug('Loading video...');

		await this.impl.loadVideo(id);

		this.debug('video loaded', id);
	}

	play(): Promise<void> {
		this.debug('play');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.play();
	}

	pause(): Promise<void> {
		this.debug('pause');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.pause();
	}

	setCurrentTime(seconds: number): Promise<void> {
		this.debug('setCurrentTime', seconds);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.setCurrentTime(seconds);
	}

	setVolume(volume: number): Promise<void> {
		this.debug('setVolume', volume);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.setVolume(volume);
	}

	setMuted(muted: boolean): Promise<void> {
		this.debug('setMuted', muted);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.setMuted(muted);
	}

	setPlaybackRate(playbackRate: number): Promise<void> {
		this.debug('setPlaybackRate', playbackRate);

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.setPlaybackRate(playbackRate);
	}

	getDuration(): Promise<number | undefined> {
		this.debug('getDuration');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.getDuration();
	}

	getCurrentTime(): Promise<number | undefined> {
		this.debug('getCurrentTime');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.getCurrentTime();
	}

	getVolume(): Promise<number | undefined> {
		this.debug('getVolume');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.getVolume();
	}

	getPlaybackRate(): Promise<number | undefined> {
		this.debug('getPlaybackRate');

		if (this.impl === undefined) {
			throw this.createPlayerNotAttachedError();
		}

		return this.impl.getPlaybackRate();
	}
}
