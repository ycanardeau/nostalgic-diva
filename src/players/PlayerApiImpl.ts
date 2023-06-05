import { ILogger, LogLevel } from './ILogger';
import { IPlayerApi, PlayerOptions } from './PlayerApi';

export abstract class PlayerApiImpl<TPlayer> implements IPlayerApi {
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
	abstract getDuration(): Promise<number | undefined>;
	abstract getCurrentTime(): Promise<number | undefined>;
	abstract getVolume(): Promise<number | undefined>;
}
