const Url = require('../models/Url');
const { nanoid } = require('nanoid'); // Assuming you have nanoid installed

// Create a short URL
async function createShortUrl(req, res) {
  const { longUrl } = req.body;
  const baseUrl = process.env.BASE_URL;

  // Check if longUrl is provided
  if (!longUrl) {
    return res.status(400).json({ message: 'URL required' });
  }

  // Basic URL validation
  const urlRegex = /^(https?:\/\/[^\s]+)/;
  if (!urlRegex.test(longUrl)) {
    return res.status(400).json({ message: 'Invalid URL' });
  }

  try {
    // Check if the URL already exists
    let urlDoc = await Url.findOne({ url: longUrl });
    if (urlDoc) {
      const shortUrl = `${baseUrl}/${urlDoc.shortUrlId}`;
      return res.status(200).json({ shortUrl, clicks: urlDoc.clicks });
    }

    // Generate a unique short URL ID
    const shortUrlId = nanoid(7); // 7-character unique ID
    const shortUrl = `${baseUrl}/${shortUrlId}`;

    // Create and save new URL document
    urlDoc = new Url({
      url: longUrl,
      shortUrlId,
      clicks: 0,
      date: new Date()
    });
    await urlDoc.save();

    return res.status(200).json({ shortUrl, clicks: 0 });
  } catch (err) {
    console.error('Error creating short URL:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

// Redirect to original URL
async function redirectToOriginalUrl(req, res) {
  const { shortUrlId } = req.params;

  try {
    const urlDoc = await Url.findOne({ shortUrlId });
    if (!urlDoc) {
      return res.status(404).json({ message: 'URL not found' });
    }

    // Increment clicks
    urlDoc.clicks += 1;
    await urlDoc.save();

    // Redirect to original URL
    return res.redirect(urlDoc.url);
  } catch (err) {
    console.error('Error redirecting:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

// Delete a URL
async function deleteUrl(req, res) {
  const { longUrl } = req.body;

  if (!longUrl) {
    return res.status(400).json({ message: 'URL required' });
  }

  try {
    const result = await Url.deleteOne({ url: longUrl });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'No such URL found' });
    }

    return res.status(200).json({ message: `URL ${longUrl} deleted` });
  } catch (err) {
    console.error('Error deleting URL:', err);
    return res.status(500).json({ message: 'Server Error' });
  }
}

module.exports = {
  createShortUrl,
  redirectToOriginalUrl,
  deleteUrl
};
