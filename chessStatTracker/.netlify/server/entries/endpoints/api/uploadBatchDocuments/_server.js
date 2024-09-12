import { j as json } from "../../../../chunks/index.js";
import { Client, Databases } from "node-appwrite";
import { ID } from "appwrite";
import "../../../../chunks/appwrite.js";
async function POST({ request }) {
  const body = await request.json();
  const client = new Client();
  const databases2 = new Databases(client);
  const CHESS_DATABASE_ID = "66db100a00204ba1520c";
  const GAMES_COLLECTION_ID = "66db113f00177bee64bd";
  const apiKey = "standard_15d9c4b14ce17d2987abd93681b2cd1a424d9d20c0155603d2e441b944647ed6acf766d42a59f2a406743c48eea5383179dde14f06cad7a80a9eae5652a227d824dd96ed8b2cad2a436d26931eacd3b5716138cac0f24b9cce54504812b7d77cd27b2cce0fb03329145c7bf8a268f73df6c90dbc292cf608e5fe73ec287b87c2";
  client.setEndpoint("https://cloud.appwrite.io/v1").setProject("66daa783003cf75648a1").setKey(apiKey);
  try {
    const documents = body.gameDocuments;
    for (const document of documents) {
      await databases2.createDocument(CHESS_DATABASE_ID, GAMES_COLLECTION_ID, ID.unique(), document);
      console.log("added document: ", document);
    }
    return json({ message: "Documents created successfully" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return json({ error: "Error creating documents" }, { status: 500 });
  }
}
export {
  POST
};
