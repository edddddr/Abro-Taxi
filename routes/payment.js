const express = require('express');
const router = express.Router();
const db = require('../config/db2.js');

const uuid = require('uuid');

router.get('/payment', function (req, res) {
  if (req.session.phone) {
    const paymentData = new Promise(function (resolve, reject) {
      db.query(
        `select * from general_info where infoName ='currentPaymentReceiptType'`,
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          if (result && result.length) {
            resolve(result[0]);
            return;
          }
        }
      );
    });

    const paymentInfo = { paymentInfo: '' };
    paymentData
      .then((data) => {
        paymentInfo.paymentInfo = data;
      })
      .finally(() => {
        res.render('payment.ejs', paymentInfo);
      });
  } else {
    res.redirect('/login');
  }
});

router.post('/addPayment', (req, res) => {
  const msg = {};
  const paymentData = req.body;
  const year = paymentData.paymentYear;
  const valueForFindQuery = [];
  const valueForAddQuery = [];

  if (!req.session.phone) {
    msg.states = 'error';
    msg.msg = 'session expired please reload and try again!';
    res.json(msg);
    return;
  }

  const checkPaymentList = Object.entries(paymentData).find(
    ([key, value]) => value === '' && key !== 'paymentTin'
  );
  if (checkPaymentList) {
    msg.states = 'error';
    msg.msg = `check your payment detail and try again hint: around ${checkPaymentList[0]}: ${checkPaymentList[1]}`;
    res.json(msg);
  }

  const dbQueryForExistingPayment = `SELECT * FROM payment_data WHERE phone = ? AND payedForMonth=? AND paymentReason=? AND states=?`;

  // Value for finding payment
  valueForFindQuery.push(paymentData.phone);
  valueForFindQuery.push(paymentData.paymentMonth);
  valueForFindQuery.push(paymentData.paymentReason);
  valueForFindQuery.push('added');

  // im here
  const dbQueryForAddingPayment =
    'INSERT INTO `payment_data`(`phone`, `name`, `payedForMonth`, `paymentId`, `states`, `paymentName`, `paymentReason`, `paymentAmount`,`taxAmount`,`netAmount`,`payerDetail`,`paymentDescription`, `confirmedBy`) VALUES ?';
  // Value for adding payment
  valueForAddQuery.push(paymentData.phone);
  valueForAddQuery.push(paymentData.name);
  valueForAddQuery.push(paymentData.paymentMonth);
  valueForAddQuery.push(
    `Pym-${year.slice(2, 4)}-${paymentData.paymentMonth.slice(
      0,
      3
    )}-${paymentData.name.slice(0, 6)}-${uuid.v4().slice(0, 6)}`
  );
  valueForAddQuery.push('added');
  valueForAddQuery.push(
    paymentData.paymentMonth + '-' + paymentData.paymentReason
  );
  valueForAddQuery.push(paymentData.paymentReason);
  valueForAddQuery.push(paymentData.grossAmount);
  valueForAddQuery.push(paymentData.taxAmount);
  valueForAddQuery.push(paymentData.netAmount);

  valueForAddQuery.push(paymentData.payerDetail);
  valueForAddQuery.push(paymentData.paymentDescription);
  valueForAddQuery.push(req.session.phone);

  db.query(
    dbQueryForExistingPayment,
    valueForFindQuery,
    (errFindingPayment, resultFindingPayment) => {
      if (errFindingPayment) {
        msg.states = 'error';
        msg.msg =
          'Something happened while checking payment. please contact support.';
        res.json(msg);
        console.error(errFindingPayment);
        return;
      }

      if (resultFindingPayment && resultFindingPayment.length) {
        resultFindingPayment = resultFindingPayment[0];
        msg.states = 'warning';
        msg.msg =
          'Payment already made for: ' +
          resultFindingPayment.phone +
          ' ' +
          resultFindingPayment.paymentReason +
          ' Amount: ' +
          resultFindingPayment.paymentAmount +
          ` has been added on
          ${new Date(resultFindingPayment.paymentDate).getDate()}-${new Date(
            resultFindingPayment.paymentDate
          ).getMonth()}-${new Date(
            resultFindingPayment.paymentDate
          ).getFullYear()}`;
        res.json(msg);
        return;
      }

      db.query(
        dbQueryForAddingPayment,
        [[valueForAddQuery]],
        (errAddingPayment, resultAddingPayment) => {
          if (errAddingPayment) {
            msg.states = 'error';
            msg.msg = 'something happened while adding payment';
            res.json(msg);
            console.error(errAddingPayment);
            return;
          }
          msg.states = 'success';
          msg.msg = 'payment added successfully';
          res.json(msg);
        }
      );
    }
  );
});

router.get('/paymentSearch', function (req, res) {
  const sql = 'SELECT * FROM generalSchoolInfo WHERE infoName =?';
  db.query(sql, ['currentAcademicYear'], function (err, data) {
    if (err) {
      console.error(err);
      return;
    } else if (data && data.length) {
      db.query(
        'SELECT * FROM  ' +
          'paymentData WHERE paymentDate LIKE "%' +
          req.query.search +
          '%" OR name LIKE "%' +
          req.query.search +
          '%" OR phone LIKE "%' +
          req.query.search +
          '%" OR paymentId LIKE "%' +
          req.query.search +
          '%"  limit 10',

        function (err, rows) {
          if (err) throw err;
          const dataList = [];
          for (i = 0; i < rows.length; i++) {
            let org_data = {};
            org_data.paymentId = rows[i].payment_id;

            org_data.payment =
              'id: ' +
              rows[i].payed_for_stu_id +
              ', name: ' +
              rows[i].payed_for_stu_name +
              ', month: ' +
              rows[i].payed_for_month +
              ', payed by: ' +
              rows[i].payment_name;
            dataList.push(org_data);
          }
          res.json(dataList);
        }
      );
    }
  });
});

router.get('/getPaymentList', function (req, res) {
  const msg = {};
  const getPaymentListQuery = `SELECT * FROM payment_data WHERE 1 ORDER BY id ASC LIMIT 10`;

  const errResponse = function (err, msg) {
    console.error(err);
    res.json({ states: 'error', msg });
  };

  db.query(getPaymentListQuery, function (err, results) {
    if (err) {
      return errResponse(err, "can't find payment list!");
    }

    results = results.map((result) => {
      const date = new Date(result.paymentDate);
      return {
        id: result.id,
        paymentId: result.paymentId,
        phone: result.phone,
        name: result.name,
        paymentName: result.paymentName,
        amount: result.paymentAmount,
        description: result.paymentDescription,
        date: `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`,
        confirmedBy: result.confirmedBy,
      };
    });

    res.json({ states: 'success', results });
  });
});

module.exports = router;
