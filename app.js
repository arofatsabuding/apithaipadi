var express = require('express')
var cors = require('cors')
var app = express()
var bodyParser = require('body-parser')
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const saltRounds = 8;
var jwt = require('jsonwebtoken');


const secret = 'RevolutionZ4349'


var jsonParser = bodyParser.json()

var app = express()
let PORT = process.env.PORT || 4444;


app.use(cors())
app.use(express.json())

const connection = mysql.createConnection({
  host: 'db.tech2home.net',
  user: 'root',
  database: 'thaipadi'
});



// //POST

app.post('/register', jsonParser, function (req, res, next) {
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
            if(err){
                res.json({status:'err',message:err})
                return
            }
            connection.execute(
                'INSERT INTO users (prefix,fname,lname,tel,password) VALUE (?,?,?,?,?)',
                [req.body.prefix,req.body.fname,req.body.lname,req.body.tel,hash],
                function(err, results, fields) {
                    if(err) {
                        res.json({status:'err',message:err})
                        return
                    }
                    res.json({status:'OK'})
            }
          );
    });
})



app.post('/login', jsonParser, function (req, res, next) {
    connection.execute(
        'SELECT * FROM users WHERE tel=?',
        [req.body.tel],
        function(err, users, fields) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            if (users.length == 0){
                res.json({status:'err',message:'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง'})
                return
            }
            bcrypt.compare(req.body.password, users[0].password, function(err, islogin) {
                if(islogin){
                    var token = jwt.sign({tel : users[0].tel}, secret , { expiresIn: '24h' });
                    res.json({status:'OK',message:'login success',token, prefix: users[0].prefix ,TN: users[0].TN ,fname: users[0].fname, lname: users[0].lname, role: users[0].role  })
                    return
                }
                else{
                    res.json({status:'error',message:'login failed'})
                }
            });
    }
  );
})

app.post('/authen', jsonParser, function (req, res, next) {
    // const token = req.headers.authorization
    // res.json({token})

    try {
        const token = req.headers.authorization.split(' ')[1]
        var decoded = jwt.verify(token, secret);
        res.json({status:'OK',decoded})
    } catch(err){
        res.json({status:'eror',message:err.message})
        
    }
})


app.post('/blocklist', jsonParser, function (req, res, next) {
    connection.execute(
        'INSERT INTO blocklist (TN) VALUE (?)',
        [req.body.TN],
        function(err, results, fields) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            res.json({status:'OK'})
        }
)})

app.post('/cancellist', jsonParser, function (req, res, next) {
    connection.execute(
        'INSERT INTO cancellist (TN) VALUE (?)',
        [req.body.TN],
        function(err, results, fields) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            res.json({status:'OK'})
        }
)})

//post appoinmant



app.post('/apppoinments', jsonParser, function (req, res, next) {
    connection.execute(
        'INSERT INTO appoinments (TN, date, time, service, provider) VALUE (?,?,?,?,?)',[req.body.TN, req.body.date, req.body.time, req.body.service, req.body.provider],
        function(err, results, fields) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            res.json({status:'OK'})
        }
)})

app.post('/apppoinmentss', jsonParser, function (req, res, next) {
    connection.execute(
        'INSERT INTO appoinmentss (TN, date, time, service, provider) VALUE (?,?,?,?,?)',[req.body.TN, req.body.date, req.body.time, req.body.service, req.body.provider],
        function(err, results, fields) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            res.json({status:'OK'})
        }
)})


app.post('/apppoinmentsss', jsonParser, function (req, res, next) {
    connection.execute(
        'INSERT INTO appoinmentsss (TN, date, time, service, provider) VALUE (?,?,?,?,?)',[req.body.TN, req.body.date, req.body.time, req.body.service, req.body.provider],
        function(err, results, fields) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            res.json({status:'OK'})
        }
)})


