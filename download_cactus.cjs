const https = require('https');
const fs = require('fs');

const url = 'https://commons.wikimedia.org/w/index.php?curid=126440897';

https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/class="fullImageLink"[\s\S]*?href="([^"]+)"/);
    if (match) {
      let imgUrl = match[1];
      if (imgUrl.startsWith('//')) imgUrl = 'https:' + imgUrl;
      console.log('Downloading from:', imgUrl);
      
      const file = fs.createWriteStream('public/assets/cactus.png');
      https.get(imgUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (imgRes) => {
        imgRes.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log('Downloaded successfully to public/assets/cactus.png');
        });
      });
    } else {
      console.log('Could not find image URL.');
    }
  });
}).on('error', (e) => {
  console.error(e);
});
