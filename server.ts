import express from 'express'
import cors from 'cors'
import { engine } from 'express-handlebars'

import  sqlite3  from 'sqlite3'

const server = express()

const db = new sqlite3.Database('./database.db')

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))

server.engine('.hbs', engine({ extname: ".hbs" }))
server.set('view engine', '.hbs')
server.set('views', './pages')

server.post('/', (request, response) => {
    const sql= 'INSERT INTO clients (name, surname) VALUES (?, ?);'

    console.log(request.body);
    
    const params = [
        request.body.name,
        request.body.surname
    ]

    db.run(sql, params, (error) => {
        console.log(error);
        response.redirect('/')
    })
})

server.post('/history', (request, response) => {
    const sql= 'INSERT INTO history (client_id, amount, date, description) VALUES (?, ?, ?, ?);'

    console.log(request.body);
    
    const params = [
        request.body.client_id,
        request.body.amount,
        request.body.date,
        request.body.description
    ]

    db.run(sql, params, (error) => {
        console.log(error);
        response.redirect('/history')
    })
})


server.get('/delete/:id', (request, response) => {
    db.run('DELETE FROM clients WHERE id = ?', [request.params.id], (error) => {
        console.log(error)
        db.run('DELETE FROM history WHERE id = ?', [request.params.id], (error) => {
            console.log(error)
        })
        response.redirect('/')
    })
})

server.get('/history', (request, response) => {
    db.all('SELECT * FROM clients', (error, clients) =>{
     
        db.all('SELECT * FROM history;', (error, history) => {
            console.log(error)
        
            
            response.render('history', {
            clients, history
              })
        })
    })


})

server.get('/', (request, response) => {

    db.all('SELECT * FROM clients;', (error, rows) => {
        console.log(error)
        console.log(rows)
        
        response.render('index', {
            clients: rows
          })
    })
    
})

server.listen(8080, () => console.log("Server is running on port 8080"))