
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


// stock Route
app.get('/stock', (req, res) => {
  db.all('SELECT * FROM stock', (err, stockElements) => {
    if (err) {
      console.log(err)
      res.render('pages/bestand', { stockElements: [] })
    }
    res.render('pages/bestand', { stockElements });
  });
});


// shoppinglist Route
app.get('/list', (req, res) => {
  db.all('SELECT * FROM stock', (err, stockElements) => {
    if (err) {
      console.log(err)
      res.render('pages/einkaufsliste', { stockElements: [] })
    }
    res.render('pages/einkaufsliste', { stockElements });
  });
});
// recipe Route
app.get('/recipe', (req, res) => {
  db.all('SELECT * FROM recipes', (err, recipes) => {
    if (err) {
      console.log(err)
      res.render('pages/rezepte', { recipes: [] })
    }
    res.render('pages/rezepte', { recipes });
  });
});

app.post('/api/list/add', (req, res) => {
  if (req && res) {
    const newAmount = parseInt(req.body.amount) + 1;
    db.run('UPDATE stock SET amountList=? WHERE name=?;', [newAmount, req.body.name], function (err) {
      if (err) {
        res.json({ msg: "error", err })
      }
      else {
        res.json({
          "name": req.body.name,
          "newAmount": newAmount
        }).end();
      }
    });
  }
})
app.post('/api/list/decrease', (req, res) => {
  if (req && res) {
    const newAmount = req.body.amount - 1;
    db.run('UPDATE stock SET amountList=? WHERE name=?;', [newAmount, req.body.name], function (err) {
      if (err) {
        res.json({ msg: "error", err })
      }
      else {
        res.json({
          "name": req.body.name,
          "newAmount": newAmount
        }).end();
      }
    });
  }
})
app.post('/api/list/submit', (req, res) => {
  if (req && res) {
    db.run('UPDATE stock SET amountStock=?, amountList=? WHERE name=?;', [req.body.newAmountStock + 1, req.body.newAmountList - 1, req.body.name], function (err) {
      if (err) {
        res.json({ msg: "error", err })
      }
      else {
        res.json({
          "name": req.body.name,
          "amountStock": req.body.newAmountStock,
          "amountList": req.body.newAmountList
        }).end();
      }
    });
  }
})

app.post('/api/recipe', (req, res) => {
  if (req && res) {
    db.get('SELECT * FROM recipes WHERE name=?', [req.body.name], function (err, row) {
      if (err) {
        res.json({ msg: "error", err })
      } else {
        res.json({
          "name": row.name,
          "components": row.components,
          "desc": row.description
        })
      }
    })
  }
})

app.post('/api/stock', (req, res) => {
  if (req.body.name && req.body.amountStock) {
    db.get('SELECT name,amountStock FROM stock WHERE name=?', [req.body.name], function (err, row) {
      if (err) {
        res.json({ msg: "error", err })
      } else {
        if (row.amountStock > 0 || (row.amountStock == 0 && req.body.amountStock == 1)) {
          updateStock({
            body: {
              amount: row.amountStock,
              change: req.body.amountStock,
              name: req.body.name
            }
          }, res);
        } else {
          res.json({ msg: "amount is zero" })
        }
      }
    })
  } else {
    console.log("Übergabeparameter null")
  }
});

function updateStock(req, res) {
  const newAmount = req.body.amount + req.body.change;
  db.run('UPDATE stock SET amountStock=? WHERE name=?;', [newAmount, req.body.name], function (err) {
    if (err) {
      res.json({ msg: "error", err })
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


