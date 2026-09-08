const express = require('express')
const app = express()

const path = require('path')
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
  // siia tuleb järka kood //
  res.render('index')
})

app.listen(1568, () => {
  console.log('node:internal/modules/cjs/loader:1568')
})