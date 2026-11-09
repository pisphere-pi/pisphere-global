// ==========================================
// PISPHERE SERVERLESS BACKEND ENGINE (MONGODB ATLAS + PI SDK)
// Path: netlify/functions/api.js
// ==========================================

const { MongoClient } = require("mongodb");

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) return null; // अगर अभी MongoDB लिंक नहीं डाला है तो भी ऐप बिना क्रैश हुए टेस्ट मोड में चलेगा
  if (cachedDb) return cachedDb;

  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  cachedDb = client.db("pisphere_global_db");
  return cachedDb;
}

exports.handler = async (event) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Content-Type": "application/json"
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers, body: "" };
  }

  try {
    const db = await connectToDatabase();
    const path = event.path.replace("/.netlify/functions/api", "").replace("/api", "");
    const body = event.body ? JSON.parse(event.body) : {};

    // 1. GET ALL SYNC DATA (Local Ads, Summaries, Groups, Safety Reports)
    if (event.httpMethod === "GET" && (path === "/sync" || path === "")) {
      if (!db) {
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ status: "sandbox_mode", dbConnected: false })
        };
      }

      const ads = await db.collection("local_ads").find({ active: true }).sort({ createdAt: -1 }).limit(20).toArray();
      const summaries = await db.collection("meeting_summaries").find({}).sort({ createdAt: -1 }).limit(20).toArray();
      const reports = await db.collection("safety_reports").find({ status: "Pending" }).sort({ createdAt: -1 }).limit(30).toArray();

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ status: "ok", dbConnected: true, ads, summaries, reports })
      };
    }

    // 2. SAVE NEW LOCAL AD FROM ADMIN PANEL
    if (event.httpMethod === "POST" && path === "/ads") {
      if (db) {
        await db.collection("local_ads").insertOne({
          business: body.business,
          text: body.text,
          active: true,
          createdAt: new Date()
        });
      }
      return { statusCode: 200, headers, body: JSON.stringify({ saved: true }) };
    }

    // 3. SAVE AI MEETING SUMMARY TO ADMIN VAULT
    if (event.httpMethod === "POST" && path === "/summary") {
      if (db) {
        await db.collection("meeting_summaries").insertOne({
          summaryId: body.id,
          title: body.title,
          host: body.host,
          pricePi: body.pricePi || 0.5,
          preview: body.preview,
          fullContent: body.fullContent,
          createdAt: new Date()
        });
      }
      return { statusCode: 200, headers, body: JSON.stringify({ saved: true }) };
    }

    // 4. LOG IT ACT SEC 79 SAFETY REPORT
    if (event.httpMethod === "POST" && path === "/report") {
      if (db) {
        await db.collection("safety_reports").insertOne({
          reason: body.reason,
          reporter: body.reporter || "Anonymous_Pioneer",
          status: "Pending",
          createdAt: new Date()
        });
      }
      return { statusCode: 200, headers, body: JSON.stringify({ reported: true }) };
    }

    // 5. RECORD PI PAYMENT UNLOCK (Summary / VIP Group / Local Service)
    if (event.httpMethod === "POST" && path === "/payment-record") {
      if (db) {
        await db.collection("pi_transactions").insertOne({
          username: body.username,
          amountPi: body.amountPi,
          memo: body.memo,
          txid: body.txid,
          createdAt: new Date()
        });
      }
      return { statusCode: 200, headers, body: JSON.stringify({ recorded: true }) };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "PiSphere Global Serverless API Ready" })
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: err.message })
    };
  }
};

Displaying 1000467041.png.
