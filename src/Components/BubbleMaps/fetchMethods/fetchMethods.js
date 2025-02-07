import { bubbleMaps } from '../api4BubbleMaps/apiBubbleMaps'

const isPairAvailable = async (chain, contract) => {
	try {
		const request = await fetch(bubbleMaps.iframeStatus(chain, contract))
		if (!request.ok) throw new Error(`Error while checking isPairAvailable`)
		const response = await request.json()
		return response
	} catch (error) {
		console.error(`Error isPaiAvailable fetch: `, error.message)
	}
}

export { isPairAvailable }
