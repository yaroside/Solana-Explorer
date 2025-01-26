import React, { useState, useEffect, useRef } from 'react'

import copyIcon from '../images/copy-regular.svg'
import telegram from '../images/socials/tg.png'
import www from '../images/socials/www.svg'
import twitter from '../images/socials/x.jpg'
import discord from '../images/socials/discord.svg'
import arrowUp from '../images/arrow-up-solid.svg'
import arrowDown from '../images/arrow-down-solid.svg'
import dollar from '../images/dollar-sign-solid.svg'

import '../style/index.css'
import '../style/normalize.css'

export default function DexScreener({ requestData, requestParams }) {
	const { chain, contract } = requestData
	const { tokenPosition } = requestParams

	const [data, setData] = useState({})
	const [copied, setCopied] = useState(false)
	const [selectedTab, setSelectedTab] = useState('TXNS')
	const previousPriceRef = useRef(0)
	const [currentPrice, setCurrentPrice] = useState(null)
	const [priceClass, setPriceClass] = useState('')
	const apiDomain = 'https://api.dexscreener.com/'
	const screenerListRef = useRef(null)

	useEffect(() => {
		const getPair = async () => {
			const url = `${apiDomain}token-pairs/v1/${chain}/${contract}`
			try {
				const response = await fetch(url)
				if (!response.ok) {
					throw new Error(`Network response was not ok`)
				}
				const result = await response.json()

				const newPrice = parseFloat(result[0].priceUsd)

				const prevPrice = previousPriceRef.current || newPrice
				setPriceClass(comparePrices(prevPrice, newPrice))
				previousPriceRef.current = newPrice
				setCurrentPrice(newPrice)

				setData(result)
			} catch (error) {
				console.error(`Error fetching data: ${error.message}`)
			}
		}
		if (chain && contract) {
			getPair()
		}
		const intervalId = setInterval(async () => {
			if (chain && contract) {
				await getPair()
			}
		}, 5000)
		return () => clearInterval(intervalId)
	}, [chain, contract, apiDomain])

	const comparePrices = (previousPrice, currentPrice) => {
		if (currentPrice > previousPrice) {
			return 'price-up'
		} else if (currentPrice < previousPrice) {
			return 'price-down'
		}
		return 'price-unchanged'
	}

	const calculateWidth = (value1, value2) => {
		const total = value1 + value2
		const buysWidth = (value1 / total) * 100
		const sellsWidth = (value2 / total) * 100
		return { buysWidth, sellsWidth }
	}

	const transformValue = value => {
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

	const calculateVol = (value, arg) => {
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

	const calculateAll = (arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8) => {
		const result = arg1 + arg2 + arg3 + arg4 + arg5 + arg6 + arg7 + arg8
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

	const calculateVolAll = (arg1, arg2, arg3, arg4) => {
		const result = arg1 + arg2 + arg3 + arg4
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

	const getColorClass = value => {
		return value > 0
			? 'priceChange-positive'
			: value < 0
			? 'priceChange-negative'
			: 'priceChange-neutral'
	}

	const formatCryptoAddress = value => {
		const firstPart = value.slice(0, 4)
		const secondPart = value.slice(-4)
		return `${firstPart}...${secondPart}`
	}

	const handleCopyClick = address => {
		if (document.hasFocus()) {
			navigator.clipboard
				.writeText(address)
				.then(() => {
					setCopied(true)
					setTimeout(() => setCopied(false), 1000)
				})
				.catch(error =>
					console.error('Failed to copy address: ', error.message)
				)
		} else {
			console.error('Document not in focus')
		}
	}

	const formatTimestamp = timestamp => {
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
			return `${minutes}m`
		} else if (diffInSeconds < SECONDS_IN_DAY) {
			const hours = Math.floor(diffInSeconds / SECONDS_IN_HOUR)
			const minutes = Math.floor(
				(diffInSeconds % SECONDS_IN_HOUR) / SECONDS_IN_MINUTE
			)
			return `${hours}h ${minutes}m`
		} else if (diffInSeconds < SECONDS_IN_MONTH) {
			const days = Math.floor(diffInSeconds / SECONDS_IN_DAY)
			const hours = Math.floor(
				(diffInSeconds % SECONDS_IN_DAY) / SECONDS_IN_HOUR
			)
			return `${days}d ${hours}h`
		} else if (diffInSeconds < SECONDS_IN_YEAR) {
			const months = Math.floor(diffInSeconds / SECONDS_IN_MONTH)
			const days = Math.floor(
				(diffInSeconds % SECONDS_IN_MONTH) / SECONDS_IN_DAY
			)
			return `${months}mo ${days}d`
		} else {
			const years = Math.floor(diffInSeconds / SECONDS_IN_YEAR)
			const months = Math.floor(
				(diffInSeconds % SECONDS_IN_YEAR) / SECONDS_IN_MONTH
			)
			return `${years}y ${months}mo`
		}
	}

	const handlerTokenName = tokenName => {
		if (tokenName.length > 15) {
			return tokenName.split('').splice(0, 15).join('') + '...'
		} else {
			return tokenName
		}
	}

	useEffect(() => {
		if (screenerListRef.current) {
			const height = calculateHeight(screenerListRef.current)
			screenerListRef.current.style.height = `${height}px`
		}
	}, [data, selectedTab])

	const calculateHeight = element => {
		return element.scrollHeight
	}

	return (
		<>
			{Object.keys(data).length > 0 && (
				<div className='dex__screener'>
					<div className='dex__screener-header'>
						<h2 className='dex__screener-title'>DexScreener</h2>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							width='32px'
							height='32px'
							fill='#fff'
							fill-rule='evenodd'
							viewBox='0 0 252 300'
							focusable='false'
							class='chakra-icon custom-euf446'
						>
							<path d='M151.818 106.866c9.177-4.576 20.854-11.312 32.545-20.541 2.465 5.119 2.735 9.586 1.465 13.193-.9 2.542-2.596 4.753-4.826 6.512-2.415 1.901-5.431 3.285-8.765 4.033-6.326 1.425-13.712.593-20.419-3.197m1.591 46.886l12.148 7.017c-24.804 13.902-31.547 39.716-39.557 64.859-8.009-25.143-14.753-50.957-39.556-64.859l12.148-7.017a5.95 5.95 0 003.84-5.845c-1.113-23.547 5.245-33.96 13.821-40.498 3.076-2.342 6.434-3.518 9.747-3.518s6.671 1.176 9.748 3.518c8.576 6.538 14.934 16.951 13.821 40.498a5.95 5.95 0 003.84 5.845zM126 0c14.042.377 28.119 3.103 40.336 8.406 8.46 3.677 16.354 8.534 23.502 14.342 3.228 2.622 5.886 5.155 8.814 8.071 7.897.273 19.438-8.5 24.796-16.709-9.221 30.23-51.299 65.929-80.43 79.589-.012-.005-.02-.012-.029-.018-5.228-3.992-11.108-5.988-16.989-5.988s-11.76 1.996-16.988 5.988c-.009.005-.017.014-.029.018-29.132-13.66-71.209-49.359-80.43-79.589 5.357 8.209 16.898 16.982 24.795 16.709 2.929-2.915 5.587-5.449 8.814-8.071C69.31 16.94 77.204 12.083 85.664 8.406 97.882 3.103 111.959.377 126 0m-25.818 106.866c-9.176-4.576-20.854-11.312-32.544-20.541-2.465 5.119-2.735 9.586-1.466 13.193.901 2.542 2.597 4.753 4.826 6.512 2.416 1.901 5.432 3.285 8.766 4.033 6.326 1.425 13.711.593 20.418-3.197'></path>
							<path d='M197.167 75.016c6.436-6.495 12.107-13.684 16.667-20.099l2.316 4.359c7.456 14.917 11.33 29.774 11.33 46.494l-.016 26.532.14 13.754c.54 33.766 7.846 67.929 24.396 99.193l-34.627-27.922-24.501 39.759-25.74-24.231L126 299.604l-41.132-66.748-25.739 24.231-24.501-39.759L0 245.25c16.55-31.264 23.856-65.427 24.397-99.193l.14-13.754-.016-26.532c0-16.721 3.873-31.578 11.331-46.494l2.315-4.359c4.56 6.415 10.23 13.603 16.667 20.099l-2.01 4.175c-3.905 8.109-5.198 17.176-2.156 25.799 1.961 5.554 5.54 10.317 10.154 13.953 4.48 3.531 9.782 5.911 15.333 7.161 3.616.814 7.3 1.149 10.96 1.035-.854 4.841-1.227 9.862-1.251 14.978L53.2 160.984l25.206 14.129a41.926 41.926 0 015.734 3.869c20.781 18.658 33.275 73.855 41.861 100.816 8.587-26.961 21.08-82.158 41.862-100.816a41.865 41.865 0 015.734-3.869l25.206-14.129-32.665-18.866c-.024-5.116-.397-10.137-1.251-14.978 3.66.114 7.344-.221 10.96-1.035 5.551-1.25 10.854-3.63 15.333-7.161 4.613-3.636 8.193-8.399 10.153-13.953 3.043-8.623 1.749-17.689-2.155-25.799l-2.01-4.175z'></path>
						</svg>
					</div>
					<div className='dex__screener-result'>
						{data.map((item, index) => {
							if (tokenPosition === 'top') {
								if (index === 0) {
									return (
										<ul
											className='dex__screener-list'
											key={index}
											ref={screenerListRef}
										>
											<div className='dex__screener-list-main__block'>
												<ul className='dex__screener-list-main cosmic-theme'>
													<ul className='dex__screener-list-main__left'>
														<li className='dex__screener-list-main-name'>
															<span className='label'>Name: </span>
															<span className='tokenName'>
																{handlerTokenName(item.baseToken.name)}
															</span>
														</li>
														<li className='dex__screener-list-finance-price'>
															<span className='label'>Price: </span>
															<span>{item.priceUsd}$</span>
														</li>
														<li className='dex__screener-list-main-chain'>
															<span className='label'>Chain ID: </span>
															{item.chainId.toUpperCase()}
														</li>
														<li className='dex__screener-list-main-adress'>
															<span className='label'>Address: </span>
															<span
																className='token__address'
																onClick={() =>
																	handleCopyClick(item.baseToken.address)
																}
															>
																{copied
																	? 'Copied!'
																	: formatCryptoAddress(item.baseToken.address)}
																<img
																	className='copy__icon'
																	src={copyIcon}
																	alt='copy icon'
																></img>
															</span>
														</li>
													</ul>
													<ul className='dex__screener-list-main__right'>
														<li className='dex__screener-list-main-mkt'>
															<span className='label'>MKT CAP: </span>
															{transformValue(item.marketCap)}$
														</li>
														<li className='dex__screener-list-main-liquidity'>
															<span className='label'>Liquidity: </span>
															{transformValue(item.liquidity.usd)}$
														</li>
														<li className='dex__screener-list-main-createTime'>
															<span className='label'>Created: </span>
															{formatTimestamp(item.pairCreatedAt)}
														</li>
														<li className='dex__screener-list-main-socials'>
															<span className='label'>Socials: </span>
															{item?.info?.socials &&
																item?.info?.socials?.map(item => {
																	const socialType = item.type
																	const socialLink = item.url
																	return (
																		<a
																			className={`social__${socialType}-link`}
																			style={{ textAlign: 'center' }}
																			href={socialLink}
																			target='_blank'
																			rel='noopener noreferrer'
																		>
																			<img
																				className={`social__${socialType}-img`}
																				style={{
																					width: '24px',
																					height: '24px',
																					borderRadius: '50%',
																					marginInline: '0.5em',
																				}}
																				src={
																					socialType === 'twitter'
																						? twitter
																						: socialType === 'telegram'
																						? telegram
																						: socialType === 'discord'
																						? discord
																						: ''
																				}
																				alt={`${socialType} + ' logo' `}
																			/>
																		</a>
																	)
																})}
															{item?.info?.websites &&
																item?.info?.websites?.map(item => {
																	const socialType = item.label
																	const socialLink = item.url
																	return (
																		<a
																			className={`social__${socialType}-link`}
																			style={{ textAlign: 'center' }}
																			href={socialLink}
																			target='_blank'
																			rel='noopener noreferrer'
																		>
																			<img
																				className={`social__${socialType}-img`}
																				style={{
																					width: '24px',
																					height: '24px',
																					borderRadius: '50%',
																					marginInline: '0.5em',
																				}}
																				src={www}
																				alt={`${socialType} + ' logo' `}
																			/>
																		</a>
																	)
																})}
															{item?.url && (
																<a
																	className='dexscreener__link'
																	href={item?.url}
																	target='_blank'
																	rel='noopener noreferrer'
																>
																	<svg
																		style={{
																			width: '24px',
																			height: '24px',
																			borderRadius: '50%',
																			marginInline: '0.5em',
																		}}
																		xmlns='http://www.w3.org/2000/svg'
																		width='32px'
																		height='32px'
																		fill='#fff'
																		fill-rule='evenodd'
																		viewBox='0 0 252 300'
																		focusable='false'
																		class='chakra-icon custom-euf446'
																	>
																		<path d='M151.818 106.866c9.177-4.576 20.854-11.312 32.545-20.541 2.465 5.119 2.735 9.586 1.465 13.193-.9 2.542-2.596 4.753-4.826 6.512-2.415 1.901-5.431 3.285-8.765 4.033-6.326 1.425-13.712.593-20.419-3.197m1.591 46.886l12.148 7.017c-24.804 13.902-31.547 39.716-39.557 64.859-8.009-25.143-14.753-50.957-39.556-64.859l12.148-7.017a5.95 5.95 0 003.84-5.845c-1.113-23.547 5.245-33.96 13.821-40.498 3.076-2.342 6.434-3.518 9.747-3.518s6.671 1.176 9.748 3.518c8.576 6.538 14.934 16.951 13.821 40.498a5.95 5.95 0 003.84 5.845zM126 0c14.042.377 28.119 3.103 40.336 8.406 8.46 3.677 16.354 8.534 23.502 14.342 3.228 2.622 5.886 5.155 8.814 8.071 7.897.273 19.438-8.5 24.796-16.709-9.221 30.23-51.299 65.929-80.43 79.589-.012-.005-.02-.012-.029-.018-5.228-3.992-11.108-5.988-16.989-5.988s-11.76 1.996-16.988 5.988c-.009.005-.017.014-.029.018-29.132-13.66-71.209-49.359-80.43-79.589 5.357 8.209 16.898 16.982 24.795 16.709 2.929-2.915 5.587-5.449 8.814-8.071C69.31 16.94 77.204 12.083 85.664 8.406 97.882 3.103 111.959.377 126 0m-25.818 106.866c-9.176-4.576-20.854-11.312-32.544-20.541-2.465 5.119-2.735 9.586-1.466 13.193.901 2.542 2.597 4.753 4.826 6.512 2.416 1.901 5.432 3.285 8.766 4.033 6.326 1.425 13.711.593 20.418-3.197'></path>
																		<path d='M197.167 75.016c6.436-6.495 12.107-13.684 16.667-20.099l2.316 4.359c7.456 14.917 11.33 29.774 11.33 46.494l-.016 26.532.14 13.754c.54 33.766 7.846 67.929 24.396 99.193l-34.627-27.922-24.501 39.759-25.74-24.231L126 299.604l-41.132-66.748-25.739 24.231-24.501-39.759L0 245.25c16.55-31.264 23.856-65.427 24.397-99.193l.14-13.754-.016-26.532c0-16.721 3.873-31.578 11.331-46.494l2.315-4.359c4.56 6.415 10.23 13.603 16.667 20.099l-2.01 4.175c-3.905 8.109-5.198 17.176-2.156 25.799 1.961 5.554 5.54 10.317 10.154 13.953 4.48 3.531 9.782 5.911 15.333 7.161 3.616.814 7.3 1.149 10.96 1.035-.854 4.841-1.227 9.862-1.251 14.978L53.2 160.984l25.206 14.129a41.926 41.926 0 015.734 3.869c20.781 18.658 33.275 73.855 41.861 100.816 8.587-26.961 21.08-82.158 41.862-100.816a41.865 41.865 0 015.734-3.869l25.206-14.129-32.665-18.866c-.024-5.116-.397-10.137-1.251-14.978 3.66.114 7.344-.221 10.96-1.035 5.551-1.25 10.854-3.63 15.333-7.161 4.613-3.636 8.193-8.399 10.153-13.953 3.043-8.623 1.749-17.689-2.155-25.799l-2.01-4.175z'></path>
																	</svg>
																</a>
															)}
														</li>
													</ul>
												</ul>
												<div className='dex__screener-list-main-priceChange__block'>
													<div className='dex__screener-list-main-priceChange-text'>
														<p className='priceChange__title'>Price Change: </p>
														<span className={`price ${priceClass}`}>
															{currentPrice ? `${currentPrice}` : 'Loading...'}
														</span>
														<img
															src={
																priceClass === 'price-up'
																	? arrowUp
																	: priceClass === 'price-unchanged'
																	? dollar
																	: arrowDown
															}
															className={`priceArrow`}
															style={{
																width: '24px',
																height: '24px',
															}}
															alt='priceArrow icon'
														/>
													</div>
													<ul className='dex__screener-list-finance-priceChange'>
														<li
															className={`priceChange-5m ${getColorClass(
																item.priceChange.m5
															)}`}
														>
															<span>5min: </span>
															{transformValue(item.priceChange.m5)}%
														</li>
														<li
															className={`priceChange-h1 ${getColorClass(
																item.priceChange.h1
															)}`}
														>
															<span>1hour: </span>
															{transformValue(item.priceChange.h1)}%
														</li>
														<li
															className={`priceChange-h6 ${getColorClass(
																item.priceChange.h6
															)}`}
														>
															<span>6hours: </span>
															{transformValue(item.priceChange.h6)}%
														</li>
														<li
															className={`priceChange-h24 ${getColorClass(
																item.priceChange.h24
															)}`}
														>
															<span>24hours: </span>
															{transformValue(item.priceChange.h24)}%
														</li>
													</ul>
												</div>
											</div>
											<ul className='dex__screener-list-finance'>
												<li
													className='finance__tabs'
													data-selected-tab={selectedTab}
												>
													<button
														className={`finance__tab ${
															selectedTab === 'TXNS' ? 'active' : ''
														}`}
														onClick={() => setSelectedTab('TXNS')}
													>
														{`TXNS: ${calculateAll(
															item.txns.m5.buys,
															item.txns.m5.sells,
															item.txns.h1.buys,
															item.txns.h1.sells,
															item.txns.h6.buys,
															item.txns.h6.sells,
															item.txns.h24.buys,
															item.txns.h24.sells
														)}`}
													</button>
													<button
														className={`finance__tab ${
															selectedTab === 'Volume' ? 'active' : ''
														}`}
														onClick={() => setSelectedTab('Volume')}
													>
														{`Volume: ${calculateVolAll(
															item.volume.m5,
															item.volume.h1,
															item.volume.h6,
															item.volume.h24
														)}`}
														$
													</button>
												</li>
												{selectedTab === 'TXNS' && (
													<li className='finance__content'>
														<div className='txns__5min-block'>
															{(() => {
																const { buysWidth, sellsWidth } =
																	calculateWidth(
																		item.txns.m5.buys,
																		item.txns.m5.sells
																	)
																return (
																	<>
																		<div className='txns__5min-numbers'>
																			<div className='txns__5min-buys'>
																				<p className='txns__5min-buys-title'>
																					Buys
																				</p>
																				<p className='txns__5min-buys-amount'>
																					{item?.txns?.m5?.buys
																						? transformValue(
																								item?.txns?.m5?.buys
																						  )
																						: ''}
																				</p>
																			</div>
																			<p className='txnsTitle txns__5min'>
																				5m:
																			</p>
																			<div className='txns__5min-sells'>
																				<p className='txns__5min-sells-title'>
																					Sells
																				</p>
																				<p className='txns__5min-sells-amount'>
																					{item?.txns?.m5?.sells
																						? transformValue(
																								item?.txns?.m5?.sells
																						  )
																						: ''}
																				</p>
																			</div>
																		</div>
																		<div
																			className='txns__5min-progressbar'
																			style={{ display: 'flex' }}
																		>
																			<div
																				className={
																					`txns__5min-progressbar-buys` +
																					` ${
																						buysWidth > sellsWidth
																							? 'buys--active'
																							: 'buys'
																					}`
																				}
																				style={{
																					width: `${buysWidth}%`,
																					height: '2em',
																					background: 'rgba(14, 151, 62, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{buysWidth.toFixed(1)}%
																			</div>
																			<div
																				className={
																					`txns__5min-progressbar-sells` +
																					` ${
																						sellsWidth > buysWidth
																							? 'sells--active'
																							: 'sells'
																					}`
																				}
																				style={{
																					width: `${sellsWidth}%`,
																					height: '2em',
																					background: 'rgba(236, 21, 23, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{sellsWidth.toFixed(1)}%
																			</div>
																		</div>
																	</>
																)
															})()}
														</div>
														<div className='txns__h1-block'>
															{(() => {
																const { buysWidth, sellsWidth } =
																	calculateWidth(
																		item.txns.h1.buys,
																		item.txns.h1.sells
																	)
																return (
																	<>
																		<div className='txns__h1-numbers'>
																			<div className='txns__h1-buys'>
																				<p className='txns__h1-buys-title'>
																					Buys
																				</p>
																				<p className='txns__h1-buys-amount'>
																					{item?.txns?.h1?.buys
																						? transformValue(
																								item?.txns?.h1?.buys
																						  )
																						: ''}
																				</p>
																			</div>
																			<p className='txnsTitle txns__h1'>h1:</p>
																			<div className='txns__h1-sells'>
																				<p className='txns__h1-sells-title'>
																					Sells
																				</p>
																				<p className='txns__h1-sells-amount'>
																					{item?.txns?.h1?.sells
																						? transformValue(
																								item?.txns?.h1?.sells
																						  )
																						: ''}
																				</p>
																			</div>
																		</div>
																		<div
																			className='txns__h1-progressbar'
																			style={{ display: 'flex' }}
																		>
																			<div
																				className={
																					`txns__h1-progressbar-buys` +
																					` ${
																						buysWidth > sellsWidth
																							? 'buys--active'
																							: 'buys'
																					}`
																				}
																				style={{
																					width: `${buysWidth}%`,
																					height: '2em',
																					background: 'rgba(14, 151, 62, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{buysWidth.toFixed(1)}%
																			</div>
																			<div
																				className={
																					`txns__h1-progressbar-sells` +
																					` ${
																						sellsWidth > buysWidth
																							? 'sells--active'
																							: 'sells'
																					}`
																				}
																				style={{
																					width: `${sellsWidth}%`,
																					height: '2em',
																					background: 'rgba(236, 21, 23, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{sellsWidth.toFixed(1)}%
																			</div>
																		</div>
																	</>
																)
															})()}
														</div>
														<div className='txns__h6-block'>
															{(() => {
																const { buysWidth, sellsWidth } =
																	calculateWidth(
																		item.txns.h6.buys,
																		item.txns.h6.sells
																	)
																return (
																	<>
																		<div className='txns__h6-numbers'>
																			<div className='txns__h6-buys'>
																				<p className='txns__h6-buys-title'>
																					Buys
																				</p>
																				<p className='txns__h6-buys-amount'>
																					{item?.txns?.h6?.buys
																						? transformValue(
																								item?.txns?.h6?.buys
																						  )
																						: ''}
																				</p>
																			</div>
																			<p className='txnsTitle txns__h6'>h6:</p>
																			<div className='txns__h6-sells'>
																				<p className='txns__h6-sells-title'>
																					Sells
																				</p>
																				<p className='txns__h6-sells-amount'>
																					{item?.txns?.h6?.sells
																						? transformValue(
																								item?.txns?.h6?.sells
																						  )
																						: ''}
																				</p>
																			</div>
																		</div>
																		<div
																			className='txns__h6-progressbar'
																			style={{ display: 'flex' }}
																		>
																			<div
																				className={
																					`txns__h6-progressbar-buys` +
																					` ${
																						buysWidth > sellsWidth
																							? 'buys--active'
																							: 'buys'
																					}`
																				}
																				style={{
																					width: `${buysWidth}%`,
																					height: '2em',
																					background: 'rgba(14, 151, 62, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{buysWidth.toFixed(1)}%
																			</div>
																			<div
																				className={
																					`txns__h6-progressbar-sells` +
																					` ${
																						sellsWidth > buysWidth
																							? 'sells--active'
																							: 'sells'
																					}`
																				}
																				style={{
																					width: `${sellsWidth}%`,
																					height: '2em',
																					background: 'rgba(236, 21, 23, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{sellsWidth.toFixed(1)}%
																			</div>
																		</div>
																	</>
																)
															})()}
														</div>
														<div className='txns__h24-block'>
															{(() => {
																const { buysWidth, sellsWidth } =
																	calculateWidth(
																		item.txns.h24.buys,
																		item.txns.h24.sells
																	)
																return (
																	<>
																		<div className='txns__h24-numbers'>
																			<div className='txns__h24-buys'>
																				<p className='txns__h24-buys-title'>
																					Buys
																				</p>
																				<p className='txns__h24-buys-amount'>
																					{item?.txns?.h24?.buys
																						? transformValue(
																								item?.txns?.h24?.buys
																						  )
																						: ''}
																				</p>
																			</div>
																			<p className='txnsTitle txns__h24'>
																				h24:
																			</p>
																			<div className='txns__h24-sells'>
																				<p className='txns__h24-sells-title'>
																					Sells
																				</p>
																				<p className='txns__h24-sells-amount'>
																					{item?.txns?.h24?.sells
																						? transformValue(
																								item?.txns?.h24?.sells
																						  )
																						: ''}
																				</p>
																			</div>
																		</div>
																		<div
																			className='txns__h24-progressbar'
																			style={{ display: 'flex' }}
																		>
																			<div
																				className={
																					`txns__h24-progressbar-buys` +
																					` ${
																						buysWidth > sellsWidth
																							? 'buys--active'
																							: 'buys'
																					}`
																				}
																				style={{
																					width: `${buysWidth}%`,
																					height: '2em',
																					background: 'rgba(14, 151, 62, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{buysWidth.toFixed(1)}%
																			</div>
																			<div
																				className={
																					`txns__h24-progressbar-sells` +
																					` ${
																						sellsWidth > buysWidth
																							? 'sells--active'
																							: 'sells'
																					}`
																				}
																				style={{
																					width: `${sellsWidth}%`,
																					height: '2em',
																					background: 'rgba(236, 21, 23, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{sellsWidth.toFixed(1)}%
																			</div>
																		</div>
																	</>
																)
															})()}
														</div>
													</li>
												)}
												{selectedTab === 'Volume' && (
													<div className='finance__content'>
														<div className='volume__5min-block'>
															{(() => {
																const { buysWidth, sellsWidth } =
																	calculateWidth(
																		item.txns.m5.buys,
																		item.txns.m5.sells
																	)
																return (
																	<>
																		<div className='volume__5min-text'>
																			<p className='volume__5min-block-title'>
																				5min
																			</p>
																			<div className='volume__5min-block-amount'>
																				{item?.volume?.m5
																					? transformValue(item?.volume?.m5)
																					: ''}
																			</div>
																		</div>
																		<div className='volume__5min-progressbar'>
																			<div
																				className={
																					`volume__5min-progressbar-buys` +
																					` ${
																						buysWidth > sellsWidth
																							? 'buys--active'
																							: 'buys'
																					}`
																				}
																				style={{
																					width: `${buysWidth}%`,
																					height: '2em',
																					background: 'rgba(14, 151, 62, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{item?.volume?.m5
																					? calculateVol(
																							item.volume.m5,
																							buysWidth
																					  )
																					: ''}
																			</div>
																			<div
																				className={
																					`volume__5min-progressbar-sells` +
																					` ${
																						sellsWidth > buysWidth
																							? 'sells--active'
																							: 'sells'
																					}`
																				}
																				style={{
																					width: `${sellsWidth}%`,
																					height: '2em',
																					background: 'rgba(236, 21, 23, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{item?.volume?.m5
																					? calculateVol(
																							item.volume.m5,
																							sellsWidth
																					  )
																					: ''}
																			</div>
																		</div>
																	</>
																)
															})()}
														</div>
														<div className='volume__h1-block'>
															{(() => {
																const { buysWidth, sellsWidth } =
																	calculateWidth(
																		item.txns.h1.buys,
																		item.txns.h1.sells
																	)
																return (
																	<>
																		<div className='volume__h1-text'>
																			<p className='volume__h1-block-title'>
																				h1
																			</p>
																			<div className='volume__h1-block-amount'>
																				{transformValue(item.volume.h1) + '$' ||
																					'No Data'}
																			</div>
																		</div>
																		<div className='volume__h1-progressbar'>
																			<div
																				className={
																					`volume__h1-progressbar-buys` +
																					` ${
																						buysWidth > sellsWidth
																							? 'buys--active'
																							: 'buys'
																					}`
																				}
																				style={{
																					width: `${buysWidth}%`,
																					height: '2em',
																					background: 'rgba(14, 151, 62, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{calculateVol(
																					item.volume.h1,
																					buysWidth
																				) + '$' || 'No Data'}
																			</div>
																			<div
																				className={
																					`volume__h1-progressbar-sells` +
																					` ${
																						sellsWidth > buysWidth
																							? 'sells--active'
																							: 'sells'
																					}`
																				}
																				style={{
																					width: `${sellsWidth}%`,
																					height: '2em',
																					background: 'rgba(236, 21, 23, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{calculateVol(
																					item.volume.h1,
																					sellsWidth
																				) + '$' || 'No Data'}
																			</div>
																		</div>
																	</>
																)
															})()}
														</div>
														<div className='volume__h6-block'>
															{(() => {
																const { buysWidth, sellsWidth } =
																	calculateWidth(
																		item.txns.h6.buys,
																		item.txns.h6.sells
																	)
																return (
																	<>
																		<div className='volume__h6-text'>
																			<p className='volume__h6-block-title'>
																				h6
																			</p>
																			<div className='volume__h6-block-amount'>
																				{transformValue(item.volume.h6) + '$' ||
																					'No Data'}
																			</div>
																		</div>
																		<div className='volume__h6-progressbar'>
																			<div
																				className={
																					`volume__h6-progressbar-buys` +
																					` ${
																						buysWidth > sellsWidth
																							? 'buys--active'
																							: 'buys'
																					}`
																				}
																				style={{
																					width: `${buysWidth}%`,
																					height: '2em',
																					background: 'rgba(14, 151, 62, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{calculateVol(
																					item.volume.h6,
																					buysWidth
																				) + '$' || 'No Data'}
																			</div>
																			<div
																				className={
																					`volume__h6-progressbar-sells` +
																					` ${
																						sellsWidth > buysWidth
																							? 'sells--active'
																							: 'sells'
																					}`
																				}
																				style={{
																					width: `${sellsWidth}%`,
																					height: '2em',
																					background: 'rgba(236, 21, 23, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{calculateVol(
																					item.volume.h6,
																					sellsWidth
																				) + '$' || 'No Data'}
																			</div>
																		</div>
																	</>
																)
															})()}
														</div>
														<div className='volume__h24-block'>
															{(() => {
																const { buysWidth, sellsWidth } =
																	calculateWidth(
																		item.txns.h24.buys,
																		item.txns.h24.sells
																	)
																return (
																	<>
																		<div className='volume__h6-text'>
																			<p className='volume__h24-block-title'>
																				h24
																			</p>
																			<div className='volume__h24-block-amount'>
																				{transformValue(item.volume.h24) +
																					'$' || 'No Data'}
																			</div>
																		</div>
																		<div className='volume__h24-progressbar'>
																			<div
																				className={
																					`volume__h24-progressbar-buys` +
																					` ${
																						buysWidth > sellsWidth
																							? 'buys--active'
																							: 'buys'
																					}`
																				}
																				style={{
																					width: `${buysWidth}%`,
																					height: '2em',
																					background: 'rgba(14, 151, 62, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{calculateVol(
																					item.volume.h24,
																					buysWidth
																				) + '$' || 'No Data'}
																			</div>
																			<div
																				className={
																					`volume__h24-progressbar-sells` +
																					` ${
																						sellsWidth > buysWidth
																							? 'sells--active'
																							: 'sells'
																					}`
																				}
																				style={{
																					width: `${sellsWidth}%`,
																					height: '2em',
																					background: 'rgba(236, 21, 23, 0.9)',
																					textAlign: 'center',
																					borderRadius: '5px',
																				}}
																			>
																				{calculateVol(
																					item.volume.h24,
																					sellsWidth
																				) + '$' || 'No Data'}
																			</div>
																		</div>
																	</>
																)
															})()}
														</div>
													</div>
												)}
											</ul>
										</ul>
									)
								}
							}
						})}
					</div>
				</div>
			)}
		</>
	)
}