app.post('/manapppoinment', jsonParser, function (req, res, next) {
    connection.execute(
        'INSERT INTO manappoinments (TN, date, time, service, provider) VALUE (?,?,?,?,?)',[req.body.TN, req.body.date, req.body.time, req.body.service, req.body.provider],
        function(err, results, fields) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            res.json({status:'OK'})
        }
)})

app.post('/reviews',jsonParser, function (req, res, next) {
    connection.execute(
        'INSERT INTO reviews (step, provider, location, covid, comment) VALUE (?,?,?,?,?)',[req.body.step, req.body.provider, req.body.location, req.body.covid, req.body.comment],
        function(err, results, fields) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            res.json({status:'OK'})
        }
)})


//post appoinmant



// app.post('/cancellist', jsonParser, function (req, res, next) {
//     connection.execute(
//         'INSERT INTO cancellist (TN) VALUE (?)',
//         [req.body.TN],
//         function(err, results, fields) {
//             if(err) {
//                 res.json({status:'err',message:err})
//                 return
//             }
//             res.json({status:'OK'})
//         }
// )})





// //POST//




// //GET

// app.get('/appoinments',(req,res,next)=>{

//     connection.query('SELECT appoinments.TN , appoinments.date , appoinments.time , appoinments.service, appoinments.provider, users.fname, users.lname,users.tel FROM appoinments,users WHERE users.TN = appoinments.TN',
//         function(err,results){
//             res.json(results)
//         }
//         )
// })

// app.get('/appoinment/:date',(req,res,next)=>{
//     const date = req.params.date

//     connection.query('SELECT appoinments.TN , appoinments.date , appoinments.time , appoinments.service, appoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinments,users WHERE users.TN = appoinments.TN AND appoinments.date=?',[date],
//         function(err,results){
//             res.json(results)
//         }
//         )
// })

//users
app.get('/appoinment/:TN',(req,res,next)=>{
    const date = req.params.TN

    connection.query('SELECT appoinments.AN,appoinments.TN , appoinments.date , appoinments.time , appoinments.service, appoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinments,users WHERE appoinments.TN = users.TN AND  appoinments.TN = ?',[date],
        function(err,results){
            res.json(results)
        }
        )
})


app.get('/appoinments/:TN',(req,res,next)=>{
    const date = req.params.TN

    connection.query('SELECT appoinmentss.AN,appoinmentss.TN , appoinmentss.date , appoinmentss.time , appoinmentss.service, appoinmentss.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinmentss,users WHERE appoinmentss.TN = users.TN AND appoinmentss.TN = ?',[date],
        function(err,results){
            res.json(results)
        }
        )
})


app.get('/appoinmentss/:TN',(req,res,next)=>{
    const date = req.params.TN

    connection.query('SELECT appoinmentsss.AN,appoinmentsss.TN , appoinmentsss.date , appoinmentsss.time , appoinmentsss.service, appoinmentsss.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinmentsss,users WHERE appoinmentsss.TN = users.TN AND appoinmentsss.TN = ?',[date],
        function(err,results){
            res.json(results)
        }
        )
})


app.get('/manappoinment/:TN',(req,res,next)=>{
    connection.query('SELECT manappoinments.AN, manappoinments.TN , manappoinments.date , manappoinments.time , manappoinments.service, manappoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM manappoinments,users WHERE manappoinments.TN=users.TN AND manappoinments.TN=?',[req.params.TN],
        function(err,results){
            res.json(results)
        }
        )
})
//users

//users
app.get('/appoinment',(req,res,next)=>{
    const date = req.params.TN

    connection.query('SELECT appoinments.AN,appoinments.TN , appoinments.date , appoinments.time , appoinments.service, appoinments.provider, users.fname, users.lname,users.tel,users.role, users.prefix FROM appoinments,users WHERE appoinments.TN = users.TN ',
        function(err,results){
            res.json(results)
        }
        )
})


app.get('/appoinments',(req,res,next)=>{
    const date = req.params.TN

    connection.query('SELECT appoinmentss.AN,appoinmentss.TN , appoinmentss.date , appoinmentss.time , appoinmentss.service, appoinmentss.provider, users.fname, users.lname,users.tel,users.role, users.prefix FROM appoinmentss,users WHERE appoinmentss.TN = users.TN',
        function(err,results){
            res.json(results)
        }
        )
})


