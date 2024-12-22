const { JSDOM } = require("jsdom");
const fs = require("fs");
const path = require('path');

const tmpDir = eagle.os.tmpdir(); 

const downloadImage = async (url, filepath) => {
	const response = await fetch(url);
	const arrayBuffer = await response.arrayBuffer();
	const buffer = Buffer.from(arrayBuffer);
	fs.writeFileSync(filepath, buffer);
};

eagle.onPluginCreate(async () => {
	let items = await eagle.item.get({ tags: ["VRChat"]  });
	items.forEach(async item => {
		const url = item.url;
		try {
			const response = await fetch(url);
			const html = await response.text();
			const { window } = new JSDOM(html);
			const DOMParser = window.DOMParser;
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const thumbnailUrl = doc.querySelector('meta[name="twitter:image"]').content;

			const filename = path.basename(thumbnailUrl);
			const filepath = path.join(tmpDir, filename);
			await downloadImage(thumbnailUrl, filepath);

			await item.setCustomThumbnail(filepath);
		} catch (error) {
			console.error('Error:', error);
		}
	});
});

eagle.onPluginShow(async () => {
	let items = await eagle.item.get({ tags: ["VRChat"]  });
	items.forEach(async item => {
		const url = item.url;
		try {
			const response = await fetch(url);
			const html = await response.text();
			const { window } = new JSDOM(html);
			const DOMParser = window.DOMParser;
			const parser = new DOMParser();
			const doc = parser.parseFromString(html, 'text/html');
			const thumbnailUrl = doc.querySelector('meta[name="twitter:image"]').content;

			const filename = path.basename(thumbnailUrl);
			const filepath = path.join(tmpDir, filename);
			await downloadImage(thumbnailUrl, filepath);

			await item.setCustomThumbnail(filepath);
		} catch (error) {
			console.error('Error:', error);
		}
	});
    await eagle.window.hide();
});