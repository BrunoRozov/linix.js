const { resolve } = require('dns')
const express = require('express')
const app = express()
const fs = require('fs')

const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({ extended: true }))

const readFile = (filename) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filename, 'utf8', (err, data) => {
      if (err) {
        console.error(err)
        return
      }
      const tasks = JSON.parse(data)
      resolve(tasks)
    })
  })
}

const writeFile = (filename, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(filename, data, 'utf-8', err => {
      if (err) {
        console.error(err)
        return
      }
      resolve(true)
    })
  })
}

app.get('/', (req, res) => {
  readFile('./tasks.json')
    .then(tasks => {
      console.log('GET / tasks data:', tasks)
      res.render('index', {
        tasks: tasks,
        error: null
      })
    })
})

app.post('/', (req, res) => {
    console.log('POST / req.body:', req.body)
    let error = null
    if (req.body.task.trim().length == 0) {
        error = 'please insert correct task data'
        readFile('./tasks.json')
        .then(tasks => {
            res.render('index', {
                tasks: tasks,
                error: error
            })
        })
    } else {
        readFile('./tasks.json')
        .then(tasks => {
            let index
            if (tasks.length === 0) {
                index = 0
            } else {
                index = tasks[tasks.length - 1].id + 1
            }

            const newTask = {
                id: index,
                task: req.body.task
            }

            tasks.push(newTask)
            const data = JSON.stringify(tasks, null, 2)
            writeFile('tasks.json', data)
            res.redirect('/')
        })
    }
})

app.get('/delete-task/:taskId', (req, res) => {
  console.log('DELETE route params:', req.params)
  let deletedTaskId = parseInt(req.params.taskId)
  readFile('./tasks.json')
  .then(tasks => {
    tasks.forEach((task, index) => {
      if (task.id === deletedTaskId) {
        tasks.splice(index, 1)
      }
    })
    const data = JSON.stringify(tasks, null, 2)
    writeFile('tasks.json', data)
    res.redirect('/')
  })
})

app.get('/update-task/:taskId', (req, res) => {
  const taskId = Number(req.params.taskId)
  console.log('GET /update-task route params:', req.params)

  readFile('./tasks.json')
    .then(tasks => {
      const task = tasks.find(item => item.id === taskId)
      console.log('Loaded task for update:', task)
      res.render('beta', {
        task,
        error: null
      })
    })
})

app.post('/update-task', (req, res) => {
  console.log('POST /update-task req.body:', req.body)

  const taskId = Number(req.body.taskId)
  const updatedTask = (req.body.task || '').trim()

  if (!updatedTask) {
    readFile('./tasks.json')
      .then(tasks => {
        const task = tasks.find(item => item.id === taskId)
        return res.render('beta', {
          task,
          error: 'please insert correct task data'
        })
      })
    return
  }

  readFile('./tasks.json')
    .then(tasks => {
      const index = tasks.findIndex(task => task.id === taskId)

      if (index === -1) {
        return res.redirect('/')
      }

      tasks[index].task = updatedTask
      const data = JSON.stringify(tasks, null, 2)
      console.log('Updated task saved to file:', tasks[index])
      writeFile('tasks.json', data)
      res.redirect('/')
    })
})

app.post('/delete-tasks', (req, res) => {
  const clearedTasks = []
    fs.writeFile('./tasks.json', JSON.stringify(clearedTasks, null, 2), () => {
      res.redirect('/')
    })
})

app.post('/delete-tasks', (req, res) => {
  readFile('./tasks.json')
    .then(tasks => {
      const clearedTasks = []
      const data = JSON.stringify(clearedTasks, null, 2)
      writeFile('tasks.json', data)
      res.redirect('/')
    })
})

app.listen(1569, () => {
  console.log('Server running on port 1569')
})
