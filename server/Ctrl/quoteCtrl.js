const getQuotes = (req, res) => {
  const db = req.app.get('db');

  db.quotes
    .get_quotes()
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
      console.log(`Something went wrong!`);
    });
};

const getQuoteById = (req, res) => {
  const db = req.app.get('db');

  db.quotes
    .get_quote_by_id([req.params.id])
    .then(response => {
      res.status(200).send(response);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

const getRandomQuote = (req, res) => {
  const db = req.app.get('db');

  req.query.author
    ? db.quotes
        .random_by_auth([req.query.author])
        .then(resp => {
          res.status(200).send(resp);
        })
        .catch(err => {
          res.status(500).send(err);
        })
    : db.quotes
        .get_random_quote()
        .then(resp => {
          res.status(200).send(resp);
        })
        .catch(err => {
          res.status(500).send(err);
        });
};

const getQuoteByAuthor = (req, res) => {
  const db = req.app.get('db');

  db.quotes
    .get_quotes_from_author([req.query.author])
    .then(resp => {
      res.status(200).send(resp);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

module.exports = {
  getQuotes,
  getQuoteById,
  getRandomQuote,
  getQuoteByAuthor
};
