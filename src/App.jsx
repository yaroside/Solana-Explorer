import React, { useState } from 'react'
import video from './video/background-video.mp4'
import Header from './Components/Header'
import Form from './Components/Form/Form'
import DexScreener from './Components/DexScreener'

import './style/index.css'

export default function App() {
	const [requestData, setRequestData] = useState({})
	const [requestParams, setRequestParams] = useState({})

	return (
		<main className='main'>
			<video src={video} autoPlay loop muted></video>
			<Header />
			<Form
				setRequestData={setRequestData}
				setRequestParams={setRequestParams}
			/>
			<DexScreener requestData={requestData} requestParams={requestParams} />
		</main>
	)
}
