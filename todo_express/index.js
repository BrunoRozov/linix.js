const express = require('express')
const app = express()
const fs = require('fs')


const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      const tasks = data.split('\n')
      resolve(tasks)
    })
  })
}


app.get('/', (req, res) => {
  readFile('./tasks')
    .then(tasks => {
      console.log("1:", tasks)
      res.render('index', { tasks: tasks });
    })
})   

app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  readFile('./tasks')
    .then(tasks => {
      tasks.push(req.body.task)
      const data = tasks.join('\n')
      fs.writeFile('./tasks', data, (err) => {
        if (err) {
          console.error(err)
          return
        }
        res.redirect('/')
      })
    })
})


        

app.listen(1569, () => {
  console.log('Server running on port 1569')
})
