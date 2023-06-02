const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = 3001;

app.get('/video-info', async (req, res) => {
  try {
    const url = 'https://lvpr.tv/?v=542dr3uvnpn4ds52';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    // Retrieve video duration
    const videoDuration = await page.evaluate(() => {
      const video = document.querySelector('video');
      video.play();
      return video.duration;
    });

    // Wait for 2 seconds for video to play
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Capture screenshot and convert to data URL
    const screenshotBuffer = await page.screenshot({ fullPage: true });
    const screenshotBase64 = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;

    await browser.close();

    // Send video duration and screenshot as JSON
    res.json({ duration: videoDuration, screenshot: screenshotBase64 });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
