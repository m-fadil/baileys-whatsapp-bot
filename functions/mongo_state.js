import { MongoClient } from 'mongodb';

const uri = process.env.uri;
const client = new MongoClient(uri);

export async function saveState(state) {
	try {
		await client.connect();
		const db = client.db('whatsapp-bot-baileys');
		const collection = db.collection('authState');

		// Simpan state ke MongoDB
		await collection.updateOne({ _id: 'authState' }, { $set: { state } }, { upsert: true });
	} finally {
		await client.close();
	}
}

export async function loadState() {
	try {
		await client.connect();
		const db = client.db('whatsapp-bot-baileys');
		const collection = db.collection('authState');

		// Muat state dari MongoDB
		const result = await collection.findOne({ _id: 'authState' });
		return result ? result.state : null;
	} finally {
		await client.close();
	}
}
