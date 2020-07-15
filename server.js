//Express JS
const express = require('express')
const app = express()

//EJS
const path = require('path')

//Body Parser Require
const bodyParser = require('body-parser');

//SQLite3
const { query } = require('express');
const { Console } = require('console');
const sqlite3 = require('sqlite3').verbose();
const port = 3000

//Database Integration SQLite3
const db_name = path.join(__dirname, "./db/bread.db")
const db = new sqlite3.Database(db_name, (err) => {
    if (err) {
        return console.error(err.message)
    }
    console.log("Successful Database Integration : 'bread.db'")
})

app.set('views', path.join(__dirname, 'view'))//join : menggabungkan 2 path, dirname : jika aplikasi dipindah-pindah agar tetap menyesuaikan 
app.set('view engine', 'ejs')

//Body Parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

//Membuat Router Pertama / => List, Search dan Pagination
app.get('/', (req, res) => {
    let dataSearch = []
    let search = false

    if (req.query.checkId && req.query.id) {
        dataSearch.push(`id = ${req.query.id}`)
        search = true
    }

    if (req.query.checkString && req.query.string) {
        dataSearch.push(`string = "${req.query.string}"`)
        search = true
    }

    if (req.query.checkInteger && req.query.integer) {
        dataSearch.push(`integer = "${req.query.integer}"`)
        search = true
    }

    if (req.query.checkFloat && req.query.float) {
        dataSearch.push(`float = "${req.query.float}"`)
        search = true
    }

    if (req.query.checkDate && req.query.startDate && req.query.endDate) {
        dataSearch.push(`date BETWEEN '${req.query.startDate}' AND '${req.query.endDate}'`)
        search = true
    }

    if (req.query.checkBoolean && req.query.boolean) {
        dataSearch.push(`boolean = "${req.query.boolean}"`)
        search = true
    }

    let searchFinal = ""
    if (search) {
        searchFinal += `WHERE ${dataSearch.join(' AND ')}`
    }
   
    const page = req.query.page || 1
    const limit = 5
    const offset = (page - 1) * limit


    db.all(`SELECT COUNT (id) as total FROM bread`, (err, rows) => {
        if (err) {
            return console.error(err.message)
        } else if (rows == 0) {
            return res.send('data not found')
        } else {
            total = rows[0].total
            const pages = Math.ceil(total / limit)
            
            let sql = `SELECT * FROM bread ${searchFinal} LIMIT ? OFFSET ?`
            db.all(sql, [limit,offset], (err, rows) => {

                if (err) {
                    return console.error(err.message)
                } else if (rows == 0) {
                    return res.send('data can not be found');
                } else {
                    let data = [];
                    rows.forEach(row => {
                        data.push(row);
                    });
                    res.render('index', { data, page, pages })
                }
            })
        }
    })
})

//Membuat Router Kedua : add
app.get('/add', (req, res) => {
    res.render('add');
})

app.post('/add', (req, res) => {
    let hasil = req.body;
    db.serialize(() => {
        let sql = (`INSERT INTO bread (string, integer, float, date, boolean) VALUES(?,?,?,?,?)`)
        db.run(sql, [hasil.string, hasil.integer, hasil.float, hasil.date, hasil.boolean], (err) => {
            if (err) {
                return console.error(err.message)
            }
            res.redirect('/')
        })
    })
})

//Membuat Router Ketiga : delete
app.get('/delete/:id', (req, res) => {
    let id = req.params.id;
    let sql = `DELETE FROM bread WHERE id = ?`
    db.run(sql, id, (err) => {
        if (err) {
            return console.error(err.message)
        }
        res.redirect('/')
    })
})

//Membuat Router Keempat : edit
app.get('/edit/:id', (req, res) => {
    let id = req.params.id
    let sql = `SELECT * FROM bread WHERE id = ?`
    db.get(sql, id, (err, row) => {
        if (err) {
            return console.error(err.message)
        }
        res.render('edit', { row })
    })
})
app.post('/edit/:id', (req, res) => {
    let id = req.params.id
    let edit = [req.body.string, req.body.integer, req.body.float, req.body.date, req.body.boolean, id]
    let sql = `UPDATE bread SET string = ? , integer = ? , float = ? , date = ? , boolean = ? WHERE id = ?`

    db.run(sql, edit, (err) => {
        if (err) {
            return console.error(err.message)
        }
        res.redirect('/')
    })
})

app.listen(port, () => console.log(`Application Interface at http://localhost:${port}`))