import { json } from '@sveltejs/kit';
import { Client, Databases } from 'node-appwrite';
import { ID, Query } from 'appwrite';
import { databases } from '$lib/appwrite';

export async function POST({ request }) {
	const body = await request.json();

	const client = new Client();
	const databases = new Databases(client);

	const CHESS_DATABASE_ID = '66db100a00204ba1520c';
	const PLAYER_COLLECTION_ID = '66db18db002a7c459c77';
	const GAMES_COLLECTION_ID = '66db113f00177bee64bd';
	const apiKey = import.meta.env.VITE_APPWRITE_API_KEY;
	client
		.setEndpoint('https://cloud.appwrite.io/v1')
		.setProject('66daa783003cf75648a1')
		.setKey(apiKey); // API key stays secure on the server side

	try {
		const documents = body.gameDocuments; // Get documents from the client request

		for (const document of documents) {
			await databases.createDocument(CHESS_DATABASE_ID, GAMES_COLLECTION_ID, ID.unique(), document);

			console.log('added document: ', document);
		}

		return json({ message: 'Documents created successfully' }, { status: 200 });
	} catch (error) {
		console.error(error);
		return json({ error: 'Error creating documents' }, { status: 500 });
	}
}
