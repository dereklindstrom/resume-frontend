const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// 🚀 FUNCTION 1: Create the Checkout Page
exports.createStripeCheckout = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    try {
      const stripeKey = process.env.STRIPE_SECRET_KEY;
      if (!stripeKey) {
        console.error("Missing Stripe Key!");
        return res.status(500).send({ error: "Server misconfiguration." });
      }
      const stripe = require("stripe")(stripeKey);

      const { priceId, userId, successUrl, cancelUrl } = req.body;

      if (!priceId || !userId) {
        return res.status(400).send({ error: "Missing required parameters." });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        allow_promotion_codes: true,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: successUrl,
        cancel_url: cancelUrl,
        // 🌟 We store the ID here...
        metadata: { userId: userId }, 
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
    
    // 🌟 THE FIX: Look in metadata, matching where we saved it above!
    const userId = session.metadata ? session.metadata.userId : null; 

    if (userId) {
      try {
        await db.collection("users").doc(userId).set({
          isPremium: true,
          subscriptionDate: admin.firestore.FieldValue.serverTimestamp(),
          stripeSessionId: session.id
        }, { merge: true });
        console.log(`Successfully upgraded user: ${userId}`);
      } catch (error) {
        console.error("Firestore Update Error:", error);
      }
    } else {
      console.error("No userId found in session metadata.");
    }
  }
  res.status(200).send("Webhook received");
});