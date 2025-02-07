export const comparePrices = (previousPrice, currentPrice) => {
	if (currentPrice > previousPrice) {
		return 'price-up'
	} else if (currentPrice < previousPrice) {
		return 'price-down'
	}
	return 'price-unchanged'
}

export const calculateWidth = (value1, value2) => {
	const total = value1 + value2
	const buysWidth = (value1 / total) * 100
	const sellsWidth = (value2 / total) * 100
	return { buysWidth, sellsWidth }
}

export const transformValue = value => {
	const num = parseInt(value, 10)
	if (isNaN(num)) {
		return 'Invalid value'
	}

	if (num >= 1000000000) {
		return (num / 1000000000).toFixed(3) + 'b'
	} else if (num >= 1000000) {
		return (num / 1000000).toFixed(2) + 'm'
	} else if (num >= 1000) {
		return (num / 1000).toFixed(1) + 'k'
	} else {
		return num.toString()
	}
}

export const calculateVol = (value, arg) => {
	const num = parseInt(value, 10)
	if (isNaN(num)) {
		return num
	}
	const onePercent = num / 100
	const result = onePercent * arg
	if (result >= 1000000000) {
		return (result / 1000000000).toFixed(1) + 'b'
	} else if (result >= 1000000) {
		return (result / 1000000).toFixed(1) + 'm'
	} else if (result >= 1000) {
		return (result / 1000).toFixed(1) + 'k'
	} else {
		return result.toFixed(0)
	}
}

export const calculateAll = (...args) => {
	const result = args.reduce((sum, num) => sum + num, 0)
	if (result >= 1000000000) {
		return (result / 1000000000).toFixed(1) + 'b'
	} else if (result >= 1000000) {
		return (result / 1000000).toFixed(1) + 'm'
	} else if (result >= 1000) {
		return (result / 1000).toFixed(1) + 'k'
	} else {
		return result.toFixed(0)
	}
}

export const calculateVolAll = (...args) => {
	const result = args.reduce((sum, num) => sum + num, 0)
	if (result >= 1000000000) {
		return (result / 1000000000).toFixed(1) + 'b'
	} else if (result >= 1000000) {
		return (result / 1000000).toFixed(1) + 'm'
	} else if (result >= 1000) {
		return (result / 1000).toFixed(1) + 'k'
	} else {
		return result.toFixed(0)
	}
}

export const getColorClass = value => {
	return value > 0
		? 'priceChange-positive'
		: value < 0
		? 'priceChange-negative'
		: 'priceChange-neutral'
}

export const formatCryptoAddress = value => {
	const firstPart = value.slice(0, 4)
	const secondPart = value.slice(-4)
	return `${firstPart}...${secondPart}`
}

export const formatTimestamp = timestamp => {
	const date = new Date(Number(timestamp))
	const now = new Date()
	const diffInSeconds = Math.floor((now - date) / 1000)

	const SECONDS_IN_MINUTE = 60
	const SECONDS_IN_HOUR = SECONDS_IN_MINUTE * 60
	const SECONDS_IN_DAY = SECONDS_IN_HOUR * 24
	const SECONDS_IN_MONTH = SECONDS_IN_DAY * 30
	const SECONDS_IN_YEAR = SECONDS_IN_DAY * 365

	if (diffInSeconds < SECONDS_IN_HOUR) {
		const minutes = Math.floor(diffInSeconds / SECONDS_IN_MINUTE)
		return `${minutes}m ago`
	} else if (diffInSeconds < SECONDS_IN_DAY) {
		const hours = Math.floor(diffInSeconds / SECONDS_IN_HOUR)
		const minutes = Math.floor(
			(diffInSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE
		)
		return `${hours}h ${minutes}m ago`
	} else if (diffInSeconds < SECONDS_IN_MONTH) {
		const days = Math.floor(diffInSeconds / SECONDS_IN_DAY)
		const hours = Math.floor((diffInSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR)
		return `${days}d ${hours}h ago`
	} else if (diffInSeconds < SECONDS_IN_YEAR) {
		const months = Math.floor(diffInSeconds / SECONDS_IN_MONTH)
		const days = Math.floor((diffInSeconds % SECONDS_IN_MONTH) / SECONDS_IN_DAY)
		return `${months}mo ${days}d ago`
	} else {
		const years = Math.floor(diffInSeconds / SECONDS_IN_YEAR)
		const months = Math.floor(
			(diffInSeconds % SECONDS_IN_YEAR) / SECONDS_IN_MONTH
		)
		return `${years}y ${months}mo ago`
	}
}

export const handlerTokenName = tokenName => {
	return tokenName.length > 15 ? tokenName.slice(0, 15) + '...' : tokenName
}

export const calculateHeight = element => {
	return element.scrollHeight
}
