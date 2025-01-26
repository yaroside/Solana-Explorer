import React, { useState } from 'react'

import BackgroundVideo from './Components/BackgroundVideo'
import Header from './Components/Header'
import Form from './Components/Form/Form'
import DexScreener from './Components/DexScreener'

import './style/index.css'

export default function App() {
	const [requestData, setRequestData] = useState({})
	const [requestParams, setRequestParams] = useState({})

	return (
		<main className='main'>
			<BackgroundVideo />
			<Header />
			<Form
				setRequestData={setRequestData}
				setRequestParams={setRequestParams}
			/>
			<DexScreener requestData={requestData} requestParams={requestParams} />
		</main>
	)
}
