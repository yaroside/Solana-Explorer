// Calculates the percentage of the amount on a wallet relative to the total supply.
export const calculatePercentage = (amountOnWallet, tokenSupply) => {
	if (
		!tokenSupply ||
		tokenSupply <= 0 ||
		!amountOnWallet ||
		amountOnWallet < 0
	) {
		return '0%'
	}
	return ((amountOnWallet / tokenSupply) * 100).toFixed(2) + '%'
}

// Calculates the total percentage held by the top holders.
export const calculateTopHoldersTotal = (tokenLargestAccounts, tokenSupply) => {
	if (!tokenLargestAccounts) return '0%'

	const tokenValuesArray = tokenLargestAccounts.result.value.slice(0, 10)
	const sum = tokenValuesArray.reduce((acc, holder) => acc + holder.uiAmount, 0)

	return ((sum / tokenSupply) * 100).toFixed(2)
}

// Formats a token amount into human-readable form (e.g., '1.23k', '1.23m').
export const handleTokenAmount = tokenAmount => {
	const value = parseFloat(tokenAmount)

	if (value >= 1_000_000_000_000) {
		return `${(value / 1_000_000_000_000).toFixed(3)}t`
	} else if (value >= 1_000_000_000) {
		return `${(value / 1_000_000_000).toFixed(3)}b`
	} else if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(3)}m`
	} else if (value >= 1_000) {
		return `${(value / 1_000).toFixed(2)}k`
	} else {
		return value.toFixed(2)
	}
}

// Formats a crypto address to display only the first and last 4 characters.
export const formatCryptoAddress = value => {
	const firstPart = value.slice(0, 4)
	const secondPart = value.slice(-4)
	return `${firstPart}...${secondPart}`
}

// Determines if an address matches a specific automated market maker (AMM).
export const isAmm = (address, ammAddresses) => {
	return address === ammAddresses.raydium ? 'raydium' : null
}

// Determines if an address is the creator's address.
export const isCreator = (address, creatorAddress) => {
	return address === creatorAddress ? 'developer' : null
}

// Converting time into hours
export const convertTimestampToHours = timestamp => {
	const dateCreated = new Date(timestamp)
	const hoursCreated = dateCreated.getUTCHours() + 3
	const minutesCreated = dateCreated.getMinutes()

	const dateNow = new Date()
	const hoursNow = dateNow.getUTCHours() + 3
	const minutesNow = dateNow.getMinutes()

	const totalMinutesCreated = hoursCreated * 60 + minutesCreated
	const totalMinutesNow = hoursNow * 60 + minutesNow

	let timeDifferenceMinutes = totalMinutesNow - totalMinutesCreated

	if (timeDifferenceMinutes < 0) {
		timeDifferenceMinutes += 24 * 60
	}

	const hoursDifference = Math.floor(timeDifferenceMinutes / 60)
	const isMoreThanOrEqualToTenHours = hoursDifference >= 11
	return isMoreThanOrEqualToTenHours
}
