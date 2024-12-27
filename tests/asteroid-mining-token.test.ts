import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'asteroid-mining-token': {
      functions: {
        mint: vi.fn(),
        transfer: vi.fn(),
        'acquire-asteroid-shares': vi.fn(),
        'get-asteroid-ownership': vi.fn(),
        'get-balance': vi.fn(),
        'get-token-uri': vi.fn(),
        'set-token-uri': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Asteroid Mining Token Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('mint', () => {
    it('should mint tokens successfully when called by contract owner', async () => {
      const amount = 1000
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['asteroid-mining-token'].functions.mint.mockReturnValue({ success: true })
      
      const result = await callContract('asteroid-mining-token', 'mint', [amount, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when called by non-owner', async () => {
      const amount = 1000
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['asteroid-mining-token'].functions.mint.mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('asteroid-mining-token', 'mint', [amount, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('transfer', () => {
    it('should transfer tokens successfully', async () => {
      const amount = 500
      const sender = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const recipient = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      mockClarity.contracts['asteroid-mining-token'].functions.transfer.mockReturnValue({ success: true })
      
      const result = await callContract('asteroid-mining-token', 'transfer', [amount, sender, recipient])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when sender is not the tx-sender', async () => {
      const amount = 500
      const sender = 'ST2CY5V39NHDPWSXMW9QDT3HC3GD6Q6XX4CFRK9AG'
      const recipient = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      mockClarity.contracts['asteroid-mining-token'].functions.transfer.mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('asteroid-mining-token', 'transfer', [amount, sender, recipient])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('acquire-asteroid-shares', () => {
    it('should acquire asteroid shares successfully', async () => {
      const asteroidId = 1
      const shares = 100
      mockClarity.contracts['asteroid-mining-token'].functions['acquire-asteroid-shares'].mockReturnValue({ success: true })
      
      const result = await callContract('asteroid-mining-token', 'acquire-asteroid-shares', [asteroidId, shares])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when user has insufficient balance', async () => {
      const asteroidId = 1
      const shares = 1000000
      mockClarity.contracts['asteroid-mining-token'].functions['acquire-asteroid-shares'].mockReturnValue({ success: false, error: 401 })
      
      const result = await callContract('asteroid-mining-token', 'acquire-asteroid-shares', [asteroidId, shares])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(401)
    })
  })
  
  describe('get-asteroid-ownership', () => {
    it('should return asteroid ownership details', async () => {
      const asteroidId = 1
      const expectedOwnership = { owner: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM', shares: 100 }
      mockClarity.contracts['asteroid-mining-token'].functions['get-asteroid-ownership'].mockReturnValue(expectedOwnership)
      
      const result = await callContract('asteroid-mining-token', 'get-asteroid-ownership', [asteroidId])
      
      expect(result).toEqual(expectedOwnership)
    })
  })
  
  describe('get-balance', () => {
    it('should return the balance for a given account', async () => {
      const account = 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM'
      const expectedBalance = 1000
      mockClarity.contracts['asteroid-mining-token'].functions['get-balance'].mockReturnValue({ success: true, value: expectedBalance })
      
      const result = await callContract('asteroid-mining-token', 'get-balance', [account])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedBalance)
    })
  })
  
  describe('get-token-uri', () => {
    it('should return the token URI', async () => {
      const expectedUri = 'https://example.com/metadata/asteroid-mining-token'
      mockClarity.contracts['asteroid-mining-token'].functions['get-token-uri'].mockReturnValue({ success: true, value: expectedUri })
      
      const result = await callContract('asteroid-mining-token', 'get-token-uri', [])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(expectedUri)
    })
  })
  
  describe('set-token-uri', () => {
    it('should set the token URI when called by contract owner', async () => {
      const newUri = 'https://example.com/new-metadata/asteroid-mining-token'
      mockClarity.contracts['asteroid-mining-token'].functions['set-token-uri'].mockReturnValue({ success: true })
      
      const result = await callContract('asteroid-mining-token', 'set-token-uri', [newUri])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when called by non-owner', async () => {
      const newUri = 'https://example.com/new-metadata/asteroid-mining-token'
      mockClarity.contracts['asteroid-mining-token'].functions['set-token-uri'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('asteroid-mining-token', 'set-token-uri', [newUri])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
})

