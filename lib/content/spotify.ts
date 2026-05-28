import type { Track } from "./types";

const DUMMY: Track[] = [
  {
    title: "Redbone",
    artist: "Childish Gambino",
    album: "Awaken, My Love!",
    albumArt: "https://i.scdn.co/image/ab67616d0000b27355e171b1247c5958e72d8a01",
    playedAt: "2026-05-26T14:12:00Z",
    url: "https://open.spotify.com/track/0vBeIl2t9dDLBkKpgw5VV2",
  },
  {
    title: "Nights",
    artist: "Frank Ocean",
    album: "Blonde",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526",
    playedAt: "2026-05-26T13:54:00Z",
    url: "https://open.spotify.com/track/7eqoqGkKwgOaWNNHx90uEZ",
  },
  {
    title: "Sunflower",
    artist: "Rex Orange County",
    album: "Apricot Princess",
    albumArt: "https://i.scdn.co/image/ab67616d0000b273e15dde755366a3a972ea2e95",
    playedAt: "2026-05-26T13:30:00Z",
    url: "https://open.spotify.com/track/3Vi5XqYrmQgOYBajMWSvCi",
  },
  {
    title: "The Less I Know The Better",
    artist: "Tame Impala",
    album: "Currents",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2739e1cfc756886ac21pc",
    playedAt: "2026-05-26T12:58:00Z",
    url: "https://open.spotify.com/track/6K4t31amVTZDgR3sKmwUJJ",
  },
  {
    title: "Time",
    artist: "Pink Floyd",
    album: "The Dark Side of the Moon",
    albumArt: "https://i.scdn.co/image/ab67616d0000b2733e0e2c0e0c0a7f7d63d6b1a3",
    playedAt: "2026-05-26T12:24:00Z",
    url: "https://open.spotify.com/track/3TO7bbrUKrOSPGRTB5MeCz",
  },
];

export async function getRecentlyPlayed(limit = 5): Promise<Track[]> {
  return DUMMY.slice(0, limit);
}
