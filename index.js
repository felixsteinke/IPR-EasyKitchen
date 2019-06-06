
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser')
const db = new sqlite3.Database('./db/Stock.db');

const port = process.env.PORT || 3000;
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));



const TABLE_NAME = 'yas'

app.get('/api/bestand', async (req, res) => {
  db.all('SELECT * FROM stockElements', (err, stockElements) => {
    //TODO
  });
});   //datenbankabfrage


// Index Route
app.get('/', (req, res) => {
  res.render('pages/index', { success: true });
});


// Stock Route
app.get('/stock', (req, res) => {
  db.all('SELECT * FROM Stock', (err, stockElements) => {
    //TODO
    if (err) {
      console.log(err)
      res.render('pages/bestand', { stockElements: [] })
    }
    res.render('pages/bestand', { stockElements });
  });
});


// List Route
app.get('/list', (req, res) => {
  res.render('pages/einkaufsliste', { success: true });
});
app.get('/recipe', (req, res) => {
  res.render('pages/rezepte', { success: true });
});

app.post('/api/stock', (req, res) => {
  if (req.body.name && req.body.amountStock) {
    db.get('SELECT name,amountStock FROM stock WHERE name=?', [req.body.name], function (err,row) {
      if (err) {
        res.json({ msg: "error"})
      }else{
        console.log(row)
        if(row.amountStock > 0){
          updateStock({
            body: {amount: row.amountStock, change: req.body.amountStock, name: req.body.name}
          }, res);
        }else{
          res.json({ msg: "error"})
        }
      }
    })
  } else {
    console.log("Übergabeparameter null")
  }
});

function updateStock(req, res) {
  console.log(req.body)
  const newAmount = req.body.amount + req.body.change;
  db.run('UPDATE stock SET amountStock=? WHERE name=?;', [newAmount, req.body.name], function (err) {
    if (err) {
      res.json({ msg: "error", err})
    }
    else {
      res.json({
        "name": req.body.name,
        "amount": newAmount
      }).end();
    }
  });
}

const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}…`)
});



module.exports = server