app.get('/appoinmentss',(req,res,next)=>{
    connection.query('SELECT appoinmentsss.AN,appoinmentsss.TN , appoinmentsss.date , appoinmentsss.time , appoinmentsss.service, appoinmentsss.provider, users.fname, users.lname,users.tel,users.role, users.prefix FROM appoinmentsss,users WHERE appoinmentsss.TN = users.TN',
        function(err,results){
            res.json(results)
        }
        )
})


app.get('/manappoinment',(req,res,next)=>{
    connection.query('SELECT manappoinments.AN, manappoinments.TN , manappoinments.date , manappoinments.time , manappoinments.service, manappoinments.provider, users.fname, users.lname,users.tel,users.role, users.prefix FROM manappoinments,users WHERE manappoinments.TN=users.TN',
        function(err,results){
            res.json(results)
        }
        )
})
//users














//9.00
app.get('/appoinments/9/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinmentss.AN,appoinmentss.TN , appoinmentss.date , appoinmentss.time , appoinmentss.service, appoinmentss.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinmentss,users WHERE users.TN = appoinmentss.TN AND appoinmentss.time=? AND appoinmentss.date=?',['09:00',date],
        function(err,results){
            res.json(results)
        }
        )
})
app.get('/appoinmentss/9/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinmentsss.AN,appoinmentsss.TN , appoinmentsss.date , appoinmentsss.time , appoinmentsss.service, appoinmentsss.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinmentsss,users WHERE users.TN = appoinmentsss.TN AND appoinmentsss.time=? AND appoinmentsss.date=?',['09:00',date],
        function(err,results){
            res.json(results)
        }
        )
})
app.get('/appoinment/9/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinments.AN,appoinments.TN , appoinments.date , appoinments.time , appoinments.service, appoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinments,users WHERE users.TN = appoinments.TN AND appoinments.time=? AND appoinments.date=?',['09:00',date],
        function(err,results){
            res.json(results)
        }
        )
})


app.get('/manappoinment/9/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT manappoinments.AN, manappoinments.TN , manappoinments.date , manappoinments.time , manappoinments.service, manappoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM manappoinments,users WHERE users.TN = manappoinments.TN AND manappoinments.time=? AND manappoinments.date=?',['09:00',date],
        function(err,results){
            res.json(results)
        }
        )
})
//9.00

//10.15
app.get('/appoinment/10/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinments.AN, appoinments.TN , appoinments.date , appoinments.time , appoinments.service, appoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinments,users WHERE users.TN = appoinments.TN AND appoinments.time=? AND appoinments.date=?',['10:15',date],
        function(err,results){
            res.json(results)
        }
        )
})
app.get('/appoinments/10/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinmentss.AN, appoinmentss.TN , appoinmentss.date , appoinmentss.time , appoinmentss.service, appoinmentss.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinmentss,users WHERE users.TN = appoinmentss.TN AND appoinmentss.time=? AND appoinmentss.date=?',['10:15',date],
        function(err,results){
            res.json(results)
        }
        )
})
app.get('/appoinmentss/10/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinmentsss.AN, appoinmentsss.TN , appoinmentsss.date , appoinmentsss.time , appoinmentsss.service, appoinmentsss.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinmentsss,users WHERE users.TN = appoinmentsss.TN AND appoinmentsss.time=? AND appoinmentsss.date=?',['10:15',date],
        function(err,results){
            res.json(results)
        }
        )
})


app.get('/manappoinment/10/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT manappoinments.AN, manappoinments.TN , manappoinments.date , manappoinments.time , manappoinments.service, manappoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM manappoinments,users WHERE users.TN = manappoinments.TN AND manappoinments.time=? AND manappoinments.date=?',['10:15',date],
        function(err,results){
            res.json(results)
        }
        )
})
//10.15



