var postgres = require('pg');
var conString = "postgres://localhost:5432/nommer";

function login (email, password, callback) {
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  
  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }

    var query = 'SELECT id, nickname, email, password ' +
                'FROM users WHERE email = $1';

    client.query(query, [email], function (err, result) {
      // NOTE: always call `done()` here to close
      // the connection to the database
      done();

      if (err) {
        console.log('error executing query', err);
        return callback(err);
      }

      if (result.rows.length === 0) {
        return callback();
      }

      var user = result.rows[0];

      if (!bcrypt.compareSync(password, user.password)) {
        return callback();
      }

      callback(null, {
        id:         user.id,
        nickname:   user.nickname,
        email:      user.email
      });


    });
  });
}

function create (user, callback) {
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }

    var hashedPassword = bcrypt.hashSync(user.password, 10);

    var query = 'INSERT INTO users(email, password) VALUES ($1, $2)';

    client.query(query, [user.email, hashedPassword], function (err, result) {
      // NOTE: always call `done()` here to close
      // the connection to the database
      done();

      if (err) {
        console.log('error executing query', err);
        return callback(err);
      }

      if (result.rows.length === 0) {
        return callback();
      }

      callback(null);
    });
  });
}

function verify (email, callback) {
  //this example uses the "pg" library
  //more info here: https://github.com/brianc/node-postgres

  postgres(conString, function (err, client, done) {
    if (err) {
      console.log('could not connect to postgres db', err);
      return callback(err);
    }

    var query = 'UPDATE users SET email_Verified = true ' +
                'WHERE email_Verified = false AND email = $1';

    client.query(query, [email], function (err, result) {
      // NOTE: always call `done()` here to close
      // the connection to the database
      done();

      if (err) {
        return callback(err);
      }

      if (result.rowCount === 0) {
        return callback();
      }

      callback(null, result.rowCount > 0);
    });
  });

}
