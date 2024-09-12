import { Client, Account, Databases } from "appwrite";
const client = new Client();
client.setEndpoint("https://cloud.appwrite.io/v1").setProject("66daa783003cf75648a1");
const account = new Account(client);
new Databases(client);
export {
  account as a
};
