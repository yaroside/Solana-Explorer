const apiInfo = {
	SOLMint: `So11111111111111111111111111111111111111112`,
	apiMeteoraSOLPool: function (contract) {
		return `https://dlmm-api.meteora.ag/pair/all_by_groups?page=0&limit=10&include_pool_token_pairs=${this.SOLMint}-${contract}`
	},
	USDCMint: `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v`,
	apiMeteoraUSDCPool: function (contract) {
		return `https://dlmm-api.meteora.ag/pair/all_by_groups?page=0&limit=10&include_pool_token_pairs=${this.USDCMint}-${contract}`
	},
}
export { apiInfo }