//13.30
app.get('/appoinment/13/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinments.AN, appoinments.TN , appoinments.date , appoinments.time , appoinments.service, appoinments.provider, users.fname, users.lname,users.role, users.tel , users.prefix FROM appoinments,users WHERE users.TN = appoinments.TN AND appoinments.time=? AND appoinments.date=?',['13:30',date],
        function(err,results){
            res.json(results)
        }
        )
})
app.get('/appoinments/13/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinmentss.AN, appoinmentss.TN , appoinmentss.date , appoinmentss.time , appoinmentss.service, appoinmentss.provider, users.fname, users.lname,users.role, users.tel, users.prefix FROM appoinmentss,users WHERE users.TN = appoinmentss.TN AND appoinmentss.time=? AND appoinmentss.date=?',['13:30',date],
        function(err,results){
            res.json(results)
        }
        )
})
app.get('/appoinmentss/13/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinmentsss.AN, appoinmentsss.TN , appoinmentsss.date , appoinmentsss.time , appoinmentsss.service, appoinmentsss.provider, users.fname, users.lname,users.role, users.tel, users.prefix FROM appoinmentsss,users WHERE users.TN = appoinmentsss.TN AND appoinmentsss.time=? AND appoinmentsss.date=?',['13:30',date],
        function(err,results){
            res.json(results)
        }
        )
})

app.get('/manappoinment/13/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT manappoinments.AN, manappoinments.TN , manappoinments.date , manappoinments.time , manappoinments.service, manappoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM manappoinments,users WHERE users.TN = manappoinments.TN AND manappoinments.time=? AND manappoinments.date=?',['13:30',date],
        function(err,results){
            res.json(results)
        }
        )
})
//13.30

//14.45
app.get('/appoinment/14/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinments.AN, appoinments.TN , appoinments.date , appoinments.time , appoinments.service, appoinments.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinments,users WHERE users.TN = appoinments.TN AND appoinments.time=? AND appoinments.date=?',['14:45',date],
        function(err,results){
            res.json(results)
        }
        )
})
app.get('/appoinments/14/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinmentss.AN, appoinmentss.TN , appoinmentss.date , appoinmentss.time , appoinmentss.service, appoinmentss.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinmentss,users WHERE users.TN = appoinmentss.TN AND appoinmentss.time=? AND appoinmentss.date=?',['14:45',date],
        function(err,results){
            res.json(results)
        }
        )
})
app.get('/appoinmentss/14/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT appoinmentsss.AN, appoinmentsss.TN , appoinmentsss.date , appoinmentsss.time , appoinmentsss.service, appoinmentsss.provider, users.fname, users.lname,users.tel, users.prefix FROM appoinmentsss,users WHERE users.TN = appoinmentsss.TN AND appoinmentsss.time=? AND appoinmentsss.date=?',['14:45',date],
        function(err,results){
            res.json(results)
        }
        )
})

app.get('/manappoinment/14/:date',(req,res,next)=>{
    const date = req.params.date

    connection.query('SELECT manappoinments.AN, manappoinments.TN , manappoinments.date , manappoinments.time , manappoinments.service, manappoinments.provider, users.fname, users.lname, users.tel, users.prefix FROM manappoinments,users WHERE users.TN = manappoinments.TN AND manappoinments.time=? AND manappoinments.date=?',['14:45',date],
        function(err,results){
            res.json(results)
        }
        )
})

//14.45
app.get('/user/:TN',(req,res,next)=>{
    const tn = req.params.TN
    connection.query('SELECT * FROM `users` WHERE `TN`=?',[tn],
    function(err,results){
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json(results)
    }
    )
})



app.get('/users',(req,res,next)=>{
    connection.query('SELECT users.TN, users.prefix, users.fname, users.lname, users.role, users.tel FROM users',
    function(err,results){
        res.json(results)
    }
    )
})

app.get('/users:TN',(req,res,next)=>{
    connection.query('SELECT users.TN, users.prefix, users.fname, users.lname, users.role, users.tel FROM users ',
    function(err,results){
        res.json(results)
    }
    )
})



