// React
import React, { useState, useEffect, useRef } from 'react'
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
	fetchBurnedLiquidity,
} from './fetchMethods/fetchMethods'
// holdersMethods
import { burnedLiquidityCalc } from './primitiveMethods/holdersMethods4Primitive'
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
		snipersInfo: {
			snipersSupply: 0,
			snipersList: [],
		},
		tokenMint: contract,
	})

	const [lastContract, setLastContract] = useState(null)
	const [loadingWhales, setLoadingWhales] = useState()
	const [loadingTokenInfo, setLoadingTokenInfo] = useState(true)
	const [loadingDeveloper, setLoadingDeveloper] = useState()
	const [loadingSnipers, setLoadingSnipers] = useState()
	const controllerRef = useRef(new AbortController())

	const fetchWhalesSupply = async contract => {
		setLoadingWhales(true)
		const urlHelius = `https://mainnet.helius-rpc.com/?api-key=${apiHelius.apiHelius}`
		try {
			const [largestAccountsResponse, tokenSupplyResponse] = await Promise.all([
				fetchLargestAccounts(urlHelius, contract, controllerRef.current.signal),
				fetchTokenSupply(urlHelius, contract, controllerRef.current.signal),
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
					tokenAddress,
					controllerRef.current.signal
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
				await delay(200)
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
			setLoadingWhales(false)
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error('Error in fetchLTD:', error.message)
			}
		}
	}

	const fetchTokenInfo = async contract => {
		const urlHelius = `https://mainnet.helius-rpc.com/?api-key=${apiHelius.apiHelius}`
		try {
			const [accountInfo, burnedLiquidity, tokenSupplyInfo] = await Promise.all(
				[
					fetchAccountInfo(urlHelius, contract, controllerRef.current.signal),
					fetchBurnedLiquidity(
						urlHelius,
						contract,
						controllerRef.current.signal
					),
					fetchTokenSupply(urlHelius, contract, controllerRef.current.signal),
				]
			)

			if (!accountInfo.ok) throw new Error('Failed to fetch AS data')
			if (!burnedLiquidity.ok) throw new Error(`Failed to fetch BL data`)
			if (!tokenSupplyInfo.ok)
				throw new Error(`Failed to fetch tokenSupply data`)

			const checkListData = await accountInfo.json()
			const burnedLiquidityData = await burnedLiquidity.json()
			const tokenSupplyData = await tokenSupplyInfo.json()

			const tokenSupply = tokenSupplyData.result?.value?.amount
			const burnedAmount = burnedLiquidityData.result?.value.reduce(
				(sum, account) => {
					return (sum += parseFloat(
						account.account?.data?.parsed?.info?.tokenAmount?.amount
					))
				},
				0
			)

			setDataCrypto(prev => ({
				...prev,
				checkList: {
					...prev.checkList,
					mintable:
						checkListData.result?.value?.data?.parsed?.info?.mintAuthority,
					freezable:
						checkListData.result?.value?.data?.parsed?.info?.freezeAuthority,
					tokenSupplyAmount: tokenSupply,
					liquidityBurned: burnedLiquidityCalc(burnedAmount, tokenSupply),
				},
			}))
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error('Error in fetchAS:', error.message)
			}
		} finally {
			setLoadingTokenInfo(false)
		}
	}

	const fetchGetDeveloperAddress = async contract => {
		setLoadingDeveloper(true)
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
				signal: controllerRef.current.signal,
			})
			if (!responseGraphql.ok) {
				throw new Error(`HTTP error! Status: ${responseGraphql.status}`)
			}
			const data = await responseGraphql.json()
			const developerWallet =
				data.data?.Solana?.Instructions[0]?.Transaction?.Signer
			if (!developerWallet) {
				return
			}
			const amountOnDeveloperWallet = await fetchIsWalletHoldToken(
				apiMoralis.urlMoralisTokens(developerWallet),
				apiMoralis.apiMoralis,
				controllerRef.current.signal
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
			setLoadingDeveloper(false)
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error('Error fetching data from Bitquery:', error)
			}
		}
	}

	const fetchSnipersList = async contract => {
		setLoadingSnipers(true)
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
	                		limit: {count: 30}
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
				signal: controllerRef.current.signal,
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
					apiMoralis.apiMoralis,
					controllerRef.current.signal
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
			setLoadingSnipers(false)
		} catch (error) {
			if (error.name !== 'AbortError') {
				console.error('Error fetching data from Bitquery:', error)
			}
		}
	}

	useEffect(() => {
		const controller = new AbortController()
		controllerRef.current = controller

		const executeFetches = async () => {
			const [whalesPromise, tokenInfoPromise] = await Promise.allSettled([
				fetchWhalesSupply(contract),
				fetchTokenInfo(contract),
			])
			if (whalesPromise.status === 'rejected')
				console.error('Error in fetchWhalesSupply: ', whalesPromise.reason)
			if (tokenInfoPromise.status === 'rejected')
				console.error('Error in fetchTokenInfo: ', tokenInfoPromise.reason)

			const timeCreated = await tokenCreatedAgo(chain, contract)

			if (!timeCreated) {
				const [developerPromise, snipersPromise] = await Promise.allSettled([
					fetchGetDeveloperAddress(contract),
					fetchSnipersList(contract),
				])
				if (developerPromise.status === 'rejected')
					console.error(
						'Error in fetchGetDeveloperAddress: ',
						developerPromise.reason
					)
				if (snipersPromise.status === 'rejected')
					console.error('Error in fetchSnipersList: ', snipersPromise.reason)
			} else {
				setDataCrypto(prev => ({
					...prev,
					developerInfo: {
						...prev.developerInfo,
						linkToGMGNDev: `https://gmgn.ai/sol/token/${contract}`,
						errorTextDev: 'Data too big, visit GMGN',
					},
					snipersInfo: {
						...prev.snipersInfo,
						linkToGMGNSniper: `https://gmgn.ai/sol/token/${contract}`,
						errorTextSniper: 'Data too big, visit GMGN',
					},
				}))
			}
		}

		if (contract && contract !== lastContract) {
			setLastContract(contract)
			executeFetches()
		}

		return () => controller.abort()
	}, [chain, contract])

	return (
		<div className='holders__check'>
			<TopHoldersBlock
				whalesInfo={dataCrypto.whalesInfo}
				tokenSupply={dataCrypto.checkList.tokenSupplyAmount}
				developerWallet={dataCrypto.developerInfo.walletAddress}
				loadingWhales={loadingWhales}
			/>
			<AdditionalInfoBlock
				checkList={dataCrypto.checkList}
				developerInfo={dataCrypto.developerInfo}
				snipersInfo={dataCrypto.snipersInfo}
				loadingDeveloper={loadingDeveloper}
				loadingSnipers={loadingSnipers}
			/>
		</div>
	)
}
