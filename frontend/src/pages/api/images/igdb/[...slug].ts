import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';
import https from 'https';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (!slug || !Array.isArray(slug) || slug.length === 0) {
    return res.status(400).json({ error: 'Image path is required.' });
  }

  const imagePath = slug.join('/');
  const imageUrl = `https://images.igdb.com/igdb/image/upload/${imagePath}`;

  try {
    // Create a custom HTTPS agent to bypass SSL verification
    // This is for the specific ERR_CERT_AUTHORITY_INVALID issue with IGDB's CDN
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });

    const response = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      httpsAgent: agent,
    });

    // Get the content type from the IGDB response
    const contentType = response.headers['content-type'] || 'image/jpeg';

    // Send the image back to the client
    res.setHeader('Content-Type', contentType);
    res.send(response.data);
  } catch (error) {
    console.error('Error proxying IGDB image:', error);
    res.status(500).json({ error: 'Error fetching image.' });
  }
}
