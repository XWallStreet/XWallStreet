export const SwapAbi = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_rate",
				"type": "uint256"
			}
		],
		"name": "setExchangeRate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "swap",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_tokenAddress",
				"type": "address"
			},
			{
				"internalType": "uint256",
				"name": "_rate",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "from",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "ethAmount",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			}
		],
		"name": "SwapCompleted",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "withdrawETH",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	}
]