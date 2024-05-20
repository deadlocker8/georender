import {Application} from "./app.js";
import express from 'express';
import fileUpload from 'express-fileupload';
import fs from "fs";

const server = express()
server.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));
const port = 3000

server.post('/', async(req, res, next) =>
{
    if(!req.files || Object.keys(req.files).length === 0)
    {
        return res.status(400).send('No files were uploaded.');
    }

    const fileExtension = req.files.gpx.name.split('.')[1];
    if(fileExtension.toLowerCase() !== 'gpx')
    {
        return res.status(400).send('Unsupported file type. Allowed: gpx');
    }

    const filePathWithExtension = req.files.gpx.tempFilePath + '.' + fileExtension
    const outFilePath = req.files.gpx.tempFilePath + '.jpg'
    fs.renameSync(req.files.gpx.tempFilePath, filePathWithExtension)

    const applicationArguments = ['-i', filePathWithExtension, '-o', outFilePath]
    applicationArguments.push(...process.argv.slice(2))
    const application = new Application(applicationArguments);
    const exitCode = await application.run();
    if(exitCode === 0)
    {
        res.sendFile(outFilePath, {}, function(err)
        {
            if(err)
            {
                next(err)
            }
            else
            {
                fs.unlinkSync(filePathWithExtension);
                fs.unlinkSync(outFilePath);
            }
        });
    }
    else
    {
        return res.status(500).send('Error rendering image');
    }
});

server.listen(port, () =>
{
    console.log(`Georender listening on port ${port}`)
});
