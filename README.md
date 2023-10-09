
# Video Black Screen Detection with FFmpeg

Video Black Screen Detection with FFmpeg
This project provides a simple web-based tool to detect black screen segments within video files using FFmpeg. It utilizes the Node.js server to process video uploads and return black screen detection results to the user.

Prerequisites
Before you begin, ensure you have the following prerequisites installed on your system:




## Node.js

[Download and Install Node.js](https://nodejs.org/)

## FFmpeg

[FFmpeg](https://ffmpeg.org/download.html)


## Clone this repository to your local machine:

Clone this repository to your local machine:

```bash
  git clone https://github.com/abishekkumars/ffmpeg-black-screen-detection.git

```
Install project dependencies:
```bash
cd ffmpeg-black-screen-detection
npm install

````
Start the Node.js server:
``` bash
node server.js
```
## Usage

Usage
Choose a video file using the "Browse" button.

Click the "Detect Black Screen" button to initiate the detection process.

The detected black screen segments and their durations will be displayed on the web page.

Additionally, the detection results will be saved to a file named black_screen_data.txt in the project directory.

Configuration
You can configure the black screen detection parameters by modifying the FFmpeg command in the server.js file. The default parameters are set to:
```bash
-vf 'blackdetect=d=0.1:pix_th=0.00':
```
 Detect black frames with a minimum duration of 0.1 seconds and a pixel threshold of 0.00.

