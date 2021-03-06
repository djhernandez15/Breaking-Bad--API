const { all } = require('../Data/url');
const moment = require('moment');
let occ = [],
  app = [];
const aMap = arr => {
  return arr.map(el => +el);
};

const charactersFunc = func => {
  func.map((e, i) => {
    e.occupation && occ.push(e.occupation.split(',').map(el => el.trim()));
    app.push(e.appearance.split(','));

    e.occupation = occ[i];
    e.appearance = aMap(app[i]);
    e.birthday = e.birthday
      ? moment(e.birthday, 'MM-DD-YYYY').format('MM-DD-YYYY')
      : 'Unknown';
  });
};

const getPeople = (req, res) => {
  const db = req.app.get('db');
  const { limit, name, offset } = req.query;

  let newName =
    name &&
    name
      .split(' ')
      .map(e => {
        return e.charAt(0).toUpperCase() + e.slice(1);
      })
      .join(' ');

  !name
    ? db.characters.get_characters().then(response => {
        charactersFunc(response);
        res
          .status(200)
          .send(
            limit || offset ? response.splice(offset || 0, limit) : response
          );
      })
    : db.characters.get_char_by_name([newName]).then(response => {
        charactersFunc(response);
        res.status(200).send(response);
      });
  occ = [];
  app = [];
};

const getPeopleById = (req, res) => {
  const db = req.app.get('db');
  const { id } = req.params;

  db.characters
    .get_char_by_id([id])
    .then(resp => {
      res.status(200).send(resp);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

const getRandomChar = (req, res) => {
  const db = req.app.get('db');
  const { limit } = req.query;
  const o = [];
  const a = [];

  db.characters
    .get_random_char([limit || 1])
    .then(resp => {
      resp.map((e, i) => {
        e.occupation && o.push(e.occupation.split(','));
        a.push(e.appearance.split(','));

        e.occupation = o[i];
        e.appearance = aMap(a[i]);
      });
      res.status(200).send(resp);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

const getCharLimit = (req, res) => {
  const db = req.app.get('db');

  db.characters
    .get_char_limit([limit, offset])
    .then(resp => {
      res.status(200).send(resp);
    })
    .catch(err => {
      res.status(500).send(err);
    });
};

const getAll = (req, res) => {
  res.status(200).json(all);
};

const getEverything = async (req, res) => {
  const db = req.app.get('db');
  let everything = [];

  await db.characters.get_characters().then(resp => {
    everything.push(...resp);
  });
  await db.episodes.get_episodes().then(resp => {
    everything.push(...resp);
  });
  await db.quotes.get_quotes().then(resp => {
    everything.push(...resp);
  });
  await db.death.get_deaths().then(resp => {
    everything.push(...resp);
  });

  await res.status(200).send(everything);
};

module.exports = {
  getPeople,
  getPeopleById,
  getRandomChar,
  getAll,
  getEverything
};
