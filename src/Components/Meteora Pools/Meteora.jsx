import React from 'react'

import MeteoraPools from './Parsers/meteoraPools'
import poolsFetch from './Parsers/poolsFetch'

const Meteora = React.memo(() => {
	const { pools, loading, time } = poolsFetch()

	return <MeteoraPools pools={pools} loading={loading} time={time} />
})

export default Meteora
