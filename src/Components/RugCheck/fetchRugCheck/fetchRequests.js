import { apiRugCheckInfo } from '../apiRugCheck/apiRugCheck'

const fetchRugCheck = async contract => {
	try {
		const request = await fetch(apiRugCheckInfo.apiRugcheck(contract))
		if (!request.ok) throw new Error(`Error while fetching RugCheck`)
		const response = await request.json()
		return response
	} catch (error) {
		console.error(`Can't do fetch RugCheck`)
	}
}

export { fetchRugCheck }
