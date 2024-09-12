export async function fetchUserStats(username) {
	const response = await fetch(`https://api.chess.com/pub/player/${username}/stats`);
	if (!response.ok) {
		throw new Error('Failed to fetch user stats');
	}
	return response.json();
}

export async function fetchUserProfile(username) {
	const response = await fetch(`https://api.chess.com/pub/player/${username}`);
	if (!response.ok) {
		throw new Error('Failed to fetch user stats');
	}
	return response.json();
}

export async function fetchMonthlyGames(username, year, month) {
	const response = await fetch(
		`https://api.chess.com/pub/player/${username}/games/${year}/${month}`
	);
	if (!response.ok) {
		throw new Error('Failed to fetch games');
	}
	let gameData = await response.json();
	return gameData.games;
}

function extractYearAndMonth(urls) {
	let response = urls.map((url) => {
		const parts = url.split('/');
		const year = parts[parts.length - 2];
		const month = parts[parts.length - 1];

		return { year, month };
	});
	return response;
}

export async function fetchGamesArchive(username) {
	const response = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
	if (!response.ok) {
		throw new Error('Failed to fetch game list');
	}
	const archiveURLs = await response.json();
	const archive = extractYearAndMonth(archiveURLs.archives);
	return archive;
}

export async function fetchGamesForAllMonths(username, yearMonthArray) {
	const gamesArray = [];

	for (let i = 0; i < yearMonthArray.length; i++) {
		const games = await fetchMonthlyGames(
			username,
			yearMonthArray[i].year,
			yearMonthArray[i].month
		);
		for (let j = 0; j < games.games.length; j++) {
			const game = games.games[j];
			gamesArray.push(game);
			//console.log("game: ", game);
		}
		//console.log("games for month: ", games);
	}

	return gamesArray;
}

// Helper function to get the previous month and year in the format "xx" and "xxxx"
function getPreviousMonthYear(monthOffset = 0) {
	const currentDate = new Date();
	currentDate.setMonth(currentDate.getMonth() - monthOffset);
	const month = String(currentDate.getMonth() + 1).padStart(2, '0');
	const year = currentDate.getFullYear();
	return { month, year };
}

export async function fetchGameData(username) {
	// Main function to get current, 3 months, 6 months, and year of data without duplicating months
	const monthsToFetch = new Set();

	// Collect months for current, 3 months, 6 months, and 12 months ago
	for (let i = 0; i < 12; i++) {
		const { month, year } = getPreviousMonthYear(i);
		monthsToFetch.add(`${year}-${month}`);
	}

	// Create an object to store fetched data
	const monthData = {};

	// Fetch data for each unique month
	for (let key of monthsToFetch) {
		const [year, month] = key.split('-');
		try {
			monthData[key] = await fetchMonthlyGames(username, year, month);
		} catch (e) {
			console.log('Error: ', e);
			error = e.message;
			monthData[key] = []; // Continue with an empty array if there's an error
		}
	}

	console.log('monthData: ', monthData);

	// Combine data for each time period
	const currentMonthKey = `${getPreviousMonthYear(0).year}-${getPreviousMonthYear(0).month}`;
	const currentMonthData = [...monthData[currentMonthKey]];

	const threeMonthsData = [];
	for (let i = 0; i < 3; i++) {
		const { month, year } = getPreviousMonthYear(i);
		threeMonthsData.push(...monthData[`${year}-${month}`]);
	}

	const sixMonthsData = [];
	for (let i = 0; i < 6; i++) {
		const { month, year } = getPreviousMonthYear(i);
		sixMonthsData.push(...monthData[`${year}-${month}`]);
	}

	const yearData = [];
	for (let i = 0; i < 12; i++) {
		const { month, year } = getPreviousMonthYear(i);
		yearData.push(...monthData[`${year}-${month}`]);
	}

	return {
		currentMonth: currentMonthData,
		threeMonths: threeMonthsData,
		sixMonths: sixMonthsData,
		year: yearData
	};
}

function analyzeResult(result, other) {
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

	// If no specific condition matches, return a default message
	return 'unknown result';
}

