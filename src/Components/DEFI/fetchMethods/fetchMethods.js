import { apiInfo } from '../apiInfo/apiInfo'

export const fetchMeteoraSOLPools = async contract => {
	try {
		const poolRequest = await fetch(apiInfo.apiMeteoraSOLPool(contract))
		if (!poolRequest.ok) {
			throw new Error('SOLPools no Data')
		}
		const poolResponse = await poolRequest.json()
		return poolResponse
	} catch (error) {
		console.error(`Error while fetching SOLPools: `, error.message)
	}
}

export const fetchMeteoraUSDCPools = async contract => {
	try {
		const poolRequest = await fetch(apiInfo.apiMeteoraUSDCPool(contract))
		if (!poolRequest.ok) {
			throw new Error('USDCPools no Data')
		}
		const poolResponse = await poolRequest.json()
		return poolResponse
	} catch (error) {
		console.error(`Error while fetching USDCPools: `, error.message)
	}
}
