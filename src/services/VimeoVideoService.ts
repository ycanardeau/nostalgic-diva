import { PlayerType } from '@/controllers/PlayerController';
import { VideoService } from '@/services/VideoService';

// https://github.com/cookpete/react-player/blob/258fce939638a295f6a429ad683935254d1bfda2/src/patterns.ts#L10
const MATCH_URL_VIMEO = /vimeo\.com\/(?!progressive_redirect).+/;

export class VimeoVideoService extends VideoService<PlayerType.Vimeo> {
	constructor() {
		super(PlayerType.Vimeo);
	}

	canPlay(url: string): boolean {
		return MATCH_URL_VIMEO.test(url);
	}

	extractVideoId(url: string): string | undefined {
		return MATCH_URL_VIMEO.exec(url)?.[1];
	}
}