function analyzeColor(result) {
	if (result === 'win by checkmate')
		return { backgroundColor: '#a8e64c', hoverBackgroundColor: '#c2ee82' };
	else if (result === 'win by timeout')
		return { backgroundColor: '#7ead39', hoverBackgroundColor: '#97cf44' };
	else if (result === 'win by resignation/abandonment')
		return { backgroundColor: '#527125', hoverBackgroundColor: '#658a2e' };
	else if (result === 'loss by checkmate')
		return { backgroundColor: '#b80f42', hoverBackgroundColor: '#cd577b' };
	else if (result === 'loss by timeout')
		return { backgroundColor: '#8a0b32', hoverBackgroundColor: '#a60e3b' };
	else if (result === 'loss by resignation/abandonment')
		return { backgroundColor: '#5a0720', hoverBackgroundColor: '#6e0928' };
	else if (result === 'draw by agreement')
		return { backgroundColor: '#EAB308', hoverBackgroundColor: '#f0ca52' };
	else if (result === 'draw by repetition')
		return { backgroundColor: '#b08606', hoverBackgroundColor: '#d3a107' };
	else if (result === 'stalemate')
		return { backgroundColor: '#0dc3e7', hoverBackgroundColor: '#56d5ee' };
	else if (result === 'insufficient material')
		return { backgroundColor: '#0a92ad', hoverBackgroundColor: '#0cb0d0' };
}

