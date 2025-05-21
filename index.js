const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const FACEBOOK_PAGE_ID = "627749760430400";
const FACEBOOK_ACCESS_TOKEN = process.env.FACEBOOK_ACCESS_TOKEN;

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.post("/post", async (req, res) => {
  const { text, platforms } = req.body;

  console.log("\n====== Incoming Post Request ======");
  console.log("Post Text:", text);
  console.log("Platforms selected:", platforms);

  const results = {};

  // Facebook posting
  if (platforms.facebook) {
    console.log("\n➡️ Attempting to post to Facebook...");
    try {
      const response = await axios.post(
        `https://graph.facebook.com/${FACEBOOK_PAGE_ID}/feed`,
        {
          message: text,
          access_token: FACEBOOK_ACCESS_TOKEN,
        }
      );
      console.log("✅ Facebook post successful!");
      console.log("🔗 Post ID:", response.data.id);

      results.facebook = {
        success: true,
        postId: response.data.id,
      };
    } catch (error) {
      console.error("❌ Facebook post failed!");
      console.error("Error:", error.response?.data || error.message);

      results.facebook = {
        success: false,
        error: error.response?.data || error.message,
      };
    }
  }

  // TODO: Instagram and YouTube logic here...

  console.log("✅ Post processing completed.\n");

  res.send({
    message: "Post processed",
    results,
  });
});


app.listen(5000, () => {
  console.log("Backend running on http://localhost:5000");
});
