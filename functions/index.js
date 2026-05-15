const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// 🚀 FUNCTION 1: Create the Checkout Page
exports.createStripeCheckout = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    try {
      if (req.method === 'OPTIONS') {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.set('Access-Control-Allow-Headers', 'Content-Type');
        return res.status(204).send('');
      }

      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        console.error("Missing Stripe Key!");
        return res.status(500).send({ error: "Server misconfiguration." });
      }
      
      const stripe = require("stripe")(stripeKey);
      
      // 🌟 NEW: We are now accepting a 'tier' variable from your frontend
      const { priceId, userId, successUrl, cancelUrl, tier } = req.body;

      if (!priceId || !userId || !tier) {
        return res.status(400).send({ error: "Missing required parameters (priceId, userId, or tier)." });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription", // Keep this if your prices in Stripe are recurring
        allow_promotion_codes: true,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        // 🌟 THE STICKY NOTE: We pass the tier to Stripe here
        metadata: { 
          userId: userId,
          tier: tier 
        }, 
      });

      res.status(200).send({ url: session.url });

    } catch (error) {
      console.error("Error creating session:", error);
      res.status(500).send({ error: error.message });
    }
  });
});

// 🚀 FUNCTION 2: The Webhook
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
  const event = req.body;

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    
    // 🌟 Read the sticky note!
    const userId = session.metadata ? session.metadata.userId : null; 
    const purchasedTier = session.metadata ? session.metadata.tier : 'basic'; 

    if (userId) {
      try {
        await db.collection("users").doc(userId).set({
          isPremium: true, // We'll keep this as a quick master switch just in case
          subscriptionTier: purchasedTier, // 🌟 'basic', 'pro', or 'executive'
          subscriptionDate: admin.firestore.FieldValue.serverTimestamp(),
          stripeSessionId: session.id
        }, { merge: true });
        
        console.log(`Successfully upgraded user: ${userId} to ${purchasedTier} tier`);
      } catch (error) {
        console.error("Firestore Update Error:", error);
      }
    } else {
      console.error("No userId found in session metadata.");
    }
  }
  
  res.status(200).send("Webhook received");
});