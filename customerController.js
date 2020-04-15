'use strict'

// Asenna ensin mysql driver 
// npm install mysql --save

var mysql = require('mysql');

var connection = mysql.createConnection({
  host: 'localhost',
  port: 3308,
  user: 'root', // HUOM! Älä käytä root:n tunnusta tuotantokoneella!!!!
  password: '',
  database: 'asiakas'
});

module.exports = {
  fetchTypes: function (req, res) {
    let sql;
    if(req.query.AVAIN > 0){
      sql = "SELECT * FROM Asiakastyyppi WHERE AVAIN=" + req.query.AVAIN;
    }else{
      sql = 'SELECT Avain, Lyhenne, Selite FROM Asiakastyyppi'     
    }
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        //res.send(error);
        //res.send(JSON.stringify({"status": 500, "error": error, "response": null})); 
        res.send({
          "status": 500,
          "error": error,
          "response": null
        });
      } else {
        //console.log("Data = " + JSON.stringify(results));
        res.json(results);
        //res.statusCode = 201;
        //res.send(results);
        //res.send({ "status": 768, "error": null, "response": results });
      }
    });

  },

  //tehtävä 45, 46, 47
  fetchAll: function (req, res) {
    let sql = 'SELECT * FROM asiakas';
    //jos oli parametreja...
    if (Object.keys(req.query).length !== 0) {
      let avain = req.query.AVAIN;
      let nimi = req.query.NIMI;
      let osoite = req.query.OSOITE;
      let asty_avain = -1;
      if (avain > 0) {
        sql = sql + ' WHERE AVAIN = ' + avain;
      } else {
        sql = sql + ' WHERE NIMI LIKE "' + nimi + '%"';
        sql = sql + ' AND OSOITE LIKE "' + osoite + '%"';
        if (req.query.ASTY_AVAIN > 0) {
          asty_avain = req.query.ASTY_AVAIN;
          sql = sql + ' AND ASTY_AVAIN = ' + asty_avain;
        }
      }
    }
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Virhe haettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send({
          "status": 500,
          "error": error,
          "response": null
        });
      } else {
        res.send(results);
      }
    });
  },

  //tehtävä 48
  create: function (req, res) {
    // Client lähettää POST-moethod:n
    //console.log("Body = " + JSON.stringify(req.body));
    let nimi = req.body.NIMI;
    let osoite = req.body.OSOITE;
    let postinro = req.body.POSTINRO;
    let postitmp = req.body.POSTITMP;
    let asty_avain = req.body.ASTY_AVAIN;
    let virhe = false;

    //tehtävä 51
    for (const x in req.body) {
      if (req.body[x] == '') {
        virhe = true;
      }
    };
    if (virhe) {
      res.send({
        "status": 400,
        "error": "Kaikki kentät ovat pakollisia."
      });
    } else {

      let sql = "INSERT INTO asiakas (NIMI, OSOITE, POSTINRO, POSTITMP, LUONTIPVM, ASTY_AVAIN) ";
      sql = sql + "VALUES ('" + nimi + "', '" + osoite + "', '" + postinro + "', '" + postitmp + "', CURDATE(), " + asty_avain + ");";
      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Virhe lisättäessä  dataa Asiakas-tauluun, syy: " + error);
          res.send({
            "status": 500,
            "error": error,
            "response": null
          });
        } else {
          res.send(results);
        }
      });
    }
  },

  //tehtävä 55
  update: function (req, res) {
    let virhe = false;
    for (const x in req.body) {
      if (req.body[x] == '') {
        virhe = true;
      }
    };
    if (virhe) {
      res.send({
        "status": 400,
        "error": "Kaikki kentät ovat pakollisia."
      });
    } else {
      let avain = req.params.id;
      let nimi = req.body.NIMI;
      let osoite = req.body.OSOITE;
      let postinro = req.body.POSTINRO;
      let postitmp = req.body.POSTITMP;
      let asty_avain = req.body.ASTY_AVAIN;
      let sql = "UPDATE Asiakas SET NIMI = '" + nimi + "', OSOITE = '" + osoite + "',  POSTINRO = '" + postinro + "', POSTITMP = '" + postitmp + "', ASTY_AVAIN = " + asty_avain + " WHERE AVAIN = " + avain;
      connection.query(sql, function (error, results, fields) {
        if (error) {
          console.log("Virhe muokattaessa dataa Asiakas-taulussa, syy: " + error);
          res.send({
            "status": 500,
            "error": error,
            "response": null
          });
        } else {
          res.send(results);
        }
      });
    }
  },

  delete: function (req, res) {
    //tehtävä 50
    let id = req.params.id;
    let sql = "DELETE FROM asiakas WHERE AVAIN = " + id;
    connection.query(sql, function (error, results, fields) {
      if (error) {
        console.log("Virhe poistettaessa dataa Asiakas-taulusta, syy: " + error);
        res.send({
          "status": 500,
          "error": error,
          "response": null
        });
      } else {
        res.send(results);
      }
    });
  }
}