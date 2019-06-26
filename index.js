
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

//api shopping list
app.post('/api/list/add', (req, res) => {
  if (req && res) {
    db.run('UPDATE stock SET amountList=? WHERE name=?;', [req.body.newAmount, req.body.name], function (err) {
      if (err) {
        res.json({ msg: "error", err })
      }
      else {
        res.json({
          "name": req.body.name,
          "newAmount": req.body.newAmount
        }).end();
      }
    });
  }
})
app.post('/api/list/decrease', (req, res) => {
  if (req && res) {
    const newAmount = req.body.newAmount != 0 ? parseInt(req.body.newAmount) - 1 : 0
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
    const newAmountStock = req.body.amountList != 0 ? parseInt(req.body.amountStock) + parseInt(req.body.amountList) : req.body.amountStock
    db.run('UPDATE stock SET amountStock=?, amountList=? WHERE name=?;', [newAmountStock, 0, req.body.name], function (err) {
      if (err) {
        res.json({ msg: "error", err })
      }
      else {
        res.json({
          "succsess": true
        }).end();
      }
    });
  }
})
//api stock
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
//api recipe
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
app.post('/api/recipe/addToList', (req, res) => {
  if (req && res) {
    data = getAmounts(req.body.name)
    console.log(data)   //undefined WHY?!?!!!
    if (data) {
      const newAmount = data.amountList + req.body.amount
      db.run('UPDATE stock SET amountList=? WHERE name=?;', [newAmount, req.body.name], function (err) {
        if (err) {
          res.json({ msg: "error", err }).end()
        }
        else {
          res.json(data).end()
        }
      });
    } else {
      res.json({ msg: "error" }).end()
    }
  }
})
app.post('/api/recipe/deleteFromStock', (req, res) => {
  if (req && res) {
    data = getAmounts(req.body.name)
    console.log(data)   //undefined WHY?!?!!!
    if (data) {
      const newAmount = data.amountStock - req.body.amount
      db.run('UPDATE stock SET amountStock=? WHERE name=?;', [newAmount, req.body.name], function (err) {
        if (err) {
          res.json({ msg: "error", err }).end()
        }
        else {
          res.json(data).end()
        }
      });
    } else {
      res.json({ msg: "error" }).end()
    }
  }
})


//functions
function getAmounts(name) {
  db.all('SELECT * FROM stock where name=?', [name], (err, stockElement) => {
    if (err) {
      console.log(err)
    }else{
      console.log(stockElement[0])
      return JSON.stringify({
        amountStock: stockElement[0].amountStock,
        amountList: stockElement[0].amountList
      })
  	}
  })
}
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


//server
const server = app.listen(port, () => {
  console.log(`Server listening on port ${port}…`)
});
module.exports = server