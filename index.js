const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const baseURL = 'https://www.minecraft-schematics.com';

const cookies = {
    /*
        To get these cookies, you need to (login/create an account)
        on the website and then inspect the cookies in your browser.
        
        Make sure to rename example.env to .env and fill in the values.
    */
    PHPSESSID: dotenv.PHPSESSID,
    cf_clearance: dotenv.cf_clearance,
    uid: dotenv.uid,
    ukey: dotenv.ukey,
    utoken: dotenv.utoken
}

let totalSchematics = 0;
let totalSkipped = 0;

async function getSchematics() {
    try {
        let realPage = 1;
        let linkPage = '';
        let hasSchematics = true;

        while (hasSchematics) {
            if (realPage === 1) {
                linkPage = '';
            } else {
                linkPage = realPage;
            }
            const response = await axios.get(`${baseURL}/top-rated/${linkPage}/`);
            const $ = cheerio.load(response.data);
            const links = $("a[href*='/schematic/']");

            if (links.length === 0) {
                hasSchematics = false;
            } else {
                for (let i = 0; i < links.length; i++) {
                    const link = $(links[i]).attr('href');
                    const schematicId = link.split('/schematic/')[1];
                    if (schematicId && schematicId.match(/^[0-9]+\/$/)) {
                        await getSchematicDetails(schematicId);
                    }
                }
                realPage++;
            }
        }
    } catch (error) {
        console.error('Error fetching schematics:', error);
    }
}

async function getSchematicDetails(schematicId) {
  try {
    const detailResponse = await axios.get(`${baseURL}/schematic/${schematicId}`);
    const detail$ = cheerio.load(detailResponse.data);
    const schematicName = detail$('div.span9 h1').first().text().trim();
    const cleanedName = schematicName.replace(/[^a-zA-Z0-9 \-_]/g, '');

    if (cleanedName) {
      await downloadSchematic(schematicId, cleanedName);
    }
  } catch (error) {
    console.error(`Error fetching schematic details for ID ${schematicId}:`, error);
  }
}

async function downloadSchematic(schematicId, schematicName) {
    schematicId = schematicId.replace(/\D/g, ''); // Remove the / to prevent path traversal
    const downloadUrl = `${baseURL}/schematic/${schematicId}/download/`;
    try {
        const response = await axios({
            method: 'get',
            url: downloadUrl,
            responseType: 'arraybuffer',
            headers: {
                "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.6",
                "Cookie": Object.keys(cookies).map(key => `${key}=${cookies[key]}`).join('; '),
                "Referer": `${baseURL}/schematic/${schematicId}/`,
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
                "sec-ch-ua": "\"Chromium\";v=\"124\", \"Brave\";v=\"124\", \"Not-A.Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"Windows\"",
                "sec-fetch-dest": "document",
                "sec-fetch-mode": "navigate",
                "sec-fetch-site": "same-origin",
                "sec-fetch-user": "?1",
                "sec-gpc": "1",
                "upgrade-insecure-requests": "1"
            }
        });

        const ext = '.schematic';
        let fileName = `${schematicName}_${schematicId}${ext}`;
        let savePath = path.join(__dirname, 'schematics', fileName);

        const files = fs.readdirSync(path.join(__dirname, 'schematics'));
        const existingFiles = files.filter(file => file.includes(schematicId));

        if (existingFiles.length > 0) {
            totalSkipped++;
            return;
        }

        fs.writeFileSync(savePath, response.data);
        totalSchematics++;
    } catch (error) {
        console.error(`Error downloading schematic ID ${schematicId}:`, error);
        if (error.response) {
            console.error("Response status:", error.response.status);
            console.error("Response headers:", error.response.headers);
            console.error("Response data:", error.response.data);
        }
    }
}

setInterval(() => {
    const symbols = ['-', '\\', '|', '/'];
    let index = 0;
    console.log('');
    setInterval(() => {
        process.stdout.write(`\r    [${symbols[index]}] Fetching schematics... ; Total: ${totalSchematics} ; Skipped: ${totalSkipped}`);
        index = (index + 1) % symbols.length;
    }, 250);
    console.clear();
}, 1000);

getSchematics();