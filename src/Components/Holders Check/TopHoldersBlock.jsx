import React, { useState, createRef } from 'react'
import raydium from '../../images/servicesLogos/raydium.webp'
import creator from '../../images/servicesLogos/creator.svg'
import {
	calculatePercentage,
	handleTokenAmount,
	formatCryptoAddress,
	isAmm,
	isCreator,
} from './primitiveMethods/holdersMethods4Primitive'
import { ammAddresses } from './AMM/AMM'
import copyIcon from '../../images/copy-regular.svg'
import '../../style/rugcheck.css'

export default function TopHoldersBlock({ whalesInfo, tokenSupply, loading }) {
	const { whalesSupply, whalesList } = whalesInfo

	if (loading) {
		return <p>Loading top holders...</p>
	}

	if (!whalesSupply || !whalesList) {
		return <p>No holder data available.</p>
	}

	const handleCopyAddress = (fullAddress, iconRef) => {
		navigator.clipboard.writeText(fullAddress)
		iconRef.current.classList.add('animate__icon')
		setTimeout(() => {
			iconRef.current.classList.remove('animate__icon')
		}, 300)
	}

	return (
		<div className='top__holders-block'>
			<div className='top__holders-block--titleBlock'>
				<h2 className='top__holders-block--title'>Top-15 Holders</h2>
				<span className='top__holders-block--percentHolding'>
					Holds{' '}
					<span className='whalesSupply'>
						{calculatePercentage(whalesSupply, tokenSupply)}
					</span>{' '}
					of supply
				</span>
			</div>
			<ul className='top__holders-block--topHolders'>
				{whalesList.map((holder, index) => {
					const iconRef = createRef(null)
					return (
						<li
							className={`top__holders-block--topHolders-top_${index + 1}`}
							key={holder.whaleAddress}
						>
							<p className='holder__position'>{index + 1}</p>
							<p className='holder__address'>
								{formatCryptoAddress(holder.whaleAddress)}
								<img
									className='top__holders copy__icon'
									src={copyIcon}
									alt='copy icon'
									ref={iconRef}
									onClick={() =>
										handleCopyAddress(holder.whaleAddress, iconRef)
									}
								/>
							</p>
							<p className='holder__percent'>
								{calculatePercentage(holder.whaleTokenAmount, tokenSupply)}
							</p>
							<a
								className='link__tokenAccount'
								href={`https://solscan.io/account/${holder.tokenAddress}`}
								target='_blank'
								rel='noopener noreferrer'
							>
								Token Acc
							</a>
							<a
								className='link__ownerAccount'
								href={`https://solscan.io/account/${holder.whaleAddress}`}
								target='_blank'
								rel='noopener noreferrer'
							>
								Owner Acc
							</a>
						</li>
					)
				})}
			</ul>
		</div>
	)
}
