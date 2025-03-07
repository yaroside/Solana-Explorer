import React from 'react'

import MeteoraPools from './Parsers/meteoraPools'
import poolsFetch from './Parsers/poolsFetch'

const Meteora = React.memo(() => {
	const { pools, loading, time } = poolsFetch()

	return (
		<div className='meteora__pools'>
			<MeteoraPools pools={pools} loading={loading} time={time} />
		</div>
	)
})

export default Meteora
