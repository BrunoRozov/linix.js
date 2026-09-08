const express = require('express')
const app = express()
const fs = require('fs')


const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    fs.readFile('tasks.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err)
            return
        }
        console.log(data)
        console.timeLogger('data')
        const tasks = JSON.parse(data)
        res.render('index', { tasks })
    })
})          ._router,d[[f


app.listen(1568, () => {
  console.log('Server running on port 1568')
})
