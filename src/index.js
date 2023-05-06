const { validateConfig, fetchTorrents, torrentMatchesFilters, writeTorrentCache } = require('./utils'),
	sendDiscordNotification = require('./modules/discord'),
	downloadTorrent = require('./modules/download'),
	downloadTorrentinqB = require('./modules/qbittorrent');

module.exports = async function() {
	try {
		const config = await validateConfig()
		const { page } = config
		const	{ torrents, authKey, passKey, totalResults } = await fetchTorrents(config.apiUser, config.apiKey);
		let pageNum = Math.ceil(totalResults/50)
		if (page !== -1) {
			pageNum = page
		}
		if (pageNum >= 2) {
			for (let index = 2; index <= pageNum; index++) {
				const result = await fetchTorrents(config.apiUser, config.apiKey, index);
				torrents.push(...result.torrents);
			}
		}
		for (const torrent of torrents) {
			if (torrentMatchesFilters(torrent, config)) {
				await downloadTorrent({ torrent, authKey, passKey }, config);
				await downloadTorrentinqB({ torrent, authKey, passKey }, config);
				await sendDiscordNotification({ torrent, authKey, passKey }, config);
			}
		}

		writeTorrentCache(torrents);
	} catch(error) {
		console.log(error);
	}
}
