const express = require('express');

const app = express();

console.log('JS is awesome!');

app.use('*', (req, res) => {
  console.log('Был запрос от браузера');
  res.send('<h1>Ну это мол HTML тебе в ответ</h1>');
});

const listener = app.listen(4444, () => {
  console.log(`Web-server run at port ${listener.address().port}`);
});
