const { Worker } = require('bullmq');

const { processUploadImages } = require('./utils');

const workerHandler = job => {
    console.log("Starting Job:", job.name);
    processUploadImages(job.data);
    console.log("Finished Job:", job.name);
    return;
}

const workerOptions = {
    connection: {
        host: "localhost",
        port: 16379
    }
};

const worker = new Worker("imageJobQueue", workerHandler, workerOptions);

console.log("Worker started...");