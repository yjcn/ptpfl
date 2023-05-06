const { qBittorrentClient } = require('@robertklep/qbittorrent');

const downloadTorrentinqB = async (torrent, authKey, passKey, qb_client, qb_category) => {
	let autoTMM = false;
	if(qb_category){
		autoTMM = true;
	}
	const torrent_info = {
		"urls": `https://passthepopcorn.me/torrents.php?action=download&id=${torrent.Id}&authkey=${authKey}&torrent_pass=${passKey}`,
		"category": qb_category,
    	"autoTMM": autoTMM,
		// "paused": true
	}
	return await qb_client.torrents.add(torrent_info).then(msg =>{
		console.log("add torrent ",torrent.Id, "in qb",msg);
	});
};

module.exports = async ({ torrent, authKey, passKey }, config) => {
	if (!config.qb_username || !config.qb_password || !config.qb_host) {
		console.log('Please ensure you\'ve added your qb_host and qb_username and qb_password');
		process.exit();
	}
	try {
		const qb_client = new qBittorrentClient(config.qb_host, config.qb_username, config.qb_password);
		const info = qb_client.app.version();
		info.then(resp =>{
			console.log("login sucess qb version:",resp);
		}).catch(err =>{
			console.log("qb login err:",err);
			process.exit();
		});   
		return await downloadTorrentinqB(torrent, authKey, passKey, qb_client, config.qb_category);
	} catch(error) {
		console.log('Could not add torrent to qb:', error);
	}
};
