// React Modules
import React, { createRef } from 'react'
// Images
import check from '../../images/creos/check-solid.svg'
import xmark from '../../images/pointers/xmark-solid.svg'
import copyIcon from '../../images/pointers/copy-regular.svg'
import loadingCircle from '../../images/pointers/spinner-third.svg'
// Primitive Methods
import { calculatePercentage } from './primitiveMethods/holdersMethods4Primitive'
import { formatCryptoAddress } from './primitiveMethods/holdersMethods4Primitive'
// Styles
import '../../style/AdditionalInfoBlock.css'

export default function AdditionalInfoBlock({
	checkList,
	developerInfo,
	snipersInfo,
	loadingDeveloper,
	loadingSnipers,
}) {
	const { mintable, freezable, tokenSupplyAmount, liquidityBurned } = checkList
	const { amount, walletAddress, linkToGMGNDev, errorTextDev } = developerInfo
	const { snipersSupply, snipersList, linkToGMGNSniper, errorTextSniper } =
		snipersInfo
	const iconRef = createRef(null)

	const handleCopyAddress = (fullAddress, iconRef) => {
		navigator.clipboard.writeText(fullAddress)
		iconRef.current.classList.add('animate__icon')
		setTimeout(() => {
			iconRef.current.classList.remove('animate__icon')
		}, 300)
	}

	return (
		<div className='additional__info__holders-block'>
			<ul className='additional__info-list'>
				{(liquidityBurned && (
					<li className='additional__info-item'>
						<div className='additional__info-item-checkList'>
							<p className='additional__info-text'>Mintable: </p>
							<img
								style={{ width: '24px', height: '24px' }}
								src={!mintable ? check : xmark}
								alt='mintable__icon'
							/>
						</div>
						<div className='additional__info-item-checkList'>
							<p className='additional__info-text'>Freezable: </p>
							<img
								style={{ width: '24px', height: '24px' }}
								src={!freezable ? check : xmark}
								alt='freezable__icon'
							/>
						</div>
						<div className='additional__info-item-checkList'>
							<p className='additional__info-text'>Burned: </p>
							<div className='burned__liquidity--progressbar'>
								<div
									className='burned__liquidity--burned'
									style={{
										width: `${liquidityBurned}%`,
									}}
								>
									<p>{liquidityBurned}% / 100%</p>
								</div>
							</div>
						</div>
					</li>
				)) || (
					<li className='additional__info-item top__holders-waiting'>
						<p className='loading-indicator'>
							Loading Token Info...
							<img
								className='loadingCircle'
								src={loadingCircle}
								alt='loading icon'
							/>
						</p>
					</li>
				)}
				{(errorTextDev && linkToGMGNDev && (
					<li className='additional__info-item creatorBlock'>
						<p className='additional__info-text'>
							<span className='additional__info-textError-bigData'>
								{errorTextDev}:{' '}
								<a
									className='additional__info-linkError-bigData'
									href={linkToGMGNDev}
									target='_blank'
									rel='noopener noreferrer'
								>
									Link To GMGN
								</a>
							</span>
						</p>
					</li>
				)) ||
					(!loadingDeveloper && walletAddress && (
						<li className='additional__info-item creatorBlock'>
							<p className='additional__info-text'>
								Dev Amount:{' '}
								<span>{calculatePercentage(amount, tokenSupplyAmount)}</span>
								<span>||</span>
								<a
									className='dev__walletAddress'
									href={`https://solscan.io/account/${walletAddress}`}
									target='_blank'
								>
									{formatCryptoAddress(walletAddress)}
								</a>
								<img
									className='top__holders copy__icon'
									src={copyIcon}
									alt='copy icon'
									ref={iconRef}
									onClick={() => handleCopyAddress(walletAddress, iconRef)}
								/>
							</p>
						</li>
					)) || (
						<li className='additional__info-item top__holders-waiting'>
							<p className='loading-indicator'>
								Loading Developer Info...
								<img
									className='loadingCircle'
									src={loadingCircle}
									alt='loading icon'
								/>
							</p>
						</li>
					)}
				{(errorTextSniper && linkToGMGNSniper && (
					<li className='additional__info-item creatorBlock'>
						<p className='additional__info-text'>
							<span className='additional__info-textError-bigData'>
								{errorTextSniper}:{' '}
								<a
									className='additional__info-linkError-bigData'
									href={linkToGMGNSniper}
									target='_blank'
									rel='noopener noreferrer'
								>
									Link To GMGN
								</a>
							</span>
						</p>
					</li>
				)) ||
					(!loadingSnipers && snipersSupply && snipersList && (
						<li className='additional__info-item'>
							<p className='additional__info-text snipersBlock'>
								Snipers Supply:{' '}
								<span className='addition__info-snipersSupply'>
									{snipersSupply
										? ((snipersSupply / tokenSupplyAmount) * 100).toFixed(2) +
										  '%'
										: 'N/A'}
								</span>
								<span>||</span>
								Snipers:{' '}
								<span className='addition__info-snipersList'>
									{snipersList ? snipersList.length + '/30' : 'N/A'}
								</span>
							</p>
						</li>
					)) || (
						<li className='additional__info-item top__holders-waiting'>
							<p className='loading-indicator'>
								Loading Snipers Info...
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
