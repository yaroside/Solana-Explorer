import React, { useState } from 'react'

import DexScreenerLogo from './images/servicesLogos/DexScreenerLogo.svg'
import RugCheckLogo from './images/servicesLogos/rugcheck.jpg'
import whaleLogo from './images/creos/whale.svg'
import meteoraLogo from './images/servicesLogos/meteora.svg'
import bubblemapsLogo from './images/servicesLogos/bubblemaps.svg'

import Header from './Components/Header'
import Form from './Components/Form/Form'
import DexScreener from './Components/DexScreener/DexScreener'
import Holders from './Components/Holders Check/Holders'
import DEFI from './Components/DEFI/DEFI'
import RugCheck from './Components/RugCheck/RugCheck'
import BubbleMaps from './Components/BubbleMaps/BubbleMaps'
import Meteora from './Components/Meteora Pools/Meteora'
import DesktopOnlyBanner from './Components/Desktop/Desktop'

import './style/index.css'

export default function App() {
	const [requestData, setRequestData] = useState({})
	const [requestParams, setRequestParams] = useState({})
	const [sectionActive, setSectionActive] = useState('')

	const windowSize = window.innerWidth

	if (windowSize < 1440) {
		return <DesktopOnlyBanner />
	}

	const handleClickSection = service => {
		setSectionActive(service)
	}

	return (
		<>
			<Header />
			<main className='main'>
				<section className='token__info'>
					<Form
						setRequestData={setRequestData}
						setRequestParams={setRequestParams}
						setSectionActive={setSectionActive}
					/>
					<div className='info'>
						<ul className='info__titles'>
							<li
								className={`info__title-item info__title-dexscreener ${
									sectionActive === 'Trades' ? 'active' : ''
								}`}
								onClick={() => handleClickSection('Trades')}
							>
								<h2 className='info__title-service dex__screener-title'>
									Trades
								</h2>
								<img
									className='info__title-logo'
									src={DexScreenerLogo}
									alt='DexScreener logo'
								/>
							</li>
							<li
								className={`info__title-item info__title-holders ${
									sectionActive === 'Holders' ? 'active' : ''
								}`}
								onClick={() => handleClickSection('Holders')}
							>
								<h2 className='info__title-service holders-title'>Holders</h2>
								<img
									className='info__title-logo'
									src={whaleLogo}
									alt='Whale logo'
								/>
							</li>
							<li
								className={`info__title-item info__title-defi ${
									sectionActive === 'DEFI' ? 'active' : ''
								}`}
								onClick={() => handleClickSection('DEFI')}
							>
								<h2 className='info__title-service defi-title'>DEFI</h2>
								<img
									className='info__title-logo'
									src={meteoraLogo}
									alt='Meteora Logo'
								/>
							</li>
							<li
								className={`info__title-item info__title-rugcheck ${
									sectionActive === 'RugCheck' ? 'active' : ''
								}`}
								onClick={() => handleClickSection('RugCheck')}
							>
								<h2 className='info__title-service bubblemaps-title'>
									RugCheck
								</h2>
								<img
									className='info__title-logo'
									src={RugCheckLogo}
									alt='RugCheck logo'
								/>
							</li>
							<li
								className={`info__title-item info__title-bubblemaps ${
									sectionActive === 'BubbleMaps' ? 'active' : ''
								}`}
								onClick={() => handleClickSection('BubbleMaps')}
							>
								<h2 className='info__title-service bubblemaps-title'>
									BubbleMaps
								</h2>
								<img
									className='info__title-logo'
									src={bubblemapsLogo}
									alt='BubbleMaps logo'
								/>
							</li>
						</ul>
					</div>
					{(requestData.chain !== undefined &&
						requestData.chain !== undefined && (
							<>
								<div className='sections__list'>
									<section
										className={`request__result ${
											sectionActive === 'Trades'
												? 'request__result--active'
												: ''
										}`}
									>
										<DexScreener
											requestData={requestData}
											requestParams={requestParams}
										/>
									</section>
									<section
										className={`request__result ${
											sectionActive === 'Holders'
												? 'request__result--active'
												: ''
										}`}
									>
										<Holders requestData={requestData} />
									</section>
									<section
										className={`request__result ${
											sectionActive === 'DEFI' ? 'request__result--active' : ''
										}`}
									>
										<DEFI requestData={requestData} />
									</section>
									<section
										className={`request__result ${
											sectionActive === 'RugCheck'
												? 'request__result--active'
												: ''
										}`}
									>
										<RugCheck requestData={requestData} />
									</section>
									<section
										className={`request__result ${
											sectionActive === 'BubbleMaps'
												? 'request__result--active'
												: ''
										}`}
									>
										<BubbleMaps requestData={requestData} />
									</section>
								</div>
							</>
						)) || (
						<div className='waiting__section'>
							<p className='waiting__contract-text'>
								Enter Token Mint into input field
							</p>
						</div>
					)}
				</section>
				<section className='meteora__section'>
					<Meteora requestData={requestData} />
				</section>
			</main>
		</>
	)
}
