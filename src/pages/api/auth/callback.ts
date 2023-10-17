import axios from "axios";
import { NextApiRequest, NextApiResponse } from 'next';

const CLIENT_ID = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || '';
const CLIENT_SECRET = process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_SECRET;

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== 'GET') {
        return res.status(405).end();
    }

    const code = req.query.code;
    const protocol = req.headers['x-forwarded-proto'] || 'http';
    const host = req.headers.host;
    const redirectUri = `${protocol}://${host}/api/auth/callback`;

    try {
        const response = await axios.post('https://oauth2.googleapis.com/token', {
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            code,
            grant_type: 'authorization_code',
            redirect_uri: redirectUri
        });

        const accessToken = response.data.access_token;

        // Redirect to settings with the access token in the URL fragment
        res.redirect(`/settings#access_token=${accessToken}`);

        // Save the access token for the user in your database, or send it to the frontend to use in the next step.

        // res.redirect('/settings'); // Redirect to settings or where you want to fetch videos.

    } catch (error: any) {
        console.error("Error fetching token", error);
        res.status(error.response?.status || 500).json(error.response?.data);
    }
};
