const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');
const fs = require('fs');
const stream = require('stream');
const util = require('util');
const cors = require('cors');
const ffmpegPath = '/ffmpeg/bin/ffmpeg.exe';
const outputTextFile = 'black_screen_data.txt';


const app = express();
const port = 3000;
const pipeline = util.promisify(stream.pipeline);

app.use(express.static('public'));
app.use(cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
console.log('node start');

app.post('/detect-black-screen', upload.single('video'), async (req, res) => {
    console.log('node start inside');
    console.log('Received video file.');
    if (!req.file) {
        return res.status(400).json({ error: 'No video file uploaded.' });
    }

    const videoBuffer = req.file.buffer;

    const ffmpegProcess = spawn(ffmpegPath, [
        '-i', 'pipe:0', // Read input from stdin (pipe)
        '-vf', 'blackdetect=d=0.1:pix_th=0.00',
        '-an', // Disable audio processing
        '-f', 'null', // Null output
        '-'
    ]);

    let blackScreens = [];
    let blackScreensRawOutput = [];

    ffmpegProcess.stderr.on('data', data => {
        const output = data.toString();
        const blackScreenRegex = /black_start:([0-9.]+) black_end:([0-9.]+) black_duration:([0-9.]+)/g;
        blackScreensRawOutput.push(output);
        const match = blackScreenRegex.exec(output);
        if (match) {
            const blackStart = parseFloat(match[1]);
            const blackEnd = parseFloat(match[2]);
            const blackDuration = parseFloat(match[3]);
            const blackScreenData = `Black Screen Detected - Start: ${blackStart}s, End: ${blackEnd}s, Duration: ${blackDuration}s\n`;
            blackScreens.push(blackScreenData);
            res.status(200).send(blackScreenData);
        }        
    });
    // Stream the videoBuffer to FFmpeg's stdin
    await pipeline(
        stream.Readable.from(videoBuffer),
        ffmpegProcess.stdin
    );

    ffmpegProcess.stdin.end(); // Close the input stream when done

    ffmpegProcess.on('exit', () => {
        const blackScreenData = blackScreens.join('\n');
        if (blackScreenData.length > 0) {
            const blackScreenDataJSON = JSON.stringify(blackScreensRawOutput);//Convert into JSON Format
            let finalOutput = blackScreenData + blackScreenDataJSON;
            fs.writeFile(outputTextFile, finalOutput, err => {
                if (err) {
                    console.error('Error writing data to file:', err);
                    res.status(500).json({ error: 'Error writing data to file.' });
                } else {
                    console.log('Black screen data saved to', outputTextFile);
                    //res.status(200).send(blackScreenData); // Send the data as the response
                }
            });
        }
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
