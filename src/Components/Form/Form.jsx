import React, { useState, useRef } from 'react'

import { chainsData } from './data'

import '../../style/index.css'

export default function Form({
	setRequestData,
	setRequestParams,
	setSectionActive,
}) {
	const [chain, setChain] = useState(chainsData[0])
	const [menu, setMenu] = useState(false)
	const [contract, setContract] = useState('')
	const inputRef = useRef(null)

	const toggleMenu = () => {
		const menu = document.querySelector('.other__chains')
		menu.classList.toggle('other__chains--active')
		setMenu(prevMenu => !prevMenu)
	}

	const dataRequest = e => {
		e.preventDefault()

		if (contract.split('').length < 31 || contract.split('').length > 44) {
			inputRef.current.style.boxShadow = '0 0 10px rgba(255, 43, 43, 0.5)'
			setTimeout(() => (inputRef.current.style.boxShadow = '0 0 0'), 2000)
			return
		}

		const requestObject = {
			chain: chain.name.toLowerCase(),
			contract: contract,
		}
		const requestParams = {
			tokenPosition: 'top',
		}
		setRequestData(requestObject)
		setRequestParams(requestParams)
		setSectionActive('Trades')
	}

	return (
		<section className='form__component'>
			<div className='chains__params'>
				<div className='chain__choose'>
					<div
						className='chain__selected'
						onClick={toggleMenu}
						data-chain-id={chain.name}
					>
						<img
							className='chain__selected-logo'
							src={chain.imgUrl}
							alt={chain.altImg}
						/>
					</div>
				</div>
				<div className='chain__form'>
					<input
						className='chain__form-adress'
						type='text'
						placeholder={`Example: ` + chain.placeholder}
						onChange={e => setContract(e.target.value)}
						ref={inputRef}
					/>
				</div>
				<div className='chain__btn'>
					<button
						className='chain__form-btn'
						type='submit'
						onClick={dataRequest}
					>
						Explore
					</button>
				</div>
			</div>
		</section>
	)
}
