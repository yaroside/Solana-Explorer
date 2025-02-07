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
		'ory_at_Jc-fK1rMwaNfgyrcx7Dy--p56v_sOYWyzPnsjzN6Eo0.3vcJy2cEUecx3xetp35_m3xwDiIwPAa5vAnNW7FkUfo	',
}

export { apiHelius, apiMoralis, apiBitquery }
