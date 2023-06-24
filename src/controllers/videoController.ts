import { Request, Response } from 'express';
import puppeteer from 'puppeteer';
import Video, { IVideo } from '../models/videos';

export const getVideoInfo = async (req: Request, res: Response): Promise<void> => {
  try {
    const url = 'https://lvpr.tv/?v=542dr3uvnpn4ds52';

    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 720 });
    await page.goto(url, { waitUntil: 'networkidle2' });

    const videoDuration = await page.evaluate(() => {
      const video = document.querySelector('video');
      video.play();
      return video.duration;
    });

    await new Promise(resolve => setTimeout(resolve, 2000));

    const screenshotBuffer = await page.screenshot({ fullPage: true });
    const screenshotBase64 = `data:image/png;base64,${screenshotBuffer.toString('base64')}`;

    await browser.close();

    const videoInfo: IVideo = new Video({
      url: url,
      duration: videoDuration,
      screenshot: screenshotBase64
    });

    await videoInfo.save();
    console.log("Video info saved to MongoDB.");

    res.json({ duration: videoDuration, screenshot: screenshotBase64 });
  } catch (error) {
    console.error('Error processing video:', error);
    res.status(500).json({ error: 'Failed to process video' });
  }
};
