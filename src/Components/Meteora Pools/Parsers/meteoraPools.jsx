import React, { useState } from 'react'
import {
	caformating,
	formatBigNumbers,
	handleCopyClick,
} from '../MeteoraHandlers/handlers'
import Loading from '../../Loading Component/Loading'
import meteoraLink from '../../../images/servicesLogos/meteora_meteor.webp'
import xMark from '../../../images/pointers/xmark-solid.svg'
import arrow from '../../../images/pointers/arrow_up.svg'

export default function MeteoraPools({ pools, loading, time }) {
	const [openPools, setIsOpenPools] = useState(false)
	const [copiedContract, setCopiedContract] = useState(null)

	const openMeteora = () => {
		setIsOpenPools(!openPools)
	}

	return (
		<div
			className={`pools-container pools-container--${
				openPools ? 'active' : 'disabled'
			}`}
		>
			<div className='pools_leftside'>
				<img
					className={`pools-arrow pools-${openPools ? 'xMark' : 'arrow'}`}
					src={openPools ? xMark : arrow}
					alt='arrow icon'
					onClick={openMeteora}
				/>
				<div className='pools-title'>
					M
					<br />
					E
					<br />
					T
					<br />
					E
					<br />
					O
					<br />
					R
					<br />
					A
					<br />
					<br />
					D
					<br />
					L
					<br />
					M
					<br />
					M
					<br />
					<br />
					P
					<br />
					O
					<br />
					O
					<br />
					L
					<br />S
				</div>
			</div>
			{loading ? (
				<Loading text='Loading Pools...' />
			) : (
				<div className='pools_rightside'>
					<div className='pools-header'>
						<h2 className='pools-titleGlobal'>Request Time: {time}</h2>
						<img
							className='pools-meteoraImage'
							src={meteoraLink}
							alt='meteora icon'
						/>
					</div>

					<ul className='pools-list'>
						{pools.map((pool, index) => (
							<li className='pool_item' key={index}>
								<a
									className='pool_meteoraLink'
									href={`https://www.meteora.ag/dlmm/${pool.address}`}
									target='_blank'
								></a>
								<p className='pool_name pool_name'>
									{index + 1 + ') '} {pool.name}
								</p>
								<p className='pool__binstep'>
									<span className='pool_binstep-title'>Bin Step:</span>{' '}
									{pool.bin_step}
								</p>
								<p
									className='pool__CAmem'
									onClick={() => {
										handleCopyClick(pool.mint_x)
										setCopiedContract(pool.mint_x)
										setTimeout(() => setCopiedContract(null), 1000)
									}}
								>
									<span className='pool_CAmem-title'>Contract:</span>{' '}
									<span>
										{copiedContract === pool.mint_x
											? 'Copied!'
											: caformating(pool.mint_x)}
									</span>
								</p>
								<p className='pool_tvl'>
									<span className='pool_tvl-title'>Liquidity in Pool:</span>{' '}
									{formatBigNumbers(pool.liquidity)} $
								</p>
								<p className='pool_fee'>
									<span className='pool_fee-title'>Base Fee:</span>{' '}
									{formatBigNumbers(pool.base_fee_percentage)} %
								</p>
								<ul className='addInfo-list'>
									<li className='pool_percent-block pool-block'>
										<p className='pool_percent-title pool_title'>Percent %: </p>
										<p className='pool_percent-item'>
											<span className='pool_time'>1h:</span>{' '}
											{formatBigNumbers(pool.fee_tvl_ratio.hour_1)}
											<br />
											<span className='pool_time'>24h:</span>{' '}
											{formatBigNumbers(pool.fee_tvl_ratio.hour_24)}
										</p>
									</li>
									<li className='pool_fees-block pool-block'>
										<p className='pool_fees-title pool_title'>Fees $: </p>
										<p className='pool_fees-item'>
											<span className='pool_time'>1h:</span>{' '}
											{formatBigNumbers(pool.fees.hour_1)}
											<br />
											<span className='pool_time'>24h:</span>{' '}
											{formatBigNumbers(pool.fees.hour_24)}
										</p>
									</li>
									<li className='pool_volume-block pool-block'>
										<p className='pool_volume-title pool_title'>Volume $: </p>
										<p className='pool_volume-item'>
											<span className='pool_time'>1h:</span>{' '}
											{formatBigNumbers(pool.volume.hour_1)}
											<br />
											<span className='pool_time'>24h:</span>{' '}
											{formatBigNumbers(pool.volume.hour_24)}
										</p>
									</li>
								</ul>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
