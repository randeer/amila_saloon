// pages/api/cloudinary-gallery.js
export default async function handler(req, res) {
  const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME || 'dypqcurws';
  const API_KEY = process.env.CLOUDINARY_API_KEY || '428257631733325';
  const API_SECRET = process.env.CLOUDINARY_API_SECRET || 'Iz0QyPS976Oe2UGHD0mBUy4paGo';
  const FOLDER_PATH = 'web';

  try {
    // Using Cloudinary Admin API to search for images in the folder
    const auth = Buffer.from(`${API_KEY}:${API_SECRET}`).toString('base64');
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/resources/search?expression=folder%3D${FOLDER_PATH}*&max_results=100`,
      {
        headers: {
          'Authorization': `Basic ${auth}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Cloudinary API error: ${response.status}`);
    }

    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Cloudinary API error:', error);
    
    // Fallback: Try the public API method
    try {
      const fallbackResponse = await fetch(
        `https://res.cloudinary.com/${CLOUD_NAME}/image/list/${FOLDER_PATH}.json`
      );
      
      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        res.status(200).json(fallbackData);
      } else {
        throw new Error('Fallback also failed');
      }
    } catch (fallbackError) {
      res.status(500).json({ 
        error: 'Failed to fetch images',
        resources: []
      });
    }
  }
}
