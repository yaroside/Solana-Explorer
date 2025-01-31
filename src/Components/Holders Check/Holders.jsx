// React
import React, { useState, useEffect, useMemo, useContext } from 'react'
// Api
import { apiHelius, apiMoralis, apiBitquery } from './API/api__4holders'
// Fetch Requests
import {
	fetchLargestAccounts,
	fetchTokenSupply,
	fetchIsWalletHoldToken,
	fetchAccountInfo,
	fetchLimitedAccount,
	tokenCreatedAgo,
} from './fetchMethods/fetchMethods'
// Components
import TopHoldersBlock from './TopHoldersBlock'
import AdditionalInfoBlock from './AdditionalnfoBlock'

export default function Holders({ requestData }) {
	const { chain, contract } = requestData

	const [dataCrypto, setDataCrypto] = useState({
		whalesInfo: {
			whalesSupply: null,
			whalesList: null,
		},
		developerInfo: {
			amount: '',
			walletAddress: null,
		},
		checkList: {
			mintable: null,
			freezable: null,
			liquidityBurned: null,
		},
		snipersInfo: {},
		tokenMint: contract,
		tokenSupplyAmount: null,
	})

	const [lastContract, setLastContract] = useState(null)
	const [loading, setLoading] = useState(true)

	const fetchWhalesSupply = async contract => {
		const urlHelius = `https://mainnet.helius-rpc.com/?api-key=${apiHelius.apiHelius}`

		try {
			const [largestAccountsResponse, tokenSupplyResponse] = await Promise.all([
				fetchLargestAccounts(urlHelius, contract),
				fetchTokenSupply(urlHelius, contract),
			])

			if (!largestAccountsResponse.ok || !tokenSupplyResponse.ok) {
				throw new Error('Failed to fetch LTD data')
			}

			const largestAccountsData = await largestAccountsResponse.json()
			const tokenSupplyData = await tokenSupplyResponse.json()

			const whalesTop15 = largestAccountsData.result.value.slice(0, 15)
			const delay = time => new Promise(resolve => setTimeout(resolve, time))
			let amountWhales = 0
			let whalesInfoArray = []
			for (const whale of whalesTop15) {
				const tokenAddress = whale.address
				const requestWhaleAddress = await fetchLimitedAccount(
					urlHelius,
					tokenAddress
				)
				const whaleMainAddressInfo = await requestWhaleAddress.json()
				const whaleMainAddress =
					whaleMainAddressInfo.result?.value?.data?.parsed?.info?.owner || null
				const whaleTokenAmountRaw =
					parseFloat(
						whaleMainAddressInfo.result?.value?.data?.parsed?.info?.tokenAmount
							?.amount
					) || 0
				const whaleTokenAmount = parseFloat(whaleTokenAmountRaw) || 0
				amountWhales += whaleTokenAmount

				let whaleObject = {
					tokenAddress: tokenAddress,
					whaleAddress: whaleMainAddress,
					whaleTokenAmount: whaleTokenAmount,
				}
				whalesInfoArray.push(whaleObject)
				await delay(175)
			}
			setDataCrypto(prev => ({
				...prev,
				tokenSupplyAmount: tokenSupplyData.result.value.amount,
				whalesInfo: {
					...prev.whalesInfo,
					whalesList: whalesInfoArray,
					whalesSupply: amountWhales,
				},
			}))
		} catch (error) {
			console.error('Error in fetchLTD:', error.message)
		}
	}

	const fetchTokenInfo = async contract => {
		const urlHelius = `https://mainnet.helius-rpc.com/?api-key=${apiHelius.apiHelius}`
		try {
			const [accountInfo] = await Promise.all([
				fetchAccountInfo(urlHelius, contract),
			])

			if (!accountInfo.ok) {
				throw new Error('Failed to fetch AS data')
			}

			const checkListData = await accountInfo.json()

			setDataCrypto(prev => ({
				...prev,
				checkList: {
					...prev.checkList,
					mintable:
						checkListData.result?.value?.data?.parsed?.info?.mintAuthority,
					freezable:
						checkListData.result?.value?.data?.parsed?.info?.freezeAuthority,
					liquidityBurned:
						checkListData.result?.value?.data?.parsed?.info?.supply,
				},
			}))
		} catch (error) {
			console.error('Error in fetchAS:', error.message)
		}
	}

	const fetchGetDeveloperAddress = async (chain, contract) => {
		const timeCreate = await tokenCreatedAgo(chain, contract)
		if (timeCreate) {
			return
		} else {
			const urlGraphql = 'https://streaming.bitquery.io/eap'
			const headersGraphql = {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiBitquery.apiBitquery}`,
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
				const developerWallet =
					data.data?.Solana?.Instructions[0]?.Transaction?.Signer

				const amountOnDeveloperWallet = await fetchIsWalletHoldToken(
					apiMoralis.urlMoralisTokens(developerWallet),
					apiMoralis.apiMoralis
				)
				const amountOnDeveloperWalletData = await amountOnDeveloperWallet.json()
				let developerAmount = 0

				for (const token of amountOnDeveloperWalletData) {
					if (token.mint === contract) {
						developerAmount = token.amountRaw
						break
					}
				}
				setDataCrypto(prev => ({
					...prev,
					developerInfo: {
						...prev.developerInfo,
						walletAddress: developerWallet,
						amount: developerAmount,
					},
				}))
			} catch (error) {
				console.error('Error fetching data from Bitquery:', error)
			}
		}
	}

	const fetchSnipersList = async contract => {
		const urlGraphql = 'https://streaming.bitquery.io/eap'
		const headersGraphql = {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiBitquery.apiBitquery}`,
		}
		const graphqlQuerySnipersList = `
	    		query MyQuery {
	        		Solana {
	            		DEXTrades(
	                		where: {Transaction: {Result: {Success: true}}, Instruction: {Accounts: {includes: {Token: {Mint: {in: "${contract}"}}}}}}
	                		limit: {count: 20}
	                		orderBy: {ascendingByField: "Block_Time"}
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
				body: JSON.stringify({ query: graphqlQuerySnipersList }),
			})
			if (!responseGraphql.ok) {
				throw new Error(`HTTP error! Status: ${responseGraphql.status}`)
			}
			const snipersData = await responseGraphql.json()
			const snipersTransactions = snipersData.data?.Solana?.DEXTrades || []
			const previousSniperAddresses = []
			let updatedSnipersInfo = {
				snipersSupply: 0,
				snipersList: [],
			}

			for (const item of snipersTransactions) {
				const addressSniper = item.Transaction.Signer

				if (previousSniperAddresses.includes(addressSniper)) {
					continue
				}

				const requestSniperWallet = await fetchIsWalletHoldToken(
					apiMoralis.urlMoralisTokens(addressSniper),
					apiMoralis.apiMoralis
				)

				if (requestSniperWallet) {
					const requestSniperWalletData = await requestSniperWallet.json()
					let sniperAmount = 0

					if (requestSniperWalletData.length > 0) {
						for (const token of requestSniperWalletData) {
							if (token.mint === contract && parseFloat(token.amountRaw) > 0) {
								sniperAmount = parseFloat(token.amountRaw)
								break
							}
						}
						if (sniperAmount > 0) {
							previousSniperAddresses.push(addressSniper)
							updatedSnipersInfo.snipersList.push({
								sniperAddress: addressSniper,
								sniperAmount: sniperAmount,
							})
							updatedSnipersInfo.snipersSupply += sniperAmount
						}
					}
				}
			}
			setDataCrypto(prevState => ({
				...prevState,
				snipersInfo: updatedSnipersInfo,
			}))
		} catch (error) {
			console.error('Error fetching data from Bitquery:', error)
		}
	}

	useEffect(() => {
		const controller = new AbortController()

		const executeFetches = async () => {
			setLoading(true)
			await fetchWhalesSupply(contract)
			await fetchTokenInfo(contract)
			await fetchGetDeveloperAddress(chain, contract)
			await fetchSnipersList(contract)
			setLoading(false)
		}

		if (contract && contract !== lastContract) {
			setLastContract(contract)
			executeFetches()
		}

		return () => controller.abort()
	}, [contract])

	return (
		<section className='holders__check'>
			<TopHoldersBlock
				whalesInfo={dataCrypto.whalesInfo}
				tokenSupply={dataCrypto.tokenSupplyAmount}
				loading={loading}
			/>
			<AdditionalInfoBlock
				checkList={dataCrypto.checkList}
				tokenSupply={dataCrypto.tokenSupplyAmount}
				developerInfo={dataCrypto.developerInfo}
				snipersInfo={dataCrypto.snipersInfo}
				loading={loading}
			/>
		</section>
	)
}
