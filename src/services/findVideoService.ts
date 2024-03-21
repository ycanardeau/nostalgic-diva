import { AudioVideoService } from './AudioVideoService';
import { DailymotionVideoService } from './DailymotionVideoService';
import { NiconicoVideoService } from './NiconicoVideoService';
import { SoundCloudVideoService } from './SoundCloudVideoService';
import { TwitchVideoService } from './TwitchVideoService';
import { VimeoVideoService } from './VimeoVideoService';
import { YouTubeVideoService } from './YouTubeVideoService';

const videoServices = [
	new AudioVideoService(),
	new DailymotionVideoService(),
	new NiconicoVideoService(),
	new SoundCloudVideoService(),
	new TwitchVideoService(),
	new VimeoVideoService(),
	new YouTubeVideoService(),
] as const;

export function findVideoService(
	url: string,
): (typeof videoServices)[number] | undefined {
	return videoServices.find((videoService) => videoService.canPlay(url));
}
