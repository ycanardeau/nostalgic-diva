import {
	IPlayerCommands,
	IPlayerController,
} from '@/controllers/PlayerController';

class NullPlayerController implements IPlayerController {
	async attach(): Promise<void> {}

	async detach(): Promise<void> {}

	async loadVideo(id: string): Promise<void> {}

	async play(): Promise<void> {}

	async pause(): Promise<void> {}

	async setCurrentTime(seconds: number): Promise<void> {}

	async setVolume(volume: number): Promise<void> {}

	async setMuted(muted: boolean): Promise<void> {}

	async setPlaybackRate(playbackRate: number): Promise<void> {}

	async getDuration(): Promise<number | undefined> {
		return undefined;
	}

	async getCurrentTime(): Promise<number | undefined> {
		return undefined;
	}

	async getVolume(): Promise<number | undefined> {
		return undefined;
	}

	async getPlaybackRate(): Promise<number | undefined> {
		return undefined;
	}

	supports(command: keyof IPlayerCommands): boolean {
		return false;
	}
}

export const nullPlayerController = new NullPlayerController();
