// React Modules
import React, { createRef } from 'react'
// Images
import loadingCircle from '../../images/pointers/spinner-third.svg'
import copyIcon from '../../images/pointers/copy-regular.svg'
// Primitive Methods
import {
	calculatePercentage,
	formatCryptoAddress,
	isAmm,
	isCreator,
} from './primitiveMethods/holdersMethods4Primitive'
import { ammAddresses } from './AMM/AMM'
// Styles
import '../../style/TopHoldersBlock.css'

export default function TopHoldersBlock({
	whalesInfo,
	tokenSupply,
	developerWallet,
	loadingWhales,
}) {
	const { whalesSupply, whalesList } = whalesInfo

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
				{(!loadingWhales &&
					whalesList &&
					whalesSupply &&
					whalesList.map((holder, index) => {
						const iconRef = createRef(null)
						const AMM = isAmm(holder.whaleAddress, ammAddresses.raydium)
						const Creator = isCreator(holder.whaleAddress, developerWallet)
						return (
							<li
								className={
									`top__holders-block--topHolders-top_${index + 1}` +
									`${AMM ? ' amm__wallet' : Creator ? ' creator__wallet' : ''}`
								}
								key={holder.whaleAddress}
							>
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
									className='link__ownerAccount'
									href={`https://solscan.io/account/${holder.whaleAddress}`}
									target='_blank'
									rel='noopener noreferrer'
								>
									Owner
								</a>
							</li>
						)
					})) || (
					<li className='top__holders-waiting'>
						<p className='loading-indicator'>
							Loading Whales Info...
							<img
								className='loadingCircle'
								src={loadingCircle}
								alt='loading icon'
							/>
						</p>
					</li>
				)}
			</ul>
		</div>
	)
}