function countPlayerResults(results) {
	const resultCounts = {};

	// Count the occurrences of each result in the results array
	results.forEach((result) => {
		// Increment the count for this result
		if (resultCounts[result]) {
			resultCounts[result]++;
		} else {
			resultCounts[result] = 1;
		}
	});

	// Convert the resultCounts object into an array of {wintype, count} objects
	const resultArray = Object.keys(resultCounts).map((result) => ({
		type: result,
		count: resultCounts[result],
		color: analyzeColor(result)
	}));

	// Custom priority for sorting
	const priority = {
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

	// Sort by the custom priority
	resultArray.sort((a, b) => {
		const priorityA = priority[a.type] || 99; // Default priority if type is not found
		const priorityB = priority[b.type] || 99;
		return priorityA - priorityB;
	});

	return resultArray;
}

export async function processResults(username, dataToProcess, time_class) {
	const results = [];
	//process each game and aggreagate ratings
	if (dataToProcess != null) {
		if (dataToProcess.length > 0) {
			dataToProcess.forEach((game) => {
				if (game.time_class == time_class) {
					const result =
						game.white.username.toLowerCase() === username.toLowerCase()
							? game.white.result
							: game.black.result;
					const other =
						game.white.username.toLowerCase() === username.toLowerCase()
							? game.black.result
							: game.white.result;

					results.push(analyzeResult(result, other));
				}
			});
			return countPlayerResults(results);
		} else {
			console.log('data not longer than 1');
			return null;
		}
	} else {
		console.log('data is null');
		return null;
	}
}

const parseECOUrl = (data) => {
	const ecoUrlMatch = data.match(/\[ECOUrl "(.*?)"\]/);
	if (ecoUrlMatch && ecoUrlMatch[1]) {
		const urlParts = ecoUrlMatch[1].split('/');
		return urlParts[urlParts.length - 1].replace(/-/g, ' ');
	}
	return null;
};

export async function processOpenings(username, dataToProcess, time_class) {
	console.log('processing openings');
	//openings = [];
	let openingStats = {};
	//process each game and aggreagate ratings
	if (dataToProcess != null) {
		if (dataToProcess.length > 0) {
			dataToProcess.forEach((game) => {
				if (game.time_class == time_class) {
					const openingName = parseECOUrl(game.pgn);

					// Check win result for the specified username
					const win =
						game.white.username.toLowerCase() === username.toLowerCase()
							? game.white.result
							: game.black.result;

					// Initialize the stats for the opening if not present
					if (!openingStats[openingName]) {
						openingStats[openingName] = { games: 0, wins: 0 };
					}

					// Update games count
					openingStats[openingName].games++;

					// Update wins count if the game was won
					if (win === 'win') {
						openingStats[openingName].wins++;
					}
				}
			});

			// Calculate win rates and format results
			const results = Object.keys(openingStats).map((opening) => {
				const stats = openingStats[opening];
				const winRate = (stats.wins / stats.games) * 100;
				return {
					opening,
					winRate: winRate, //winRate.toFixed(2) + '%',
					gamesPlayed: stats.games,
					wins: stats.wins
				};
			});

			// Sort first by games played (descending), then by win rate (descending)
			return results.sort((a, b) => {
				if (b.gamesPlayed === a.gamesPlayed) {
					return b.winRate - a.winRate; // Sort by win rate if games played are equal
				}
				return b.gamesPlayed - a.gamesPlayed; // Sort by games played
			});
		} else {
			console.log('data not longer than 1');
			return null;
		}
	} else {
		console.log('data is null');
		return null;
	}
}

export async function processRatingData(username, dataToProcess, time_class) {
	//process data
	const ratings = [];
	const ratingsMap = new Map();

	//process each game and aggreagate ratings
	if (dataToProcess != null) {
		if (dataToProcess.length > 0) {
			dataToProcess.forEach((game) => {
				if (game.time_class == time_class) {
					const endTime = new Date(game.end_time * 1000);
					const rating =
						game.white.username.toLowerCase() === username.toLowerCase()
							? game.white.rating
							: game.black.rating;

					const result =
						game.white.username.toLowerCase() === username.toLowerCase()
							? game.white.result
							: game.black.result;

					ratings.push({
						date: endTime.toISOString().slice(0, 10),
						rating,
						result
					});

					const date = endTime.toISOString().slice(0, 10);
					if (!ratingsMap.has(date)) {
						ratingsMap.set(date, []);
					}
					ratingsMap.get(date).push({ rating, result });
				}
			});
			console.log('ratings: ', ratings, '\nratingsMap: ', ratingsMap);

			const aggregatedRatings = Array.from(ratingsMap.entries()).map(([date, games]) => {
				const totalGames = games.length;
				const totalRating = games.reduce((total, game) => total + game.rating, 0);
				const winCount = games.filter((game) => game.result === 'win').length;
				const drawCount = games.filter((game) =>
					['agreed', 'repetition', 'stalemate', 'insufficient', 'timevsinsufficient'].includes(
						game.result
					)
				).length;

				return {
					date,
					rating: Math.round(totalRating / totalGames),
					activity: totalGames,
					winRate: (winCount / totalGames) * 100, // Win rate as a percentage
					drawRate: (drawCount / totalGames) * 100, // Draw rate as a percentage
					lossRate: ((totalGames - winCount - drawCount) / totalGames) * 100 //Loss rate as a percentage
				};
			});

			//sort ratings by date
			aggregatedRatings.sort((a, b) => new Date(a.date) - new Date(b.date));

			console.log('aggregated ratings: ', aggregatedRatings);

			return aggregatedRatings;
		} else {
			console.log('data not longer than 1');
			return null;
		}
	} else {
		console.log('data is null');
		return null;
	}
}

export async function processRecentGames(username, dataToProcessTotal, time_class) {
	//process data
	const recent = [];
	const dataToProcess = dataToProcessTotal?.slice(0, 10) ?? [];

	//process each game and aggreagate ratings
	if (dataToProcess != null) {
		if (dataToProcess.length > 0) {
			dataToProcess.forEach((game) => {
				if (game.time_class == time_class) {
					const date = new Date(game.end_time * 1000).toLocaleDateString('en-GB');

					const rating =
						game.white.username.toLowerCase() === username.toLowerCase()
							? game.white.rating
							: game.black.rating;
					const ratingOpponent =
						game.white.username.toLowerCase() === username.toLowerCase()
							? game.black.rating
							: game.white.rating;

					const result =
						game.white.username.toLowerCase() === username.toLowerCase()
							? game.white.result
							: game.black.result;

					const color =
						game.white.username.toLowerCase() === username.toLowerCase() ? 'white' : 'black';

					const opening = parseECOUrl(game.pgn);

					recent.push({
						date,
						rating,
						ratingOpponent,
						result,
						time_class,
						color,
						opening
					});
				}
			});
			console.log('recent games: ', recent);

			//sort ratings by date
			recent.sort((a, b) => new Date(a.date) - new Date(b.date));

			return recent;
		} else {
			console.log('data not longer than 1');
			return null;
		}
	} else {
		console.log('data is null');
		return null;
	}
}
