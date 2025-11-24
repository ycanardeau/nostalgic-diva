import { PlayerType } from '@/controllers/PlayerController';
import { VideoService } from '@/services/VideoService';

// https://github.com/cookpete/react-player/blob/258fce939638a295f6a429ad683935254d1bfda2/src/patterns.ts#L14
const MATCH_URL_TWITCH =
	/(?:www\.|go\.)?twitch\.tv\/([a-zA-Z0-9_]+|(videos?\/|\?video=)\d+)($|\?)/;

export class TwitchVideoService extends VideoService<PlayerType.Twitch> {
	constructor() {
		super(PlayerType.Twitch);
	}

	canPlay(url: string): boolean {
		return MATCH_URL_TWITCH.test(url);
	}

	extractVideoId(url: string): string | undefined {
		const matches = MATCH_URL_TWITCH.exec(url);
		return matches?.[1];
	}
}
