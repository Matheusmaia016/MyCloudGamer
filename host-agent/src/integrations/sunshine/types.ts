export interface SunshineLaunchRequest {
  gameId: string;
  executablePath?: string;
}

export interface SunshineLaunchResult {
  streamReady: boolean;
  hostAddress: string;
  moonlightUri: string;
  notes: string;
}
