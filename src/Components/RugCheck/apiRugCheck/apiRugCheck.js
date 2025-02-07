const apiRugCheckInfo = {
	apiRugcheck: function (contract) {
		return `https://api.rugcheck.xyz/v1/tokens/${contract}/report/summary`
	},
	rugCheckTokenInfo: function (contract) {
		return `https://rugcheck.xyz/tokens/${contract}`
	},
}
export { apiRugCheckInfo }
