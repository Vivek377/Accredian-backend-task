const connection = require("./db");
const express = require("express");
const cors = require("cors");
const { PrismaClient } = require("@prisma/client");
const { google } = require("googleapis");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
const OAuth2 = google.auth.OAuth2;

const OAuth2Client = new OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

OAuth2Client.setCredentials({
  refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
});

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  return res.json("Working...");
});

async function sendReferralMail(email, name, referredBy) {
  const accessToken = await OAuth2Client.getAccessToken();

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.EMAIL,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Referral Received",
    text: `Hello ${name},\n\nYou have received a referral by your friend ${referredBy} for our course!\n\nBest regards,\nAccredian`,
  };

  return await transport.sendMail(mailOptions);
}

app.post("/referrals", async (req, res) => {
  const { name, email, referredBy } = req.body;
  try {
    const referral = await prisma.referral.create({
      data: {
        name,
        email,
        referredBy,
      },
    });

    await sendReferralMail(email, name, referredBy);
    res.status(200).json(referral);
  } catch (e) {
    console.log(e);
    res.status(400).json({ error: e.message });
  }
});

app.get("/referrals", async (req, res) => {
  try {
    const referrals = await prisma.referral.findMany();
    res.json(referrals);
  } catch (e) {
    console.log(e);
  }
});

connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);
});

app.listen(process.env.PORT, () => {
  console.log("Listening");
});
