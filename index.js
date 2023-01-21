const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');

const { Queue } = require('bullmq');

// * Redis Connection
const redisOptions = {
    host: 'localhost',
    port: 16379,
};

const imageJobQueue = new Queue("imageJobQueue", {
    connection: redisOptions
});

async function addJob(job) { 
    await imageJobQueue.add(job.type, job);
}

const app = express();

const PORT = process.env.PORT || 5000;

// Middlewares
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());


// * ROUTES
app.get('/', (req, res) => {
    res.render('form')
})

app.post('/upload', async (req, res) => {
  const { image } = req.files;

  if (!image) return res.sendStatus(400);

  await addJob({
    type: 'processUploadedImages',
    image: {
      data: image.data.toString('base64'),
      name: image.name,
    },
  });

  res.redirect('/result');
});


app.get('/result', (req, res) => {
    const imgDirPath = path.join(__dirname, './public/images');
    let imgFiles = fs.readdirSync(imgDirPath).map(image => {
        return `images/${image}`;
    });

    res.render('result', { imgFiles });
});


app.listen(PORT, () => console.log(`Server listening on ${PORT}`));