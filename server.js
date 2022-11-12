import express from "express";
import pkg from 'body-parser';
import cors from "cors";
import path from 'path';
import { fileURLToPath } from 'url';

import sequelize from "./app/models/index.js";
import userRouter from "./routes/userRouter.js";
import restaurantRouter from "./routes/restaurantRouter.js";
import reviewRouter from "./routes/reviewRouter.js";
import reservationRouter from "./routes/reservationRouter.js";


const { json, urlencoded } = pkg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, '/static')))
const corsOptions = {
  credentials: true,
};

app.use(cors());
// parse requests of content-type - application/json
app.use(json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(urlencoded({ extended: true }));

// set port, listen for requests
const PORT = process.env.PORT || 3001;
console.log(PORT)
sequelize.sync()
  .then((data) => {
    console.log("Synced db.");
  })
  .catch((err) => {
    console.log("Failed to sync db: " + err.message);
  });

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, '/static/index.html'))
});


userRouter(app)
restaurantRouter(app)
reviewRouter(app)
reservationRouter(app)


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
