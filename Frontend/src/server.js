require('dotenv').config();
const express = require('express');
const port = process.env.PORT || 8080;
const connectDB = require('./config/connectDatabase');
const configViewEngine = require('./config/viewEngine');
const initWebRouters = require('./routes/web');
const initAPIs = require('./routes/api');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(
  cors({
    origin: true,
  })
);

// Use cookie
app.use(cookieParser(process.env.COOKIE_SIGNED));

// Config req.body
// Middleware convert object req -> Json de su dung
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Config view
configViewEngine(app);

// Khai bao routes
initWebRouters(app);
initAPIs(app);

app.use((req, res) => {
  return res.render('404.ejs');
});

connectDB();

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
  console.log(`Server running at http://localhost:${port}/`);
});
