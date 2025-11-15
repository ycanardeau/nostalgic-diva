import { ILogger, LogLevel } from './Logger';
import { IPlayerController, PlayerOptions } from './PlayerController';

export abstract class PlayerControllerImpl<TPlayer>
	implements IPlayerController
{
	constructor(
		protected readonly logger: ILogger,
		protected readonly player: TPlayer,
		protected readonly options: PlayerOptions | undefined,
	) {
		this.logger.log(LogLevel.Debug, 'ctor');
	}

	abstract attach(id: string): Promise<void>;
	abstract detach(): Promise<void>;
	abstract loadVideo(id: string): Promise<void>;
	abstract play(): Promise<void>;
	abstract pause(): Promise<void>;
	abstract setCurrentTime(seconds: number): Promise<void>;
	abstract setVolume(volume: number): Promise<void>;
	abstract setMuted(muted: boolean): Promise<void>;
	abstract setPlaybackRate(playbackRate: number): Promise<void>;
	abstract getDuration(): Promise<number | undefined>;
	abstract getCurrentTime(): Promise<number | undefined>;
	abstract getVolume(): Promise<number | undefined>;
	abstract getPlaybackRate(): Promise<number | undefined>;
}
