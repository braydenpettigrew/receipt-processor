const express = require("express");
const uuid = require("uuid");

// Create an express app and use JSON middleware
const app = express();
app.use(express.json());

const receipts = {};

const calculatePoints = (receipt) => {
  let points = 0;
  const { retailer, purchaseDate, purchaseTime, items, total } = receipt;

  // Customer earns 1 point for every alphanumeric character in the retailer's name
  points += retailer.replace(/[^a-zA-Z0-9]/g, "").length;

  // Customer earns 50 points if the total is a round dollar amount with no cents
  if (total % 1 === 0) {
    points += 50;
  }

  // Customer earns 25 points if the total is a multiple of 0.25
  if (total % 0.25 === 0) {
    points += 25;
  }

  // Customer earns 5 points for every 2 items on the receipt
  points += Math.floor(items.length / 2) * 5;

  // If the trimmed length of the item description is a multiple of 3, multiply the price by 0.2 and round up to the nearest integer. The result is the number of points earned.
  items.forEach((item) => {
    const { shortDescription, price } = item;
    const trimmedLength = shortDescription.trim().length;
    if (trimmedLength % 3 === 0) {
      points += Math.ceil(price * 0.2);
    }
  });

  // Customer earns 6 points if the day in the purchase date is odd
  const purchaseDay = purchaseDate.split("-")[2];
  console.log("purchase day: ", purchaseDay);
  if (purchaseDay % 2 !== 0) {
    points += 6;
  }

  // Customer earns 10 points if the time of the purchase is after 2:00 PM and before 4:00 PM. purchaseTime is a string such as "14:33", "14:33" is after 2pm
  const purchaseHour = purchaseTime.split(":")[0];
  const purchaseMinute = purchaseTime.split(":")[1];
  if (purchaseHour >= 14 && purchaseHour < 16 && purchaseMinute > 0) {
    points += 10;
  }

  return points;
};

// Endpoint to process receipts
app.post("/receipts/process", (req, res) => {
  const receiptId = uuid.v4();
  const points = calculatePoints(req.body);

  receipts[receiptId] = { points };

  res.json({ id: receiptId });
});

// Endpoint to get points
app.get("/receipts/:id/points", (req, res) => {
  const receiptId = req.params.id;
  const receipt = receipts[receiptId];

  // If receipt is not found, return 404
  if (!receipt) {
    return res.status(404).json({ error: "Receipt not found" });
  }

  res.json({ points: receipt.points });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
