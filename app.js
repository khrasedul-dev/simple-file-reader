import express from 'express';
import https from 'https';

const app = express();


function getContentType(ext) {
    switch (ext) {
        case 'pdf':
            return 'application/pdf';
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'webp':
            return 'image/webp';
        case 'doc':
            return 'application/msword';
        case 'docx':
            return 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        case 'xls':
            return 'application/vnd.ms-excel';
        case 'xlsx':
            return 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        case 'ppt':
            return 'application/vnd.ms-powerpoint';
        case 'pptx':
            return 'application/vnd.openxmlformats-officedocument.presentationml.presentation';
        case 'txt':
            return 'text/plain';
        case 'csv':
            return 'text/csv';
        default:
            return 'application/octet-stream';
    }
}

app.get('/preview', (req, res) => {
    try {
        const url = req.query.url;

        if (!url) {
            return res.status(400).send('URL is required');
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            return res.status(400).send('Invalid URL');
        }

        const ext = url.split('.').pop().toLowerCase();
        const contentType = getContentType(ext);

        https.get(url, (response) => {
            console.log(response.headers['content-type'])
            res.setHeader('Content-Type', contentType);
            response.pipe(res);
        }).on('error', (error) => {
            console.error('Error fetching URL:', error);
            res.status(500).send('Internal Server Error');
        });

    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
