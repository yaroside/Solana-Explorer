export const formatCryptoAddress = address => {
	if (!address) return ''
	return `${address.slice(0, 4)}...${address.slice(-4)}`
}

export const formatNumber = number => {
	const value = parseFloat(number)

	if (value >= 1_000_000_000_000) {
		return `${(value / 1_000_000_000_000).toFixed(2)}t`
	} else if (value >= 1_000_000_000) {
		return `${(value / 1_000_000_000).toFixed(2)}b`
	} else if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(2)}m`
	} else if (value >= 1_000) {
		return `${(value / 1_000).toFixed(2)}k`
	} else {
		return Math.round(value)
	}
}

export const formatPercent = percent => {
	return (Number(percent) / 1).toFixed(2) + `%`
}

export const handleCopyAddress = (fullAddress, iconRef) => {
	navigator.clipboard.writeText(fullAddress)
	iconRef.current.classList.add('copy__icon--active')
	setTimeout(() => {
		iconRef.current.classList.remove('copy__icon--active')
	}, 300)
}
