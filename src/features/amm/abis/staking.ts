export default [
  {
    inputs: [
      { internalType: 'address', name: '_ucoToken', type: 'address' },
      { internalType: 'address', name: '_usdtToken', type: 'address' },
      { internalType: 'address', name: '_uniswapRouter', type: 'address' },
      { internalType: 'address', name: '_devloperAddress', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  { inputs: [{ internalType: 'address', name: 'owner', type: 'address' }], name: 'OwnableInvalidOwner', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
    name: 'OwnableUnauthorizedAccount',
    type: 'error'
  },
  { inputs: [], name: 'ReentrancyGuardReentrantCall', type: 'error' },
  {
    inputs: [{ internalType: 'address', name: 'token', type: 'address' }],
    name: 'SafeERC20FailedOperation',
    type: 'error'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'DividendClaimed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'user', type: 'address' },
      { indexed: false, internalType: 'uint256', name: 'pending', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'claimed', type: 'uint256' }
    ],
    name: 'DividendUpdated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: 'address', name: 'previousOwner', type: 'address' },
      { indexed: true, internalType: 'address', name: 'newOwner', type: 'address' }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      { indexed: false, internalType: 'uint256', name: 'amount', type: 'uint256' },
      { indexed: false, internalType: 'uint256', name: 'newDividendPerLp', type: 'uint256' }
    ],
    name: 'UsdtFeeReceived',
    type: 'event'
  },
  {
    inputs: [],
    name: 'BURN_ADDRESS',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'claimDividends', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: 'lpTokens', type: 'uint256' }],
    name: 'depositLPTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'devloperAddress',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'dividendPerLpToken',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'token', type: 'address' },
      { internalType: 'uint256', name: 'amount', type: 'uint256' }
    ],
    name: 'emergencyWithdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'lpAmount', type: 'uint256' }],
    name: 'estimatedUSDT',
    outputs: [{ internalType: 'uint256', name: 'usdtAmount', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'usdtInvested', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokens', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokensInit', type: 'uint256' }
    ],
    name: 'fixUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getPendingDividends',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'user', type: 'address' }],
    name: 'getUserInfo',
    outputs: [
      { internalType: 'uint256', name: '_totalDividends', type: 'uint256' },
      { internalType: 'uint256', name: '_totalLpTokensTracked', type: 'uint256' },
      { internalType: 'uint256', name: 'usdtInvested', type: 'uint256' },
      { internalType: 'uint256', name: 'usdtReturned', type: 'uint256' },
      { internalType: 'uint256', name: 'usdtEstimated', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokensInit', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokens', type: 'uint256' },
      { internalType: 'uint256', name: 'claimedDividends', type: 'uint256' },
      { internalType: 'uint256', name: 'pendingDividends', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'address', name: 'user', type: 'address' },
      { internalType: 'uint256', name: 'usdtInvested', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokens', type: 'uint256' }
    ],
    name: 'initUser',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
    name: 'receiveUsdtFee',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  { inputs: [], name: 'renounceOwnership', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'address', name: '_devloperAddress', type: 'address' }],
    name: 'setDeveloperAddress',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_ucoToken', type: 'address' }],
    name: 'setUCOToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '_usdtToken', type: 'address' }],
    name: 'setUSDToken',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'pair', type: 'address' }],
    name: 'setUniswapPair',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalClaimedDividends',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalDividends',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'totalLpTokensTracked',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'ucoToken',
    outputs: [{ internalType: 'contract IUCO', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'uniswapPair',
    outputs: [{ internalType: 'address', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'uniswapRouter',
    outputs: [{ internalType: 'contract IUniswapV2Router02', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'usdtToken',
    outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'users',
    outputs: [
      { internalType: 'uint256', name: 'usdtInvested', type: 'uint256' },
      { internalType: 'uint256', name: 'usdtReturned', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokensInit', type: 'uint256' },
      { internalType: 'uint256', name: 'lpTokens', type: 'uint256' },
      { internalType: 'uint256', name: 'claimedDividends', type: 'uint256' },
      { internalType: 'uint256', name: 'pendingDividends', type: 'uint256' },
      { internalType: 'uint256', name: 'lastDividendPerLpToken', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  { inputs: [], name: 'withdrawInitLPTokens', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ internalType: 'uint256', name: 'lpTokens', type: 'uint256' }],
    name: 'withdrawLPTokens',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
] as const
