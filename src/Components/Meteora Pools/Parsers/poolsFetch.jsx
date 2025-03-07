import { useEffect, useState, useMemo } from 'react'
import { API_URL, solAddress, usdcAddress } from '../MeteoraHandlers/handlers'

export default function poolsFetch() {
	const [pools, setPools] = useState([])
	const [loading, setLoading] = useState(true)
	const [time, setTime] = useState()

	const fetchPools = async () => {
		try {
			const response = await fetch(API_URL)
			const data = await response.json()
			setPools(data.pairs)

			function getCurrentTime() {
				const now = new Date()
				const hours = now.getHours().toString().padStart(2, '0')
				const minutes = now.getMinutes().toString().padStart(2, '0')
				return `${hours}:${minutes}`
			}
			const timeRequest = getCurrentTime()
			setTime(timeRequest)
		} catch (error) {
			console.error('Ошибка загрузки пулов:', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchPools()
		const interval = setInterval(fetchPools, 900_000)
		return () => clearInterval(interval)
	}, [])

	const memoizedPools = useMemo(() => {
		return pools
			.filter(pool => {
				const tvl = parseFloat(pool.liquidity) || 0
				const fees24h = parseFloat(pool.fees.hour_24) || 0
				const binStep = parseFloat(pool.bin_step) || 0
				const quoteToken =
					pool.mint_x === solAddress
						? pool.mint_y
						: pool.mint_x === usdcAddress
						? pool.mint_y
						: pool.mint_x
				return (
					fees24h >= tvl * 0.05 && quoteToken && binStep >= 100 && tvl >= 10000
				)
			})
			.sort((b, a) => a.fee_tvl_ratio.hour_24 - b.fee_tvl_ratio.hour_24)
	}, [pools])

	return { pools: memoizedPools, loading, time: time }
}
