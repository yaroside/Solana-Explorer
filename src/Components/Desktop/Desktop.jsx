import { useState, useEffect } from 'react'
import '../../style/desktop.css'

export default function DesktopOnlyBanner() {
	const [isMobile, setIsMobile] = useState(window.innerWidth < 1440)

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 1440)
		window.addEventListener('resize', handleResize)
		return () => window.removeEventListener('resize', handleResize)
	}, [])

	if (!isMobile) return null

	return (
		<div className='desktop-only-banner'>
			<p>⚠️ This web application is only available on a PC (from 1440px).</p>
		</div>
	)
}
