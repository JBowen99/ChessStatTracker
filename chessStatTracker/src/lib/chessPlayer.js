import { ID, Query } from 'appwrite';
import { databases } from '$lib/appwrite';
import {
	fetchGamesArchive,
	fetchGamesForAllMonths,
	fetchMonthlyGames,
	fetchUserProfile,
	fetchUserStats
} from './api.js';

const CHESS_DATABASE_ID = '66db100a00204ba1520c';
const PLAYER_COLLECTION_ID = '66db18db002a7c459c77';
const GAMES_COLLECTION_ID = '66db113f00177bee64bd';

export async function getPlayers() {
	return await databases.listDocuments(
		CHESS_DATABASE_ID,
		PLAYER_COLLECTION_ID,
		// Use a query to show the latest ideas first
		[Query.orderDesc('$createdAt')]
	);
}

export async function getPlayer(playerName) {
	let response = await databases.listDocuments(CHESS_DATABASE_ID, PLAYER_COLLECTION_ID, [
		Query.equal('username', playerName)
	]);
	return response.documents[0];
}

export async function addPlayer(data) {
	let response = await databases.createDocument(
		CHESS_DATABASE_ID,
		PLAYER_COLLECTION_ID,
		ID.unique(),
		data
	);
	return response;
}

export async function updatePlayer(documentID, data) {
	let response = await databases.updateDocument(
		CHESS_DATABASE_ID,
		PLAYER_COLLECTION_ID,
		documentID,
		data
	);
	return response;
}

export async function addGame(data) {
	let response = await databases.createDocument(
		CHESS_DATABASE_ID,
		GAMES_COLLECTION_ID,
		ID.unique(),
		data
	);
	return response;
}

export async function deletePlayer(id) {
	await databases.deleteDocument(IDEAS_DATABASE_ID, IDEAS_COLLECTION_ID, id);
}

const parseECOUrl = (data) => {
	const ecoUrlMatch = data.match(/\[ECOUrl "(.*?)"\]/);
	if (ecoUrlMatch && ecoUrlMatch[1]) {
		const urlParts = ecoUrlMatch[1].split('/');
		return urlParts[urlParts.length - 1].replace(/-/g, ' ');
	}
	return null;
};

export async function getPlayerStats(playerName) {
	//check if player exists in database
	const player = await getPlayer(playerName);

	console.log('player', player);

	if (player != null) {
		//TODO check if we need to update game archive

		//get player stats
		console.log('player in database: ', player);
	} else {
		//create new player based off stats
		try {
			let playerStats = await fetchUserProfile(playerName);

			//create document list for batch upload
			let gameDocuments = [];

			// check if player is a valid Chess.com player
			if (playerStats != null) {
				console.log(`${playerName} stats from api:`, playerStats);

				//new player data
				let newPlayer = {
					id: playerStats['@id'],
					url: playerStats.url,
					username: playerStats.username,
					playerID: playerStats.player_id,
					title: playerStats.title,
					status: playerStats.status,
					name: playerStats.name,
					avatar: playerStats.avater,
					location: playerStats.location,
					country: playerStats.country,
					joined: new Date(playerStats.joined * 1000),
					lastOnline: new Date(playerStats.last_online * 1000),
					followers: playerStats.followers,
					isStreamer: playerStats.is_streamer,
					twitchURL: playerStats.twitch_url,
					fide: playerStats.fide
				};
				//create new player in the database and get the document id
				const newPlayerDocument = await addPlayer(newPlayer);
				const newPlayerID = newPlayerDocument.$id;

				//get archive and make list
				const archive = await fetchGamesArchive(playerName);
				//for each monthly archive, fetch games
				const allGames = await fetchGamesForAllMonths(playerName, archive);

				//list of games to add to player
				const chessGame = [];

				//for each game, create new database entry
				for (let i = 0; i < allGames.length; i++) {
					let game = allGames[i];
					let newGame = {
						url: game.url,
						pgn: game.pgn,
						fen: game.fen,
						eco: parseECOUrl(game.pgn),
						rules: game.rules,
						timeControl: game.time_control,
						startTime: game.start_time ? new Date(game.start_time * 1000) : null,
						endTime: new Date(game.end_time * 1000),
						tournament: game.tournament ?? null,
						match: game.match ?? null,
						whiteUsername: game.white.username,
						whiteRating: game.white.rating,
						whiteResult: game.white.result,
						whiteID: game.white['@id'],
						whiteAccuracy: game.accuracies ? game.accuracies.white : null,
						blackUsername: game.black.username,
						blackRating: game.black.rating,
						blackResult: game.black.result,
						blackID: game.black['@id'],
						blackAccuracy: game.accuracies ? game.accuracies.black : null,
						chessPlayer: [newPlayerID]
					};
					//console.log('game: ', game, '\nnew game: ', newGame);
					//TODO check game doesn't exist in database before adding it

					//add game to database and get document
					//const gameDocument = await addGame(newGame);
					//const gameID = gameDocument.$id;
					//add game document id to list to assign to player later
					//chessGame.push(gameID);
					gameDocuments.push(newGame);
				}

				console.log('Documents created and added to list. Awaiting upload...');

				//request server to push documents
				try {
					const response = await fetch('/api/uploadBatchDocuments', {
						method: 'POST',
						headers: {
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({ gameDocuments })
					});

					const result = await response.json();

					if (response.ok) {
						console.log('Documents created successfully:', result);
					} else {
						console.error('Error:', result.error);
					}
				} catch (error) {
					console.error('Request failed:', error);
				}

				//add list of games to player
				//await updatePlayer(newPlayerID, { chessGame: chessGame });
				console.log('added player!');
			}
			// player does not exist on Chess.com
			else {
				console.log('not a valid chess.com username!');
			}
		} catch (e) {
			console.log('Error: ', e);
		}
	}
}
