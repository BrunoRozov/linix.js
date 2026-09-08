const express = require('express')
const app = express()
const fs = require('fs')


const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  fs.readFile('./tasks', 'utf8', (err, data) => {
    console.log('Reading tasks file...')
     if (err) {
      return console.error(err)
    }
    
    const tasks = data.split('\n')
    res.render('index', {tasks: tasks}) 
  })
})
        

app.listen(1569, () => {
  console.log('Server running on port 1569')
})
