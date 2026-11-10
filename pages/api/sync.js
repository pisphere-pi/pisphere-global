import { MongoClient } from "mongodb";

let cachedDb = null;

async function getDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null;
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri);
  await client.connect();
  cachedDb = client.db("pisphere_global_db");
  return cachedDb;
}

export default async function handler(req, res) {
  try {
    const db = await getDatabase();

    if (req.method === "GET") {
      if (!db) {
        return res.status(200).json({ status: "sandbox_mode", dbConnected: false });
      }
      const ads = await db.collection("local_ads").find({ active: true }).sort({ createdAt: -1 }).limit(20).toArray();
      const summaries = await db.collection("meeting_summaries").find({}).sort({ createdAt: -1 }).limit(20).toArray();
      const supportTickets = await db.collection("support_tickets").find({}).sort({ updatedAt: -1 }).limit(50).toArray();
      return res.status(200).json({ status: "ok", dbConnected: true, ads, summaries, supportTickets });
    }

    if (req.method === "POST") {
      const body = req.body || {};
      if (db) {
        if (body.action === "ad") {
          await db.collection("local_ads").insertOne({
            business: body.business,
            text: body.text,
            active: true,
            createdAt: new Date()
          });
        } else if (body.action === "summary") {
          await db.collection("meeting_summaries").insertOne({
            id: body.id,
            title: body.title,
            date: body.date,
            host: body.host,
            pricePi: body.pricePi,
            preview: body.preview,
            fullContent: body.fullContent,
            createdAt: new Date()
          });
        } else if (body.action === "support_ticket") {
          await db.collection("support_tickets").updateOne(
            { username: body.username },
            {
              $set: { uid: body.uid, lang: body.lang, unread: true, updatedAt: new Date() },
              $push: {
                messages: {
                  fromAdmin: false,
                  category: body.category,
                  text: body.text,
                  time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
                }
              }
            },
            { upsert: true }
          );
        } else if (body.action === "payment") {
          await db.collection("pi_transactions").insertOne({
            username: body.username,
            amountPi: body.amountPi,
            memo: body.memo,
            txid: body.txid,
            createdAt: new Date()
          });
        }
      }
      return res.status(200).json({ saved: true });
    }

    return res.status(200).json({ message: "PiSphere Next.js API Ready" });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
Displaying 1000467041.png. 
