import React, { useState } from 'react'

import DexScreenerLogo from './images/servicesLogos/DexScreenerLogo.svg'
import RugCheckLogo from './images/servicesLogos/rugcheck.jpg'

import BackgroundVideo from './Components/BackgroundVideo'
import Header from './Components/Header'
import Form from './Components/Form/Form'
import DexScreener from './Components/DexScreener'
import Holders from './Components/Holders Check/Holders'

import './style/index.css'

export default function App() {
	const [requestData, setRequestData] = useState({})
	const [requestParams, setRequestParams] = useState({})
	const [sectionActive, setSectionActive] = useState('DexScreener')

	const handleClickSection = service => {
		setSectionActive(service)
	}

	return (
		<main className='main'>
			{/* <BackgroundVideo /> */}
			<Header />
			<Form
				setRequestData={setRequestData}
				setRequestParams={setRequestParams}
			/>
			<div className='info'>
				<ul className='info__titles'>
					<li
						className={`info__title-item info__title-dexscreener ${
							sectionActive === 'DexScreener' ? 'active' : ''
						}`}
						onClick={() => handleClickSection('DexScreener')}
					>
						<h2 className='info__title-service dex__screener-title'>
							Trade Stat
						</h2>
						<img
							className='info__title-logo'
							src={DexScreenerLogo}
							alt='DexScreener logo'
						/>
					</li>
					<li
						className={`info__title-item info__title-rugcheck ${
							sectionActive === 'Holders Stat' ? 'active' : ''
						}`}
						onClick={() => handleClickSection('Holders Stat')}
					>
						<h2 className='info__title-service holders-title'>Holders Stat</h2>
						<img
							className='info__title-logo'
							src={RugCheckLogo}
							alt='RugCheck logo'
						/>
					</li>
					<li
						className={`info__title-item info__title-rugcheck ${
							sectionActive === 'Defi' ? 'active' : ''
						}`}
						onClick={() => handleClickSection('Defi')}
					>
						<h2 className='info__title-service defi-title'>Defi Activity</h2>
						<img
							className='info__title-logo'
							src={RugCheckLogo}
							alt='RugCheck logo'
						/>
					</li>
					<li
						className={`info__title-item info__title-rugcheck ${
							sectionActive === 'BubbleMaps' ? 'active' : ''
						}`}
						onClick={() => handleClickSection('BubbleMaps')}
					>
						<h2 className='info__title-service bubblemaps-title'>BubbleMaps</h2>
						<img
							className='info__title-logo'
							src={RugCheckLogo}
							alt='RugCheck logo'
						/>
					</li>
					<li
						className={`info__title-item info__title-rugcheck ${
							sectionActive === 'Review' ? 'active' : ''
						}`}
						onClick={() => handleClickSection('Review')}
					>
						<h2 className='info__title-service review-title'>Review</h2>
						<img
							className='info__title-logo'
							src={RugCheckLogo}
							alt='RugCheck logo'
						/>
					</li>
				</ul>

				{sectionActive === 'DexScreener' && (
					<DexScreener
						requestData={requestData}
						requestParams={requestParams}
					/>
				)}
				{sectionActive === 'Holders Stat' && (
					<Holders requestData={requestData} />
				)}
			</div>
		</main>
	)
}
