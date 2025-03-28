// Fetch token largest accounts.
export const fetchLargestAccounts = (apiHelius, contract, signal) => {
	return fetch(apiHelius, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'getTokenLargestAccounts',
			params: [contract],
		}),
		signal,
	})
}

// Fetch token supply.
export const fetchTokenSupply = (apiHelius, contract, signal) => {
	return fetch(apiHelius, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'getTokenSupply',
			params: [contract],
		}),
		signal,
	})
}

// Fetch Account Info for searching token on acc
export const fetchLimitedAccount = (urlHelius, address, signal) => {
	return fetch(urlHelius, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'getAccountInfo',
			params: [address, { encoding: 'jsonParsed' }],
		}),
		signal,
	})
}

// Fetch is Developer Hold Token
export const fetchIsWalletHoldToken = (urlMoralis, apiMoralis, signal) => {
	return fetch(urlMoralis, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json',
			'X-API-KEY': apiMoralis,
		},
		signal,
	})
}

// Fetch token account info.
export const fetchAccountInfo = (apiHelius, contract, signal) => {
	return fetch(apiHelius, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'getAccountInfo',
			params: [
				contract,
				{
					encoding: 'jsonParsed',
				},
			],
		}),
		signal,
	})
}

// Fetch Burned Liquidity
export const fetchBurnedLiquidity = (apiHelius, contract, signal) => {
	return fetch(apiHelius, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'getTokenAccountsByOwner',
			params: [
				contract,
				{
					programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
				},
				{
					encoding: 'jsonParsed',
				},
			],
		}),
		signal,
	})
}

// Fetch snipers list
export const fetchSnipersList = (apiHelius, contract) => {
	return fetch(apiHelius, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: 1,
			method: 'getSignaturesForAddress',
			params: [contract, { limit: 100 }],
		}),
	})
}

// Bitquery Requests
export async function fetchDeveloperWallet(apiBitquery, contract) {
	const urlGraphql = 'https://streaming.bitquery.io/eap'
	const headersGraphql = {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${apiBitquery}`,
	}
	const graphqlQueryDevWallet = `
				query MyQuery {
  					Solana {
  					  Instructions(
  					    where: {Instruction: {Program: {Method: {in: ["initializeMint", "initializeMint2"]}, Address: {is: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"}}, Accounts: {includes: {Address: {is: "${contract}"}}}}}
  					  ) {
  					    Block {
  					      Time
  					    }
  					    Transaction {
  					      Signature
  					      Signer
  					    }
  					  }
  					}
				}`
	try {
		const responseGraphql = await fetch(urlGraphql, {
			method: 'POST',
			headers: headersGraphql,
			body: JSON.stringify({ query: graphqlQueryDevWallet }),
		})
		if (!responseGraphql.ok) {
			throw new Error(`HTTP error! Status: ${responseGraphql.status}`)
		}
		const data = await responseGraphql.json()
		console.log(data)
	} catch (error) {
		console.error('Error fetching data from Bitquery:', error)
	}
}

import { apiHelius } from '../API/api__4holders'
// Get Time Token Created Ago
import { convertTimestampToHours } from '../primitiveMethods/holdersMethods4Primitive'
export async function tokenCreatedAgo(chain, contract) {
	const dexScreenerUrl = `https://api.dexscreener.com/token-pairs/v1/${chain}/${contract}`
	const requestCreatedTime = await fetch(dexScreenerUrl)
	const response = await requestCreatedTime.json()
	const timeCreated = convertTimestampToHours(response[0].pairCreatedAt)
	return timeCreated
}
