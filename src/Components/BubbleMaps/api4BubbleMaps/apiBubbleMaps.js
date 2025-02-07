const bubbleMaps = {
	iframeStatus: function (chain, contract) {
		return `https://api-legacy.bubblemaps.io/map-availability?chain=${chain}&token=${contract}`
	},
	iframeLink: function (chain, contract) {
		return `<iframe src="https://app.bubblemaps.io/${chain}/token/${contract}" />`
	},
}
export { bubbleMaps }
