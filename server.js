const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use('/assets', express.static(`${__dirname}/public`));

app.get('/', (req, res) => {
    res.redirect('/assets/index.html');
});

app.listen(port);
