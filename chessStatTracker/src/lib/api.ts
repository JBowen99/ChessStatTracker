import type {
	ChessGame,
	ChartColor,
	GameDataBundle,
	OpeningStat,
	PlayerResult,
	RatingDataPoint,
	RecentGame,
	ResultCount,
	RivalStat,
	TimeClass,
	YearMonth
} from './chess.types';

export type ChessApiErrorCode = 'invalid' | 'not_found' | 'network' | 'unknown';

export class ChessApiError extends Error {
	code: ChessApiErrorCode;

	constructor(message: string, code: ChessApiErrorCode) {
		super(message);
		this.name = 'ChessApiError';
		this.code = code;
	}
}

function playerUrl(username: string, path = ''): string {
	return `https://api.chess.com/pub/player/${encodeURIComponent(username)}${path}`;
}

async function fetchChessJson<T>(
	url: string,
	notFoundMessage: string,
	signal?: AbortSignal,
	timeoutMs = 15000
): Promise<T> {
	const timeoutController = new AbortController();
	const timeoutId = setTimeout(() => timeoutController.abort(), timeoutMs);

	if (signal) {
		if (signal.aborted) {
			clearTimeout(timeoutId);
			throw new DOMException('Aborted', 'AbortError');
		}
		signal.addEventListener('abort', () => timeoutController.abort(), { once: true });
	}

	try {
		const response = await fetch(url, { signal: timeoutController.signal });
		if (response.status === 404) {
			throw new ChessApiError(notFoundMessage, 'not_found');
		}
		if (!response.ok) {
			throw new ChessApiError('Could not reach Chess.com. Please try again later.', 'network');
		}

		const data: unknown = await response.json();
		if (
			data &&
			typeof data === 'object' &&
			'code' in data &&
			(data as { code: number }).code === 0
		) {
			const message =
				'message' in data && typeof (data as { message: unknown }).message === 'string'
					? (data as { message: string }).message
					: notFoundMessage;
			throw new ChessApiError(message, 'not_found');
		}

		return data as T;
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') {
			throw error;
		}
		if (error instanceof ChessApiError) {
			throw error;
		}
		throw new ChessApiError(
			'Could not reach Chess.com. Check your connection and try again.',
			'network'
		);
	} finally {
		clearTimeout(timeoutId);
	}
}

export async function fetchUserStats(
	username: string,
	signal?: AbortSignal
): Promise<Record<string, unknown>> {
	return fetchChessJson(
		playerUrl(username, '/stats'),
		'Could not load stats for this player.',
		signal
	);
}

export async function fetchUserProfile(
	username: string,
	signal?: AbortSignal
): Promise<Record<string, unknown>> {
	const trimmed = username.trim();
	if (!trimmed) {
		throw new ChessApiError('Please enter a Chess.com username.', 'invalid');
	}

	const profile = await fetchChessJson<Record<string, unknown>>(
		playerUrl(trimmed),
		`"${trimmed}" was not found on Chess.com. Check the spelling and try again.`,
		signal
	);

	if (!profile.username && !profile.player_id) {
		throw new ChessApiError(
			`"${trimmed}" was not found on Chess.com. Check the spelling and try again.`,
			'not_found'
		);
	}

	return profile;
}

export async function fetchMonthlyGames(
	username: string,
	year: string,
	month: string,
	signal?: AbortSignal
): Promise<ChessGame[]> {
	const gameData = await fetchChessJson<{ games: ChessGame[] }>(
		playerUrl(username, `/games/${year}/${month}`),
		'Failed to fetch games',
		signal
	);
	return gameData.games ?? [];
}

function extractYearAndMonth(urls: string[]): YearMonth[] {
	return urls.map((url) => {
		const parts = url.split('/');
		const year = parts[parts.length - 2];
		const month = parts[parts.length - 1];
		return { year, month };
	});
}

export async function fetchGamesArchive(
	username: string,
	signal?: AbortSignal
): Promise<YearMonth[]> {
	const data = await fetchChessJson<{ archives?: string[] }>(
		playerUrl(username, '/games/archives'),
		'Failed to fetch game archives.',
		signal
	);
	return extractYearAndMonth(data.archives ?? []);
}

