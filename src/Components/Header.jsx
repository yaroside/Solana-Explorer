import React, { useEffect, useState } from 'react'
import logo from '../images/logo.svg'
import '../style/header.css'

export default function Header() {
	const [displayText, setDisplayText] = useState('Solana Explorer')

	return (
		<>
			<header className='header'>
				<h2 className='header__title'>
					<span className='light'>{displayText}</span>
				</h2>
				<img className='header__logo' src={logo} alt='logo icon' />
			</header>
		</>
	)
}
