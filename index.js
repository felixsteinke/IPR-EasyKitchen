const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')
const db = new sqlite3.Database('./db/Stock.db');

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true })); //nötig?
app.use(bodyParser.json());   //nötig?

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/api/bestand', async (req, res) => {
  db.all('SELECT * FROM stockElements', (err, stockElements) => {
    //TODO
  });
});   //datenbankabfrage

app.get('/', (req, res) => {
  res.render('pages/index', { success: true });
});
app.get('/stock', (req, res) => {
  res.render('pages/bestand', { success: true });
});
app.get('/list', (req, res) => {
  res.render('pages/einkaufsliste', { success: true });
});
app.get('/recipe', (req, res) => {
  res.render('pages/rezepte', { success: true });
});

app.post('/api/PLACEHOLDER', (req, res) => {
  if (req.body.username && req.body.message) {
    db.run('INSERT INTO shouts(username, message) VALUES (?, ?);', [req.body.username, req.body.message], function(err) {
      if(err) {
        res.status(500).end()
      } else {
        res.json({
          "id" : this.lastID,
          "username" : req.body.username,
          "message" : req.body.message
        }).end()
      }
    });
  } else {
    res.status(500).end()
  }
});   //Datenbankeintrag

const server = app.listen(port, () => {
 console.log(`Server listening on port ${port}…`)
});

module.exports = server