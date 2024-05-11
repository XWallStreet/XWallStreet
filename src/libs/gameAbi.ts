export const GameAbi = [
    {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "target",
                "type": "address"
            }
        ],
        "name": "AddressEmptyCode",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "AddressInsufficientBalance",
        "type": "error"
    },
    {
        "inputs": [],
        "name": "FailedInnerCall",
        "type": "error"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "token",
                "type": "address"
            }
        ],
        "name": "SafeERC20FailedOperation",
        "type": "error"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "EarningClaimed",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            }
        ],
        "name": "FactoryCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            }
        ],
        "name": "FactoryUpgraded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "invitedBy",
                "type": "uint256"
            }
        ],
        "name": "PlayerCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "invitor",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "inviteCode",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "reward",
                "type": "uint256"
            }
        ],
        "name": "RewardReceived",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "workerId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            }
        ],
        "name": "WorkerCreated",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "workerId",
                "type": "uint256"
            },
            {
                "indexed": true,
                "internalType": "uint256",
                "name": "level",
                "type": "uint256"
            }
        ],
        "name": "WorkerUpgraded",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "claim",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "inviteCode",
                "type": "uint256"
            }
        ],
        "name": "createPlayer",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "avatar",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "level",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "speed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fullPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "upgradedPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fullReward",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "upgradedReward",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rewardDuration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "featureFlag",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct WorkerLevelInfo",
                "name": "aimedLevelInfo",
                "type": "tuple"
            },
            {
                "internalType": "bytes32[]",
                "name": "proof",
                "type": "bytes32[]"
            }
        ],
        "name": "createWorker",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gameDataRoot",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "gameToken",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            }
        ],
        "name": "getFactoryInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "updatedTs",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "level",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "speed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minWorkerLevel",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FactoryInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "player",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "desiredTimestamp",
                "type": "uint256"
            }
        ],
        "name": "getGameInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "updatedTs",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "material",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalMaterial",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "reward",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rewardDeadlineTs",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalReward",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "earnings",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalEarnings",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalWorkerSpeed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "totalFactorySpeed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "invitedBy",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "inviteCode",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256[]",
                        "name": "workerIds",
                        "type": "uint256[]"
                    }
                ],
                "internalType": "struct PlayerInfo",
                "name": "playerInfo",
                "type": "tuple"
            },
            {
                "internalType": "uint256",
                "name": "boosterSpeed",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "workerId",
                "type": "uint256"
            }
        ],
        "name": "getWorkerInfo",
        "outputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "updatedTs",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "level",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "speed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "avatar",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct WorkerInfo",
                "name": "",
                "type": "tuple"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "workerId",
                "type": "uint256"
            }
        ],
        "name": "ownerOfWorker",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "payee",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "level",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "speed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "upgradedPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "upgradedReward",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rewardDuration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "minWorkerLevel",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct FactoryLevelInfo",
                "name": "aimedLevelInfo",
                "type": "tuple"
            },
            {
                "internalType": "bytes32[]",
                "name": "proof",
                "type": "bytes32[]"
            }
        ],
        "name": "upgradeFactory",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "workerId",
                "type": "uint256"
            },
            {
                "components": [
                    {
                        "internalType": "uint256",
                        "name": "level",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "speed",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fullPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "upgradedPrice",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "fullReward",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "upgradedReward",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "rewardDuration",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "featureFlag",
                        "type": "uint256"
                    }
                ],
                "internalType": "struct WorkerLevelInfo",
                "name": "aimedLevelInfo",
                "type": "tuple"
            },
            {
                "internalType": "bytes32[]",
                "name": "proof",
                "type": "bytes32[]"
            }
        ],
        "name": "upgradeWorker",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    }
]