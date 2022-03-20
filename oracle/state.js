exports.state = JSON.parse(`
  {
  	"coingecko": {
  		"prices": {
  			"polkadot": {
  				"usd": 19.26
  			},
  			"binancecoin": {
  				"usd": 395.12
  			},
  			"sushi": {
  				"usd": 3.3
  			},
  			"cosmos": {
  				"usd": 28.5
  			},
  			"avalanche-2": {
  				"usd": 88.95
  			},
  			"curve-dao-token": {
  				"usd": 2.25
  			},
  			"pancakeswap-token": {
  				"usd": 6.33
  			},
  			"solana": {
  				"usd": 91.57
  			},
  			"osmosis": {
  				"usd": 9.22
  			},
  			"raydium": {
  				"usd": 2.84
  			},
  			"truefi": {
  				"usd": 0.204055
  			},
  			"quick": {
  				"usd": 242.91
  			}
  		}
  	},
  	"bsc": {
  		"pancakeswap": {
  			"busdBnb": {
  				"bnbPrice": "395.34926101",
  				"busdPrice": "0.99986227",
  				"busdBnbLpTokenPrice": 50.030962201121454,
  				"poolDailyRewardRate": 0.0010556820235217191,
  				"poolAPR": 0.048751821350961
  			},
  			"cakeBnb": {
  				"bnbPrice": "395.34926101",
  				"cakePrice": "6.33644532",
  				"cakeBnbLpTokenPrice": 104.3712256165025,
  				"poolCakeRewardsPerBlock": "0.9504461156455311212",
  				"poolDailyRewardRate": 0.01325142865251303,
  				"poolAPR": 0.2936435563440163
  			}
  		}
  	},
  	"solana": {
  		"raydium": {
  			"raySol": {
  				"name": "RAY-SOL",
  				"pair_id": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R-So11111111111111111111111111111111111111112",
  				"lp_mint": "89ZKE4aoyfLBe2RuV6jM3JGNhaV18Nxh8eNtjRcndBip",
  				"official": true,
  				"liquidity": 47628843.91759294,
  				"market": "C6tp2RVZnxBPFbnAsfTjis8BN9tycESAT4SgDQgbbrsA",
  				"volume_24h": 4232861.115898423,
  				"volume_24h_quote": 46305.65287834301,
  				"fee_24h": 10582.152789746058,
  				"fee_24h_quote": 115.76413219585753,
  				"volume_7d": 17024718.743694533,
  				"volume_7d_quote": 196234.88923777288,
  				"fee_7d": 42561.79685923633,
  				"fee_7d_quote": 490.58722309443215,
  				"price": 0.031004842794267146,
  				"lp_price": 11.045719944572184,
  				"amm_id": "AVs9TA4nWDzfPJE9gGVNJMVhcQy3V9PGazuz33BfG2RA",
  				"token_amount_coin": 8402724.845257,
  				"token_amount_pc": 260525.162870676,
  				"token_amount_lp": 4311972.796395,
  				"apy": 4.66,
  				"aprChain": 0,
  				"dailyRewardRate": 0,
  				"aprChainPercent": "0.00%"
  			},
  			"rayUsdt": {
  				"name": "RAY-USDT",
  				"pair_id": "4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R-Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB",
  				"lp_mint": "C3sT1R3nsw4AVdepvLTLKr5Gvszr7jufyBWUCvy4TUvT",
  				"official": true,
  				"liquidity": 34479157.384605885,
  				"market": "teE55QrL4a4QSfydR9dnHF97jgCfptpuigbb53Lo95g",
  				"volume_24h": 3529293.8110503806,
  				"volume_24h_quote": 3527944.1935350006,
  				"fee_24h": 8823.234527625951,
  				"fee_24h_quote": 8819.860483837501,
  				"volume_7d": 15580887.060363784,
  				"volume_7d_quote": 15572989.041290008,
  				"fee_7d": 38952.217650909464,
  				"fee_7d_quote": 38932.472603225026,
  				"price": 2.8382840041501747,
  				"lp_price": 10.095787793262229,
  				"amm_id": "DVa7Qmb5ct9RCpaU7UTpSaf3GVMYz17vNVU67XpdCRut",
  				"token_amount_coin": 6069075.023521,
  				"token_amount_pc": 17225758.559247,
  				"token_amount_lp": 3415202.269566,
  				"apy": 5.89,
  				"aprChain": 0,
  				"dailyRewardRate": 0,
  				"aprChainPercent": "0.00%"
  			}
  		}
  	},
  	"osmosis": {
  		"osmoStakingDailyRewardRate": 0.0018167999604112816,
  		"osmoStakingRewardsApr": 0.6631319855501178,
  		"osmoStakingRewardsAprPercent": "66.31%",
  		"atomOsmoLpTokenDailyRewardRate": 0.00019669066774971998,
  		"atomOsmoLpTokenPrice": 1.21115128609476,
  		"atomOsmoLpTokenReward14DaysBondedApr": 0.546523883331239,
  		"atomOsmoLpTokenReward14DaysBondedAprPercent": "54.65%"
  	},
  	"eth": {
  		"uniswap": {
  			"ethUsdt": {
  				"ethPrice": "2926.20369898",
  				"usdtPrice": "1.00049997",
  				"ethUsdtLpTokenPrice": 213403372.20597386
  			}
  		},
  		"sushiswap": {
  			"ethTru": {
  				"sushiRewardPerDay": 10.85974500782438,
  				"truRewardPerDay": "10108.200384",
  				"sushiDailyRewardRate": 16.752991390115408,
  				"truDailyRewardRate": 15593.60683705768,
  				"sushiAPR": 0.0035722683249048573,
  				"truAPR": 0.20560401371775158,
  				"truEthLpTokenPrice": 5648785.671757019
  			}
  		},
  		"aave": {
  			"usdtAave": {
  				"dailyRewardRate": 0.00008553852721722717,
  				"lendingAPR": 0.031221562434287916,
  				"stableBorrowRate": "11.9448481524747637816",
  				"variedBorrowRate": "3.8896963049495275632"
  			}
  		},
  		"curve": {
  			"threePool": {
  				"curveMintedPerSecond": "7.32785344785753067",
  				"threePoolReward": "0.07274203909781714452",
  				"crvPrice": "2.2502558",
  				"lpTokenPrice": "1.02059746106768475736",
  				"dailyRewardRate": 0.000009360900388337886,
  				"apr": 0.00753248928904856
  			}
  		}
  	},
  	"poly": {
  		"polygonData": {
  			"quickEth": {
  				"ethPrice": "2926.5621",
  				"quickPrice": "242.92045808",
  				"quickEthLpTokenPrice": "2585.10428203604950893814",
  				"dailyRewardRate": 0.0037698440327634244,
  				"apr": 0.12929554889995523
  			},
  			"ethUsdc": {
  				"ethPrice": "2926.5621",
  				"usdcPrice": "0.999844",
  				"ethUsdcLpTokenPrice": "165320310.8187259860463845708",
  				"dailyRewardRate": 91.00115220416814,
  				"apr": 0.04880439533981856
  			}
  		}
  	},
  	"terra": {
  		"anchor": {
  			"APY": 0.19491848289734126
  		}
  	}
  }
`);