app.get('/cancellist',(req,res,next)=>{

    connection.query('SELECT cancellist.CN, cancellist.TN, cancellist.datecancel, users.fname, users.lname, users.tel FROM cancellist,users WHERE users.TN = cancellist.TN',
    function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json(results);
      }
    );
  })

app.get('/blocklist',(req,res,next)=>{

    connection.query('SELECT blocklist.BN, blocklist.TN, blocklist.dateblock, users.fname, users.lname, users.tel,users.role FROM blocklist,users WHERE users.TN = blocklist.TN',
    function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json(results);
      }
    );
  })

app.get('/reviews',(req,res,next)=>{

    connection.query('SELECT * FROM reviews',
    function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json(results);
      }
    );
  })

// //GET



//UPDATE


app.put('/users/:TN', function (req, res, next) {
    connection.query(
        'UPDATE `users` SET  `prefix`= ? ,`fname`= ? ,`lname`= ? ,`tel`= ? , `role`= ?, `TN`=? WHERE TN = ?',
        [req.body.prefix, req.body.fname ,req.body.lname, req.body.tel, req.body.role, req.body.TN , req.params.TN ],
        function(err, results) {
            if(err) {
                res.json({status:'err',message:err})
                return
            }
            res.json({status:'OK',message:results});
        }
        );
    })


app.put('/repassword', jsonParser, function (req, res, next) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if(err){
                    res.json({status:'err',message:err})
                    return
                }
                connection.query(
                    'UPDATE `users` SET `password`= ? WHERE tel=?',[hash,req.body.tel],
                    function(err, results) {
                        if(err) {
                            res.json({status:'err',message:err})
                            return
                        }
                        res.json({status:'OK',message:results});
                    }
                    );
                })
            })

app.put('/changepassword', jsonParser, function (req, res, next) {
        bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
                if(err){
                    res.json({status:'err',message:err})
                    return
                }
                connection.query(
                    'UPDATE `users` SET `password`= ? WHERE TN=?',[hash,req.body.TN],
                    function(err, results) {
                        if(err) {
                            res.json({status:'err',message:err})
                            return
                        }
                        res.json({status:'OK',message:results});
                    }
                    );
                })
            })

//UPDATE

//DELETE
  app.delete('/clearwomen', function (req, res, next) {
    connection.query(
      'DELETE FROM `appoinments` WHERE AN = ?',
      [req.body.AN],
      function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json({status:'OK'})
      }
    );
  })


  app.delete('/clearwomens', function (req, res, next) {
    connection.query(
      'DELETE FROM `appoinmentss` WHERE AN = ?',
      [req.body.AN],
      function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json({status:'OK'})
      }
    );
  })


  app.delete('/clearwomenss', function (req, res, next) {
    connection.query(
      'DELETE FROM `appoinmentsss` WHERE AN = ?',
      [req.body.AN],
      function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json({status:'OK'})
      }
    );
  })


  app.delete('/clearman', function (req, res, next) {
    connection.query(
      'DELETE FROM `manappoinments` WHERE AN = ?',
      [req.body.AN],
      function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json({status:'OK'})
      }
    );
  })



  app.delete('/blocklist', function (req, res, next) {
    connection.query(
      'DELETE FROM `blocklist` WHERE TN = ?',
      [req.body.TN],
      function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json({status:'OK'})
      }
    );
  })



  app.delete('/cancellist', function (req, res, next) {
    connection.query(
      'DELETE FROM `cancellist` WHERE TN = ?',
      [req.body.TN],
      function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json({status:'OK'})
      }
    );
  })


app.delete('/users', function (req, res, next) {
    connection.query(
      'DELETE FROM `users` WHERE TN = ?',
      [req.body.TN],
      function(err, results) {
        if(err) {
            res.json({status:'err',message:err})
            return
        }
        res.json({status:'OK'})
      }
    );
  })

//DELETE

app.listen(PORT, function () {
    console.log(`CORS-enabled web server listening on port ${PORT}`)
  })