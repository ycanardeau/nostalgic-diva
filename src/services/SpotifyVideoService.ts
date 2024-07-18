import { PlayerType } from '@/controllers';

import { VideoService } from './VideoService';

const MATCH_URL_SPOTIFY = /(?:open\.|)?spotify\.com\/episode\/(\w+)$/;

export class SpotifyVideoService extends VideoService<PlayerType.Spotify> {
	constructor() {
		super(PlayerType.Spotify);
	}

	canPlay(url: string): boolean {
		return MATCH_URL_SPOTIFY.test(url);
	}

	extractVideoId(url: string): string | undefined {
		return url;
	}
}
