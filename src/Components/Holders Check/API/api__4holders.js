const apiHelius = {
	apiHelius: 'YOUR_HELIUS_API_KEY',
}

const apiMoralis = {
	apiMoralis: 'YOUR_MORALIS_API_KEY',
	urlMoralisTokens: function (address) {
		return `https://solana-gateway.moralis.io/account/mainnet/${address}/tokens`
	},
}

const apiBitquery = {
	apiBitquery: 'YOUR_BITQUERY_API_KEY',
}

export { apiHelius, apiMoralis, apiBitquery }
