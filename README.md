# Nostalgic Diva

React function components for imperatively controlling embedded players (audio, [Niconico](https://www.nicovideo.jp/), [SoundCloud](https://soundcloud.com/) and [YouTube](https://www.youtube.com/)) using refs.

This was originally developed in [VocaDB/vocadb#1101](https://github.com/VocaDB/vocadb/pull/1101) as a part of [VocaDB](https://github.com/VocaDB/vocadb).

## Live demo

See [VocaDB](https://vocadb.net/) and [its playlist page](https://vocadb.net/playlist).

## Installation

`yarn add @vocadb/nostalgic-diva` or `npm i @vocadb/nostalgic-diva`

## Usage

See [VocaDB/vocadb#1101](https://github.com/VocaDB/vocadb/pull/1101) for more information.

```tsx
import {
    NostalgicDiva,
    PVPlayerOptions,
    PVService,
} from '@vocadb/nostalgic-diva';
```

```tsx
// Ref
const playerRef = React.useRef<PVPlayer>(undefined!);

// Callbacks
const handleError = React.useCallback(() => {}, []);
const handlePlay = React.useCallback(() => {}, []);
const handlePause = React.useCallback(() => {}, []);
const handleEnded = React.useCallback(() => {}, []);
const handleTimeUpdate = React.useCallback(() => {}, []);

// Options
const options = React.useMemo(
    () => ({
        onError: handleError,
        onPlay: handlePlay,
        onPause: handlePause,
        onEnded: handleEnded,
        onTimeUpdate: handleTimeUpdate,
    }),
    [handleError, handlePlay, handlePause, handleEnded, handleTimeUpdate],
);

const handlePlayerChange = React.useCallback((player?: PVPlayer) => {}, [])

// Audio
<NostalgicDiva
    service={PVService.File}
    playerRef={playerRef}
    options={options}
    onPlayerChange={handlePlayerChange}
/>;

// Niconico
<NostalgicDiva
    service={PVService.Niconico}
    playerRef={playerRef}
    options={options}
    onPlayerChange={handlePlayerChange}
/>;

// SoundCloud
<NostalgicDiva
    service={PVService.SoundCloud}
    playerRef={playerRef}
    options={options}
    onPlayerChange={handlePlayerChange}
/>;

// YouTube
<NostalgicDiva
    service={PVService.YouTube}
    playerRef={playerRef}
    options={options}
    onPlayerChange={handlePlayerChange}
/>;
```

```tsx
const player = playerRef.current;

if (!player) return;

// Load
await player.loadVideo(id);

// Play
await player.play();

// Pause
await player.pause();

// Mute
await player.setMuted(true);

// Unmute
await player.setMuted(false);
```

## Imperative functions

| Function | Description |
| --- | --- |
| `loadVideo(id: string): Promise<void>` | Loads the specified video. |
| `play(): Promise<void>` | Plays the currently loaded video. |
| `pause(): Promise<void>` | Pauses the currently loaded video. |
| `setCurrentTime(seconds: number): Promise<void>` | Seeks to a specified time in the video. |
| `setVolume(volume: number): Promise<void>` | Sets the volume. Accepts a number between 0 and 1. |
| `setMuted(muted: boolean): Promise<void>` | Sets the muted state of the player. |
| `getDuration(): Promise<number \| undefined>` | Returns the duration in seconds of the current media resource. |
| `getCurrentTime(): Promise<number \| undefined>` | Gets the current playback position, in seconds. |

## Events

| Event | Description |
| --- | --- |
| `onError(event: any): void` | Fired when an error occurs in the player. |
| `onPlay(): void` | Fired when the sound begins to play. |
| `onPause(): void` | Fired when the sound pauses. |
| `onEnded(): void` | Fired when the sound finishes. |
| `onTimeUpdate(event: TimeEvent): void` | |

## Lifecycle

1. [PVPlayer.attach](https://github.com/VocaDB/nostalgic-diva/blob/daaffb0d1597c78062da306370d7fb854106b43c/src/players/PVPlayer.ts#L27)
1. [onPlayerChange](https://github.com/VocaDB/nostalgic-diva/blob/84307a7cc1eb1e72f1bd69eb056efd79ce819d84/src/components/EmbedPV.tsx#L9)
1. [PVPlayer.loadVideo](https://github.com/VocaDB/nostalgic-diva/blob/daaffb0d1597c78062da306370d7fb854106b43c/src/players/PVPlayer.ts#L29)
1. [PVPlayer.play](https://github.com/VocaDB/nostalgic-diva/blob/daaffb0d1597c78062da306370d7fb854106b43c/src/players/PVPlayer.ts#L30)
1. [PVPlayerOptions.onPlay](https://github.com/VocaDB/nostalgic-diva/blob/daaffb0d1597c78062da306370d7fb854106b43c/src/players/PVPlayer.ts#L16)
1. [PVPlayerOptions.onTimeUpdate](https://github.com/VocaDB/nostalgic-diva/blob/76dc9b60e080a22e91bdd3f1dd39708d7b570628/src/players/PVPlayer.ts#L25)
1. [PVPlayer.pause](https://github.com/VocaDB/nostalgic-diva/blob/daaffb0d1597c78062da306370d7fb854106b43c/src/players/PVPlayer.ts#L31)
1. [PVPlayerOptions.onPause](https://github.com/VocaDB/nostalgic-diva/blob/daaffb0d1597c78062da306370d7fb854106b43c/src/players/PVPlayer.ts#L17)
1. [PVPlayerOptions.onEnded](https://github.com/VocaDB/nostalgic-diva/blob/daaffb0d1597c78062da306370d7fb854106b43c/src/players/PVPlayer.ts#L18)
1. [PVPlayer.detach](https://github.com/VocaDB/nostalgic-diva/blob/daaffb0d1597c78062da306370d7fb854106b43c/src/players/PVPlayer.ts#L28)

The `attach` function is called when switching from another player (Audio, Niconico, SoundCloud and YouTube), and the `detach` function is called when switching to another player. After the `detach` function is called, you cannot use any imperative functions like `loadVideo`, `play`, `pause` and etc.

## References

-   [vocadb/VocaDbWeb/Scripts/ViewModels/PVs/](https://github.com/VocaDB/vocadb/tree/5304e764cf423f07b424e94266e415db40d11f28/VocaDbWeb/Scripts/ViewModels/PVs)
-   [React Player](https://github.com/cookpete/react-player)
-   [ニコニコ動画の HTML5 外部プレイヤーを JavaScript で操作する](https://blog.hayu.io/web/create/nicovideo-embed-player-api/)
-   [Widget API - SoundCloud Developers](https://developers.soundcloud.com/docs/api/html5-widget)
-   [YouTube Player API Reference for iframe Embeds | YouTube IFrame Player API | Google Developers](https://developers.google.com/youtube/iframe_api_reference)
-   [How to support Reusable State in Effects · Discussion #18 · reactwg/react-18](https://github.com/reactwg/react-18/discussions/18)
-   [Synchronizing with Effects](https://beta.reactjs.org/learn/synchronizing-with-effects#how-to-handle-the-effect-firing-twice-in-development)
