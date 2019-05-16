const express = require('express');
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./db/shoutbox.db');
const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use('/public', express.static(process.cwd() + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


app.get('/', function(req, res) {
  db.all('SELECT * FROM shouts', (err, rows) => {
    res.render('pages/index', { shouts: rows })
  });
});

app.get('/add-entry', function(req, res) {
  res.render('pages/add-entry');
});

app.post('/add-entry', function(req, res) {
  db.run('INSERT INTO shouts(username, message) VALUES (?, ?);', [req.body.username, req.body.message], (err) => {
    if(err) {
      // Im Errorfall z.B. die gleiche Seite nochmals anzeigen
      res.render('pages/add-entry');
    } else {
      // Ansonsten redirect auf die Index Route
      res.redirect('/');
    }
  });
});

const server = app.listen(port, () => {
 console.log(`Server listening on port ${port}…`)
});

module.exports = server;
