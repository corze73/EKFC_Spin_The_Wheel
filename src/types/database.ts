export interface Player {
  id: string;
  name: string;
  created_at: string;
}

export interface SpinResult {
  id: string;
  player_name: string;
  result: string;
  timestamp: string;
  created_at: string;
}