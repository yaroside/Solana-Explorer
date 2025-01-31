import React, { createRef } from 'react'

import check from '../../images/check-solid.svg'
import xmark from '../../images/xmark-solid.svg'
import copyIcon from '../../images/copy-regular.svg'

import { calculatePercentage } from './primitiveMethods/holdersMethods4Primitive'
import '../../style/rugcheck2.css'

import { formatCryptoAddress } from './primitiveMethods/holdersMethods4Primitive'

export default function AdditionalInfoBlock({
	checkList,
	tokenSupply,
	developerInfo,
	snipersInfo,
	loading,
}) {
	const { mintable, freezable, liquidityBurned } = checkList
	const { amount, walletAddress } = developerInfo
	const iconRef = createRef(null)
	const { snipersSupply, snipersList } = snipersInfo

	if (loading) {
		return <p>Loading additional info...</p>
	}

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
									width: `${(liquidityBurned / tokenSupply) * 100}%`,
								}}
							>
								<p>{(liquidityBurned / tokenSupply) * 100}% / 100%</p>
							</div>
						</div>
					</div>
				</li>
				<li className='additional__info-item'>
					{(snipersSupply && snipersList && (
						<p className='additional__info-text snipersBlock'>
							Snipers Supply:{' '}
							<span className='addition__info-snipersSupply'>
								{snipersSupply
									? ((snipersSupply / tokenSupply) * 100).toFixed(2) + '%'
									: 'N/A'}
							</span>
							<span>||</span>
							Snipers:{' '}
							<span className='addition__info-snipersList'>
								{snipersList ? snipersList.length + '/20' : 'N/A'}
							</span>
						</p>
					)) ||
						'No data Snipers'}
				</li>
				<li className='additional__info-item creatorBlock'>
					{(walletAddress && (
						<p className='additional__info-text'>
							Dev Amount:{' '}
							<span>{calculatePercentage(amount, tokenSupply)}</span>
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
					)) ||
						'No data creator'}
				</li>
			</ul>
		</div>
	)
}