export async function fetchGamesForAllMonths(
	username: string,
	yearMonthArray: YearMonth[]
): Promise<ChessGame[]> {
	const gamesArray: ChessGame[] = [];

	for (const { year, month } of yearMonthArray) {
		const games = await fetchMonthlyGames(username, year, month);
		gamesArray.push(...games);
	}

	return gamesArray;
}

function getPreviousMonthYear(monthOffset = 0): YearMonth {
	const currentDate = new Date();
	currentDate.setMonth(currentDate.getMonth() - monthOffset);
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const year = String(currentDate.getFullYear());
	return { month, year };
}

export async function fetchGameData(
	username: string,
	signal?: AbortSignal
): Promise<GameDataBundle> {
	const recentMonths = Array.from({ length: 12 }, (_, i) => getPreviousMonthYear(i));
	const monthData: Record<string, ChessGame[]> = Object.fromEntries(
		recentMonths.map(({ year, month }) => [`${year}-${month}`, []])
	);

	let archives: YearMonth[] = [];
	try {
		archives = await fetchGamesArchive(username, signal);
	} catch (error) {
		if (error instanceof DOMException && error.name === 'AbortError') {
			throw error;
		}
	}

	const archiveKeys = new Set(archives.map(({ year, month }) => `${year}-${month}`));
	const monthsToFetch = recentMonths.filter(({ year, month }) =>
		archiveKeys.has(`${year}-${month}`)
	);

	await Promise.all(
		monthsToFetch.map(async ({ year, month }) => {
			const key = `${year}-${month}`;
			try {
				monthData[key] = await fetchMonthlyGames(username, year, month, signal);
			} catch (error) {
				if (error instanceof DOMException && error.name === 'AbortError') {
					throw error;
				}
				monthData[key] = [];
			}
		})
	);

	const currentMonthKey = `${getPreviousMonthYear(0).year}-${getPreviousMonthYear(0).month}`;
	const currentMonthData = [...(monthData[currentMonthKey] ?? [])];

	const threeMonthsData: ChessGame[] = [];
	for (let i = 0; i < 3; i++) {
		const { month, year } = getPreviousMonthYear(i);
		threeMonthsData.push(...(monthData[`${year}-${month}`] ?? []));
	}

	const sixMonthsData: ChessGame[] = [];
	for (let i = 0; i < 6; i++) {
		const { month, year } = getPreviousMonthYear(i);
		sixMonthsData.push(...(monthData[`${year}-${month}`] ?? []));
	}

	const yearData: ChessGame[] = [];
	for (let i = 0; i < 12; i++) {
		const { month, year } = getPreviousMonthYear(i);
		yearData.push(...(monthData[`${year}-${month}`] ?? []));
	}

	return {
		currentMonth: currentMonthData,
		threeMonths: threeMonthsData,
		sixMonths: sixMonthsData,
		year: yearData
	};
}

function analyzeResult(result: PlayerResult, other: PlayerResult): string {
	if (result === 'win') {
		if (other === 'checkmated') return 'win by checkmate';
		if (other === 'timeout') return 'win by timeout';
		if (other === 'resigned' || other === 'abandoned') return 'win by resignation/abandonment';
	} else if (result === 'checkmated') {
		return 'loss by checkmate';
	} else if (result === 'timeout') {
		return 'loss by timeout';
	} else if (result === 'resigned' || result === 'abandoned') {
		return 'loss by resignation/abandonment';
	} else if (result === 'agreed') {
		return 'draw by agreement';
	} else if (result === 'repetition') {
		return 'draw by repetition';
	} else if (result === 'stalemate') {
		return 'stalemate';
	} else if (result === 'insufficient' || result === 'timevsinsufficient') {
		return 'insufficient material';
	}

	return 'unknown result';
}

