const caformating = contract => {
	return `${contract.slice(0, 5)}....${contract.slice(
		contract.split('').length - 5
	)}`
}

function formatBigNumbers(num) {
	const absNum = Math.abs(num)
	let formattedNum = num
	let suffix = ''

	if (absNum >= 1_000_000_000) {
		formattedNum = num / 1_000_000_000
		suffix = 'b'
	} else if (absNum >= 1_000_000) {
		formattedNum = num / 1_000_000
		suffix = 'm'
	} else if (absNum >= 1_000) {
		formattedNum = num / 1_000
		suffix = 'k'
	} else if (absNum < 1_000) {
		formattedNum = num
	}

	formattedNum = parseFloat(formattedNum).toLocaleString('en-US', {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	})

	formattedNum = formattedNum.replace('.', ',')

	return formattedNum + suffix
}

const handleCopyClick = address => {
	if (document.hasFocus()) {
		navigator.clipboard
			.writeText(address)
			.catch(error => console.error('Failed to copy address: ', error.message))
	} else {
		console.error('Document not in focus')
	}
}

const API_URL =
	'https://dlmm-api.meteora.ag/pair/all_with_pagination?page=0&limit=300&include_pool_token_pairs=So11111111111111111111111111111111111111112'
const solAddress = 'So11111111111111111111111111111111111111112'
const usdcAddress = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'

export {
	caformating,
	formatBigNumbers,
	handleCopyClick,
	API_URL,
	solAddress,
	usdcAddress,
}
