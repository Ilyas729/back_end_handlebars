import express, { request, response } from 'express'
import cors from 'cors'
import { engine } from 'express-handlebars'
import  sqlite3  from 'sqlite3'

const server = express()

const db = new sqlite3.Database('./clients.db')

server.use(cors())
server.use(express.json())
server.use(express.urlencoded({ extended: true }))
server.use('/', express.static('./public'))

server.engine('.hbs', engine({ extname: ".hbs" }))
server.set('view engine', '.hbs')
server.set('views', './pages')

server.post('/suggest', (request, response) => {
    const sql= 'INSERT INTO comments (type, name, "group", date, message, status) VALUES (?, ?, ?, ?, ?, ?);'

    console.log(request.body);
    
    const params = [
        request.body.type,
        request.body.name,
        request.body.group,
        new Date().toLocaleDateString(),
        request.body.message,
        'not_accepted'
    ]

    db.run(sql, params, (error) => {
        console.log(error);
        response.redirect('/accepted')
    })
})

server.get('/accepted', (request, response) => {
    response.render('accepted')
})

server.get('/sugestions', (request, response) => {
    db.all("select * from comments ", (error,rows) => {
        console.log(error);
        
         response.render('suggestions', {
            comments: rows
         })
    })
   
})

server.get('/suggestions/:id/accept', (request, response) => {
    db.run('UPDATE comments SET status=? WHERE id=?', ['accepted', request.params.id], (error) => {
        console.log(error);
        
        response.redirect('/sugestions')
    })
})


server.get('/suggestions/:id/decline', (request, response) => {
    db.run('UPDATE comments SET status=? WHERE id=?', ['declined', request.params.id], (error) => {
        console.log(error);
        
        response.redirect('/sugestions')
    })
})
server.get('/', (request, response) => {
    response.render('suggest')
})

server.listen(8080, () => console.log("Server is running on port 8080"))