function analyzeColor(result: string): ChartColor | undefined {
	if (result === 'win by checkmate')
		return { backgroundColor: '#a8e64c', hoverBackgroundColor: '#c2ee82' };
	if (result === 'win by timeout')
		return { backgroundColor: '#7ead39', hoverBackgroundColor: '#97cf44' };
	if (result === 'win by resignation/abandonment')
		return { backgroundColor: '#527125', hoverBackgroundColor: '#658a2e' };
	if (result === 'loss by checkmate')
		return { backgroundColor: '#b80f42', hoverBackgroundColor: '#cd577b' };
	if (result === 'loss by timeout')
		return { backgroundColor: '#8a0b32', hoverBackgroundColor: '#a60e3b' };
	if (result === 'loss by resignation/abandonment')
		return { backgroundColor: '#5a0720', hoverBackgroundColor: '#6e0928' };
	if (result === 'draw by agreement')
		return { backgroundColor: '#EAB308', hoverBackgroundColor: '#f0ca52' };
	if (result === 'draw by repetition')
		return { backgroundColor: '#b08606', hoverBackgroundColor: '#d3a107' };
	if (result === 'stalemate')
		return { backgroundColor: '#0dc3e7', hoverBackgroundColor: '#56d5ee' };
	if (result === 'insufficient material')
		return { backgroundColor: '#0a92ad', hoverBackgroundColor: '#0cb0d0' };
}

function countPlayerResults(results: string[]): ResultCount[] {
	const resultCounts: Record<string, number> = {};

	for (const result of results) {
		resultCounts[result] = (resultCounts[result] ?? 0) + 1;
	}

	const resultArray = Object.keys(resultCounts).map((result) => ({
		type: result,
		count: resultCounts[result],
		color: analyzeColor(result)
	}));

	const priority: Record<string, number> = {
		'win by checkmate': 1,
		'win by timeout': 2,
		'win by resignation/abandonment': 3,
		'draw by agreement': 4,
		'draw by repetition': 5,
		stalemate: 6,
		'insufficient material': 7,
		'loss by checkmate': 8,
		'loss by timeout': 9,
		'loss by resignation/abandonment': 10
	};

	resultArray.sort((a, b) => {
		const priorityA = priority[a.type] ?? 99;
		const priorityB = priority[b.type] ?? 99;
		return priorityA - priorityB;
	});

	return resultArray;
}

function isPlayer(username: string, game: ChessGame, color: 'white' | 'black'): boolean {
	return game[color].username.toLowerCase() === username.toLowerCase();
}

export async function processResults(
	username: string,
	dataToProcess: ChessGame[] | null,
	time_class: TimeClass
): Promise<ResultCount[] | null> {
	const results: string[] = [];

	if (dataToProcess?.length) {
		for (const game of dataToProcess) {
			if (game.time_class === time_class) {
				const result = isPlayer(username, game, 'white') ? game.white.result : game.black.result;
				const other = isPlayer(username, game, 'white') ? game.black.result : game.white.result;
				results.push(analyzeResult(result, other));
			}
		}
		return countPlayerResults(results);
	}

	return null;
}

const parseECOUrl = (data: string): string | null => {
	const ecoUrlMatch = data.match(/\[ECOUrl "(.*?)"\]/);
	if (ecoUrlMatch?.[1]) {
		const urlParts = ecoUrlMatch[1].split('/');
		return urlParts[urlParts.length - 1].replace(/-/g, ' ');
	}
	return null;
};

export async function processOpenings(
	username: string,
	dataToProcess: ChessGame[] | null,
	time_class: TimeClass
): Promise<OpeningStat[] | null> {
	if (!dataToProcess?.length) return null;

	const openingStats: Record<
		string,
		{
			games: number;
			wins: number;
			whiteGames: number;
			whiteWins: number;
			blackGames: number;
			blackWins: number;
		}
	> = {};

	for (const game of dataToProcess) {
		if (game.time_class !== time_class) continue;

		const openingName = parseECOUrl(game.pgn) ?? 'unknown';
		const isWhite = isPlayer(username, game, 'white');
		const win = isWhite ? game.white.result : game.black.result;

		if (!openingStats[openingName]) {
			openingStats[openingName] = {
				games: 0,
				wins: 0,
				whiteGames: 0,
				whiteWins: 0,
				blackGames: 0,
				blackWins: 0
			};
		}

		const stats = openingStats[openingName];
		stats.games++;
		if (isWhite) {
			stats.whiteGames++;
			if (win === 'win') stats.whiteWins++;
		} else {
			stats.blackGames++;
			if (win === 'win') stats.blackWins++;
		}
		if (win === 'win') stats.wins++;
	}

	return Object.entries(openingStats)
		.map(([opening, stats]) => ({
			opening,
			winRate: (stats.wins / stats.games) * 100,
			whiteWinRate: stats.whiteGames ? (stats.whiteWins / stats.whiteGames) * 100 : 0,
			blackWinRate: stats.blackGames ? (stats.blackWins / stats.blackGames) * 100 : 0,
			gamesPlayed: stats.games,
			whiteGames: stats.whiteGames,
			blackGames: stats.blackGames,
			wins: stats.wins
		}))
		.sort((a, b) => {
			if (b.gamesPlayed === a.gamesPlayed) {
				return b.winRate - a.winRate;
			}
			return b.gamesPlayed - a.gamesPlayed;
		});
}

