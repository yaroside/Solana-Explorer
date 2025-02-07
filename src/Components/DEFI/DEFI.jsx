import React, { useState, useEffect, createRef } from 'react'
import Loading from '../Loading Component/Loading'

import { fetchMeteoraSOLPools } from './fetchMethods/fetchMethods'
import {
	formatNumber,
	formatPercent,
} from './methods4Primitive/methods4Primitive'

import '../../style/defi.css'

export default function DEFI({ requestData }) {
	const { chain, contract } = requestData
	const [poolData, setPoolData] = useState({
		SOLPools: {},
	})
	const [activeBin, setActiveBin] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [hasData, setHasData] = useState(true)

	useEffect(() => {
		const executePoolQueries = async () => {
			const [SOLPools] = await Promise.allSettled([
				fetchMeteoraSOLPools(contract),
			])

			if (SOLPools.status === 'fulfilled' && SOLPools.value.groups.length > 0) {
				const resultPools = SOLPools.value.groups[0].pairs.map(item => {
					if (poolData.SOLPools[`${item.bin_step}`]) {
					}
					return {
						poolName: item.name,
						poolAddress: item.address,
						poolBin: item.bin_step,
						poolLiquidity: item.liquidity,
						poolBaseFee: item.base_fee_percentage,
						poolMaxFee: item.max_fee_percentage,
						poolFeeVolume: item.cumulative_fee_volume,
						poolTradeVolume: item.cumulative_trade_volume,
					}
				})

				const groupedPools = resultPools.reduce((acc, pool) => {
					const bin = pool.poolBin
					if (!acc[bin]) {
						acc[bin] = []
					}
					acc[bin].push(pool)
					return acc
				}, {})
				Object.keys(groupedPools).forEach(item => {
					if (groupedPools[item].length !== 1) {
						groupedPools[item].sort((a, b) => b.poolFeeVolume - a.poolFeeVolume)
					}
				})
				setPoolData(prev => ({
					...prev,
					SOLPools: groupedPools,
				}))

				const bins = Object.keys(groupedPools)
				if (bins.length > 0) setActiveBin(bins[0])
				setIsLoading(false)
				setHasData(true)
			} else {
				console.error(`Error fetching SOL Pools: `, SOLPools.reason)
				setIsLoading(false)
				setHasData(false)
			}
		}
		executePoolQueries()
	}, [contract])

	const handleClickBin = bin => {
		setActiveBin(bin)
	}

	if (isLoading) {
		return <Loading text='Loading...' textColor='green' circleDisplay='block' />
	} else if (!hasData) {
		return (
			<Loading
				text='Failed to Loading Data...'
				textColor='red'
				circleDisplay='none'
			/>
		)
	}

	return (
		<div className='defi__section'>
			<h2 className='defi__title'>SOL Pools DLMM</h2>
			<div className='defi__section-defiInfo'>
				{Object.keys(poolData.SOLPools).length > 0 && (
					<ul className='defi__bins'>
						{Object.keys(poolData.SOLPools).map((item, index) => {
							return (
								<li
									key={item}
									className={`defi__bin ${
										activeBin === item ? ' binRef--active' : ''
									}`}
									onClick={() => handleClickBin(item)}
								>
									{item} bin
								</li>
							)
						})}
					</ul>
				)}
				<ul className='defi__pool-list'>
					{activeBin &&
						poolData.SOLPools[activeBin].map((pool, index) => {
							const iconRef = createRef(null)
							const poolBin = pool.poolBin
							return (
								<li
									key={index}
									data-bin={`binItem-${poolBin}`}
									className={`defi__pool-item bin--active`}
								>
									<div className='defi__pool-info name-info'>
										<p className='defi__pool-label'>Name:</p>
										<p className='defi__pool-value'>{pool.poolName}</p>
									</div>
									<div className='defi__pool-info address-info'>
										<p className='defi__pool-label'>Address:</p>
										<p className='defi__pool-value'>
											<a
												className='meteora__link'
												href={`https://app.meteora.ag/dlmm/${pool.poolAddress}`}
												target='_blank'
												rel='noopener noreferrer'
											>
												Link
											</a>
										</p>
									</div>
									<div className='defi__pool-info bin-info'>
										<p className='defi__pool-label'>Bin Step:</p>
										<p className='defi__pool-value'>{pool.poolBin}</p>
									</div>
									<div className='defi__pool-info basefee-info'>
										<p className='defi__pool-label'>Base Fee:</p>
										<p className='defi__pool-value'>{pool.poolBaseFee}%</p>
									</div>
									<div className='defi__pool-info maxfee-info'>
										<p className='defi__pool-label'>Max Fee:</p>
										<p className='defi__pool-value'>
											{formatPercent(pool.poolMaxFee)}
										</p>
									</div>
									<div className='defi__pool-info liquidity-info'>
										<p className='defi__pool-label'>Liquidity:</p>
										<p className='defi__pool-value'>
											{formatNumber(pool.poolLiquidity)} $
										</p>
									</div>
									<div className='defi__pool-info fee-volume'>
										<p className='defi__pool-label'>Fee Volume (24h):</p>
										<p className='defi__pool-value'>
											{formatNumber(pool.poolFeeVolume)} $
										</p>
									</div>
									<div className='defi__pool-info trade-volume'>
										<p className='defi__pool-label'>Trade Volume (24h):</p>
										<p className='defi__pool-value'>
											{formatNumber(pool.poolTradeVolume)} $
										</p>
									</div>
								</li>
							)
						})}
				</ul>
			</div>
		</div>
	)
}
