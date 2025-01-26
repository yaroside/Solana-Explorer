import React, { useState } from 'react'
import { chainsData } from './data'
import '../../style/index.css'
import arrowDown from '../../images/arrow_down.svg'
import arrowUp from '../../images/arrow_up.svg'

export default function Form({ setRequestData, setRequestParams }) {
	const [chain, setChain] = useState(chainsData[0])
	const [menu, setMenu] = useState(false)
	const [contract, setContract] = useState(null)

	const toggleMenu = () => {
		const menu = document.querySelector('.other__chains')
		menu.classList.toggle('other__chains--active')
		setMenu(prevMenu => !prevMenu)
	}

	const dataRequest = e => {
		e.preventDefault()
		const requestObject = {
			chain: chain.name.toLowerCase(),
			contract: contract,
		}
		const requestParams = {
			tokenPosition: 'top',
		}
		setRequestData(requestObject)
		setRequestParams(requestParams)
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
						<span className='chain__selected-name'>{chain.name}</span>
						<img
							className='chaind__selected-svg'
							src={menu ? arrowUp : arrowDown}
							alt='arrow icon'
						/>
					</div>
					<div className='other__chains'>
						{chainsData
							.filter(item => item.id !== chain.id)
							.map(item => (
								<div
									className={`chain__item + ${item.name}`}
									key={item.id}
									data-blockchain-id={item.name}
									onClick={() => {
										toggleMenu()
										setChain(item)
									}}
								>
									<img src={item.imgUrl} alt={item.altImg} />
									<span>{item.name}</span>
								</div>
							))}
					</div>
				</div>
				<form className='chain__form'>
					<input
						className='chain__form-adress'
						type='text'
						placeholder={`Example: ` + chain.placeholder}
						onChange={e => setContract(e.target.value)}
					/>
					<button
						className='chain__form-btn'
						type='submit'
						onClick={dataRequest}
					>
						Explore
					</button>
				</form>
			</div>
		</section>
	)
}