export async function processRivals(
	username: string,
	dataToProcess: ChessGame[] | null,
	time_class: TimeClass
): Promise<RivalStat[]> {
	if (!dataToProcess?.length) return [];

	const rivals = dataToProcess.reduce<
		Record<string, { wins: number; losses: number; total: number }>
	>((acc, game) => {
		if (game.time_class !== time_class) return acc;

		const isWhite = isPlayer(username, game, 'white');
		const opponent = isWhite ? game.black.username : game.white.username;
		const result = isWhite ? game.white.result : game.black.result;

		if (!acc[opponent]) {
			acc[opponent] = { wins: 0, losses: 0, total: 0 };
		}

		if (result === 'win') {
			acc[opponent].wins++;
		} else if (
			result === 'checkmated' ||
			result === 'timeout' ||
			result === 'resigned' ||
			result === 'abandoned'
		) {
			acc[opponent].losses++;
		}

		acc[opponent].total++;
		return acc;
	}, {});

	return Object.entries(rivals).map(([opponent, stats]) => ({
		opponent,
		result: 'processed',
		stats
	}));
}

const DRAW_RESULTS: PlayerResult[] = [
	'agreed',
	'repetition',
	'stalemate',
	'insufficient',
	'timevsinsufficient'
];

export async function processRatingData(
	username: string,
	dataToProcess: ChessGame[] | null,
	time_class: TimeClass
): Promise<RatingDataPoint[] | null> {
	if (!dataToProcess?.length) return null;

	const ratingsMap = new Map<string, { rating: number; result: PlayerResult }[]>();

	for (const game of dataToProcess) {
		if (game.time_class !== time_class) continue;

		const endTime = new Date(game.end_time * 1000);
		const isWhite = isPlayer(username, game, 'white');
		const rating = isWhite ? game.white.rating : game.black.rating;
		const result = isWhite ? game.white.result : game.black.result;
		const date = endTime.toISOString().slice(0, 10);

		if (!ratingsMap.has(date)) {
			ratingsMap.set(date, []);
		}
		ratingsMap.get(date)!.push({ rating, result });
	}

	const aggregatedRatings = Array.from(ratingsMap.entries()).map(([date, games]) => {
		const totalGames = games.length;
		const totalRating = games.reduce((total, game) => total + game.rating, 0);
		const winCount = games.filter((game) => game.result === 'win').length;
		const drawCount = games.filter((game) => DRAW_RESULTS.includes(game.result)).length;

		return {
			date,
			rating: Math.round(totalRating / totalGames),
			activity: totalGames,
			winRate: (winCount / totalGames) * 100,
			drawRate: (drawCount / totalGames) * 100,
			lossRate: ((totalGames - winCount - drawCount) / totalGames) * 100
		};
	});

	aggregatedRatings.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	return aggregatedRatings;
}

export async function processRecentGames(
	username: string,
	dataToProcessTotal: ChessGame[] | null,
	time_class: TimeClass
): Promise<RecentGame[] | null> {
	if (!dataToProcessTotal?.length) return null;

	const recent: RecentGame[] = [];
	const dataToProcess = dataToProcessTotal.slice(0, 10);

	for (const game of dataToProcess) {
		if (game.time_class !== time_class) continue;

		const isWhite = isPlayer(username, game, 'white');
		recent.push({
			date: new Date(game.end_time * 1000).toLocaleDateString('en-GB'),
			rating: isWhite ? game.white.rating : game.black.rating,
			ratingOpponent: isWhite ? game.black.rating : game.white.rating,
			result: isWhite ? game.white.result : game.black.result,
			time_class,
			color: isWhite ? 'white' : 'black',
			opening: parseECOUrl(game.pgn)
		});
	}

	recent.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
	return recent;
}
