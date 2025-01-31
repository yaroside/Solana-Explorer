const apiHelius = {
	apiHelius: 'e71565ca-168c-4c6d-b919-3e0da6aa4174',
}

const apiMoralis = {
	apiMoralis:
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJub25jZSI6ImI4ZmU2ZGNiLTVhZGQtNDM0NC04OWQyLTg0ZmFjZWI4NWYwMCIsIm9yZ0lkIjoiNDI3ODI3IiwidXNlcklkIjoiNDQwMDc0IiwidHlwZSI6IlBST0pFQ1QiLCJ0eXBlSWQiOiI1OTVkMmQ4Zi1jY2FkLTRjNGItOGIwOS0xNmQ5N2IyYWM0MWQiLCJpYXQiOjE3MzgwNzA5NjQsImV4cCI6NDg5MzgzMDk2NH0._t-OCHOM4cA_s3ygiqq7i7p4zIgU8CMKmr_jqIskc5Y',
	urlMoralisTokens: function (address) {
		return `https://solana-gateway.moralis.io/account/mainnet/${address}/tokens`
	},
}

const apiBitquery = {
	apiBitquery:
		'ory_at_JLWq4xwF1mG_GoGAnsJgutH83vsaRrP8f2-kcbwywVE.xRBKaXRPS6h9_TkEFCltEYJG7OVMbh0ISKC6gk1lEio',
}

export { apiHelius, apiMoralis, apiBitquery }
