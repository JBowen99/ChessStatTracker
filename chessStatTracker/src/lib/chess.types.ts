export type TimeClass = 'bullet' | 'blitz' | 'rapid' | 'daily' | string;

export type PlayerResult =
	| 'win'
	| 'checkmated'
	| 'timeout'
	| 'resigned'
	| 'abandoned'
	| 'agreed'
	| 'repetition'
	| 'stalemate'
	| 'insufficient'
	| 'timevsinsufficient'
	| string;

export interface GamePlayer {
	username: string;
	rating: number;
	result: PlayerResult;
}

export interface ChessGame {
	end_time: number;
	time_class: TimeClass;
	pgn: string;
	white: GamePlayer;
	black: GamePlayer;
}

export interface YearMonth {
	year: string;
	month: string;
}

export interface GameDataBundle {
	currentMonth: ChessGame[];
	threeMonths: ChessGame[];
	sixMonths: ChessGame[];
	year: ChessGame[];
}

export interface ChartColor {
	backgroundColor: string;
	hoverBackgroundColor: string;
}

export interface ResultCount {
	type: string;
	count: number;
	color?: ChartColor;
}

export interface OpeningStat {
	opening: string;
	winRate: number;
	whiteWinRate: number;
	blackWinRate: number;
	gamesPlayed: number;
	whiteGames: number;
	blackGames: number;
	wins: number;
}

export interface RivalStat {
	opponent: string;
	result: string;
	stats: {
		wins: number;
		losses: number;
		total: number;
	};
}

export interface RatingDataPoint {
	date: string;
	rating: number;
	activity: number;
	winRate: number;
	drawRate: number;
	lossRate: number;
}

export interface RecentGame {
	date: string;
	rating: number;
	ratingOpponent: number;
	result: PlayerResult;
	time_class: TimeClass;
	color: 'white' | 'black';
	opening: string | null;
}

export interface ActivityDay {
	day: number;
	activity: number;
	winRate: number;
	drawRate?: number;
	lossRate?: number;
}
