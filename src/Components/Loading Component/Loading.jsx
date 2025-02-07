import React from 'react'

import loadingCircle from '../../images/pointers/spinner-third.svg'

import '../../style/loading.css'

export default function Loading({
	text,
	serviceLink,
	serviceName,
	textColor,
	circleDisplay,
}) {
	return (
		<>
			<div className='loading__block'>
				<div className='loading-indicator' style={{ color: textColor }}>
					{text}
					<img
						className='loadingCircle'
						style={{ display: circleDisplay }}
						src={loadingCircle}
						alt='loading circle'
					/>
					{serviceLink && serviceName && (
						<a
							className={`serviceLink--${serviceName}`}
							href={serviceLink}
							target='_blank'
							rel='noopener noreferrer'
						>
							Link to Service {serviceName}
						</a>
					)}
				</div>
			</div>
		</>
	)
}
