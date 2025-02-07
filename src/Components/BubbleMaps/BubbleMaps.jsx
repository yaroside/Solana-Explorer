import React, { useState, useEffect } from 'react'
import Loading from '../Loading Component/Loading'

import { isPairAvailable } from './fetchMethods/fetchMethods'
import { bubbleMaps } from './api4BubbleMaps/apiBubbleMaps'

import '../../style/BubbleMaps.css'

export default function BubbleMaps({ requestData }) {
	const { chain, contract } = requestData
	const chainFormatted = chain === 'solana' ? 'sol' : ''
	const [iframeUrl, setIframeUrl] = useState(null)
	const [iframeError, setIframeError] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [hasData, setHasData] = useState(true)
	const [isOpen, setIsOpen] = useState(true)

	useEffect(() => {
		const fetchIsAvailable = async () => {
			try {
				const availabilityToken = await isPairAvailable(
					chainFormatted,
					contract
				)
				if (
					!availabilityToken ||
					availabilityToken.availability !== true ||
					availabilityToken.status !== 'OK'
				) {
					setIframeError('Pair does not exist')
					setIframeUrl(null)
					setIsLoading(false)
					setHasData(false)
					return
				}

				const url = bubbleMaps.iframeLink(chainFormatted, contract)
				const urlFiltered = url.match(/src=["']([^"']+)["']/)
				setIframeUrl(urlFiltered ? urlFiltered[1] : null)
			} catch (error) {
				console.error(`Error fetching iframe URL: `, error.message)
				setIframeUrl(null)
			} finally {
				setIsLoading(false)
			}
		}

		fetchIsAvailable()
	}, [chain, contract])

	const handleClose = () => {
		setIsOpen(false)
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		})
	}

	const handleOpen = () => {
		setIsOpen(true)
	}

	if (isLoading) {
		return <Loading text='Loading...' textColor='green' circleDisplay='block' />
	} else if (!hasData) {
		return (
			<Loading
				text={`Failed to Loading Data...`}
				serviceLink={`https://dexscreener.com/solana/${contract}`}
				serviceName={`DexScreener`}
				textColor='red'
				circleDisplay='none'
			/>
		)
	}

	return (
		<div className='bubble__maps'>
			{isOpen ? (
				iframeError ? (
					<p className='iframe__error'>{iframeError}</p>
				) : (
					<div className='iframeBlock fade-in'>
						<div className='iframeInner'>
							<iframe className='iframeContent' src={iframeUrl} />
							<p className='close__btn' onClick={handleClose}>
								Close BubbleMaps
							</p>
						</div>
					</div>
				)
			) : (
				<div className='iframe__closed-message fade-in'>
					<p className='open__btn' onClick={handleOpen}>
						Open BubbleMaps
					</p>
					<a
						className='external__link'
						href={iframeUrl}
						target='_blank'
						rel='noopener noreferrer'
					>
						Go to BubbleMaps
					</a>
				</div>
			)}
		</div>
	)
}
