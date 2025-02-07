import React, { useState, useEffect } from 'react'
import Loading from '../Loading Component/Loading'

import { fetchRugCheck } from './fetchRugCheck/fetchRequests'
import { apiRugCheckInfo } from './apiRugCheck/apiRugCheck'

import '../../style/RugCheck.css'

export default function RugCheck({ requestData }) {
	const { chain, contract } = requestData
	const [rugCheckData, setRugCheckData] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [hasData, setHasData] = useState(true)
	const [dominantRisk, setDominantRisk] = useState('')

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await fetchRugCheck(contract)
				setRugCheckData(response.risks || [])
				setIsLoading(false)
			} catch (error) {
				console.error('Ошибка загрузки данных:', error)
				setIsLoading(false)
				setHasData(false)
			}
		}
		fetchData()
	}, [contract])

	useEffect(() => {
		if (rugCheckData.length > 0) {
			const riskCounts = rugCheckData.reduce(
				(acc, risk) => {
					acc[risk.level] = (acc[risk.level] || 0) + 1
					acc['riskScore'] += risk.score
					return acc
				},
				{ danger: 0, warn: 0, riskScore: 0 }
			)

			if (riskCounts.riskScore < 1000) {
				setDominantRisk('good')
			} else if (riskCounts.danger > riskCounts.warn) {
				setDominantRisk('danger')
			} else if (riskCounts.warn > riskCounts.danger) {
				setDominantRisk('warn')
			} else if (riskCounts.warn === riskCounts.danger) {
				setDominantRisk('danger')
			}
		}
	}, [rugCheckData])

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
		<div className='rug__check'>
			<div className='rug-check-wrapper'>
				<div className='rug-check-left'>
					<ul>
						{(Object.keys(rugCheckData).length > 0 &&
							rugCheckData.map((risk, index) => (
								<li key={index} className={`risk-item ${risk.level}`}>
									<strong
										className={`risk-title ${
											risk.level === 'danger' ? 'danger__title' : 'warn__title'
										}`}
									>
										{risk.name}
									</strong>
									<p className='risk-desc'>{risk.description}</p>
								</li>
							))) || (
							<li className='risk-item empty-item'>
								<strong>All Good</strong>
							</li>
						)}
					</ul>
				</div>
				<div className='rug-check-right'>
					<div className={`final-risk ${dominantRisk}`}>
						{(dominantRisk && (
							<div className={`risk-analysis ${dominantRisk}`}>
								Risk Analysis:{' '}
								<span className='risk-analysis--status'>
									{dominantRisk === 'danger'
										? 'Danger!'
										: dominantRisk === 'good'
										? 'Good'
										: 'Warning'}
								</span>
								<span> || </span>
								<a
									className='rugcheck__link'
									href={apiRugCheckInfo.rugCheckTokenInfo(contract)}
									target='_blank'
									rel='noopener noreferrer'
								>
									Link to RugCheck
								</a>
							</div>
						)) || (
							<div className='risk-analysis empty-risk'>
								<p>Risks not found</p>
								<span> || </span>
								<a
									className='rugcheck__link'
									href={apiRugCheckInfo.rugCheckTokenInfo(contract)}
									target='_blank'
									rel='noopener noreferrer'
								>
									Link to RugCheck
								</a>
							</div>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}
