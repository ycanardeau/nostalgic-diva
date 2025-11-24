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

	async getDuration(): Promise<number> {
		return 0;
	}

	async getCurrentTime(): Promise<number> {
		return 0;
	}

	async getVolume(): Promise<number> {
		return 0;
	}

	async getPlaybackRate(): Promise<number> {
		return 0;
	}

	supports(command: keyof IPlayerCommands): boolean {
		return false;
	}
}

export const nullPlayerController = new NullPlayerController();
