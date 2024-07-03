const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));

app.use(
  express.json({
    type: ['application/json', 'application/reports+json'],
  })
);
app.use(express.urlencoded());

app.get('/', (req, res) => {
  // Note: report_to and not report-to for NEL.
  res.set(
    'NEL',
    JSON.stringify({ report_to: 'network-errors', max_age: 2592000 })
  );

  // The Report-To header tells the browser where to send network errors.
  // The default group (first example below) captures interventions and
  // deprecation reports. Other groups, like the network-error group, are referenced by their "group" name.
  res.set(
    'Report-To',
    JSON.stringify({
      group: 'network-errors',
      max_age: 20,
      endpoints: [
        {
          url: 'https://stackblitzstartersmykgk9-p2sq--3010--70dbe416.local-credentialless.webcontainer.io/report',
        },
      ],
    })
  );

  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.post('/report', (req, res) => {
  console.log('REPORT!', req.body);
  res.status(200).send();
});

app.get('/normal', (_, res) => {
  res.status(200).send();
});

app.get('/fail', (_, res) => {
  res.status(404).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
