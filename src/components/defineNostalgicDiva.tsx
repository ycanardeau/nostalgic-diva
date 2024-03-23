import React from 'react';
import ReactDOM from 'react-dom';

import {
	IPlayerController,
	PlayerOptions,
} from '../controllers/PlayerController';
import { NostalgicDiva } from './NostalgicDiva';

export class NostalgicDivaElement
	extends HTMLElement
	implements IPlayerController
{
	static readonly observedAttributes = ['src'];

	container: ShadowRoot;
	controller: IPlayerController | undefined;

	constructor() {
		super();

		this.container = this.attachShadow({ mode: 'closed' });
	}

	get src(): string {
		return this.getAttribute('src') ?? '';
	}

	set src(value: string) {
		this.setAttribute('src', value);
	}

	#render(): void {
		const options: PlayerOptions = {
			onError: (e) =>
				this.dispatchEvent(new CustomEvent('error', { detail: e })),
			onLoaded: (e) =>
				this.dispatchEvent(new CustomEvent('loaded', { detail: e })),
			onPlay: () => this.dispatchEvent(new CustomEvent('play')),
			onPause: () => this.dispatchEvent(new CustomEvent('pause')),
			onEnded: () => this.dispatchEvent(new CustomEvent('ended')),
			onTimeUpdate: (e) =>
				this.dispatchEvent(
					new CustomEvent('timeupdate', { detail: e }),
				),
		};

		const handleControllerChange = (
			value: IPlayerController | undefined,
		): void => {
			this.controller = value;
		};

		ReactDOM.render(
			<NostalgicDiva
				src={this.src}
				options={options}
				onControllerChange={handleControllerChange}
			/>,
			this.container,
		);
	}

	connectedCallback(): void {
		console.debug('[@nostalgic-diva/web-components] connected');

		this.#render();
	}

	disconnectedCallback(): void {
		console.debug('[@nostalgic-diva/web-components] disconnected');
	}

	attributeChangedCallback(): void {
		console.debug('[@nostalgic-diva/web-components] attributeChanged');

		this.#render();
	}

	async loadVideo(id: string): Promise<void> {
		await this.controller?.loadVideo(id);
	}

	async play(): Promise<void> {
		await this.controller?.play();
	}

	async pause(): Promise<void> {
		await this.controller?.pause();
	}

	async setCurrentTime(seconds: number): Promise<void> {
		await this.controller?.setCurrentTime(seconds);
	}

	async setVolume(volume: number): Promise<void> {
		await this.controller?.setVolume(volume);
	}

	async setMuted(muted: boolean): Promise<void> {
		await this.controller?.setMuted(muted);
	}

	async setPlaybackRate(playbackRate: number): Promise<void> {
		await this.controller?.setPlaybackRate(playbackRate);
	}

	async getDuration(): Promise<number | undefined> {
		return await this.controller?.getDuration();
	}

	async getCurrentTime(): Promise<number | undefined> {
		return await this.controller?.getCurrentTime();
	}

	async getVolume(): Promise<number | undefined> {
		return await this.controller?.getVolume();
	}

	async getPlaybackRate(): Promise<number | undefined> {
		return await this.controller?.getPlaybackRate();
	}
}

export function defineNostalgicDiva(): void {
	customElements.define('nostalgic-diva', NostalgicDivaElement);
}
