import { nullPlayerController } from '@/controllers/NullPlayerController';
import React from 'react';
import ReactDOM from 'react-dom';

import {
	IPlayerCommands,
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
	controller: IPlayerController = nullPlayerController;

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

	readonly #options: PlayerOptions = {
		onError: (e) =>
			this.dispatchEvent(new CustomEvent('error', { detail: e })),
		onLoaded: (e) =>
			this.dispatchEvent(new CustomEvent('loaded', { detail: e })),
		onPlay: () => this.dispatchEvent(new CustomEvent('play')),
		onPause: () => this.dispatchEvent(new CustomEvent('pause')),
		onEnded: () => this.dispatchEvent(new CustomEvent('ended')),
		onTimeUpdate: (e) =>
			this.dispatchEvent(new CustomEvent('timeupdate', { detail: e })),
	};

	#handleControllerChange = (value: IPlayerController): void => {
		console.debug(
			'[@nostalgic-diva/web-components] handleControllerChange',
		);

		this.controller = value;
	};

	#render(): void {
		ReactDOM.render(
			<NostalgicDiva
				src={this.src}
				options={this.#options}
				onControllerChange={this.#handleControllerChange}
			/>,
			this.container,
		);
	}

	connectedCallback(): void {
		console.debug('[@nostalgic-diva/web-components] connectedCallback');

		this.#render();
	}

	disconnectedCallback(): void {
		console.debug('[@nostalgic-diva/web-components] disconnectedCallback');
	}

	attributeChangedCallback(): void {
		console.debug(
			'[@nostalgic-diva/web-components] attributeChangedCallback',
		);

		this.#render();
	}

	async loadVideo(id: string): Promise<void> {
		await this.controller.loadVideo(id);
	}

	async play(): Promise<void> {
		await this.controller.play();
	}

	async pause(): Promise<void> {
		await this.controller.pause();
	}

	async setCurrentTime(seconds: number): Promise<void> {
		await this.controller.setCurrentTime(seconds);
	}

	async setVolume(volume: number): Promise<void> {
		await this.controller.setVolume(volume);
	}

	async setMuted(muted: boolean): Promise<void> {
		await this.controller.setMuted(muted);
	}

	async setPlaybackRate(playbackRate: number): Promise<void> {
		await this.controller.setPlaybackRate(playbackRate);
	}

	async getDuration(): Promise<number> {
		return await this.controller.getDuration();
	}

	async getCurrentTime(): Promise<number> {
		return await this.controller.getCurrentTime();
	}

	async getVolume(): Promise<number> {
		return await this.controller.getVolume();
	}

	async getPlaybackRate(): Promise<number> {
		return await this.controller.getPlaybackRate();
	}

	supports(command: keyof IPlayerCommands): boolean {
		return this.controller.supports(command);
	}
}

export function defineNostalgicDiva(): void {
	customElements.define('nostalgic-diva', NostalgicDivaElement);
}
