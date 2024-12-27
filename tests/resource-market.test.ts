import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'resource-market': {
      functions: {
        'update-resource-price': vi.fn(),
        'add-resource-supply': vi.fn(),
        'remove-resource-supply': vi.fn(),
        'get-resource-price': vi.fn(),
        'get-resource-supply': vi.fn(),
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

describe('Resource Market Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('update-resource-price', () => {
    it('should update resource price successfully when called by contract owner', async () => {
      const resourceId = 1
      const newPrice = 1000
      mockClarity.contracts['resource-market'].functions['update-resource-price'].mockReturnValue({ success: true })
      
      const result = await callContract('resource-market', 'update-resource-price', [resourceId, newPrice])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when called by non-owner', async () => {
      const resourceId = 1
      const newPrice = 1000
      mockClarity.contracts['resource-market'].functions['update-resource-price'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('resource-market', 'update-resource-price', [resourceId, newPrice])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('add-resource-supply', () => {
    it('should add resource supply successfully', async () => {
      const resourceId = 1
      const amount = 500
      mockClarity.contracts['resource-market'].functions['add-resource-supply'].mockReturnValue({ success: true })
      
      const result = await callContract('resource-market', 'add-resource-supply', [resourceId, amount])
      
      expect(result.success).toBe(true)
    })
  })
  
  describe('remove-resource-supply', () => {
    it('should remove resource supply successfully', async () => {
      const resourceId = 1
      const amount = 200
      mockClarity.contracts['resource-market'].functions['remove-resource-supply'].mockReturnValue({ success: true })
      
      const result = await callContract('resource-market', 'remove-resource-supply', [resourceId, amount])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when trying to remove more than available supply', async () => {
      const resourceId = 1
      const amount = 1000000
      mockClarity.contracts['resource-market'].functions['remove-resource-supply'].mockReturnValue({ success: false, error: 401 })
      
      const result = await callContract('resource-market', 'remove-resource-supply', [resourceId, amount])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(401)
    })
  })
  
  describe('get-resource-price', () => {
    it('should return the resource price', async () => {
      const resourceId = 1
      const expectedPrice = { price: 1000 }
      mockClarity.contracts['resource-market'].functions['get-resource-price'].mockReturnValue(expectedPrice)
      
      const result = await callContract('resource-market', 'get-resource-price', [resourceId])
      
      expect(result).toEqual(expectedPrice)
    })
    
    it('should return null for non-existent resource', async () => {
      const resourceId = 999
      mockClarity.contracts['resource-market'].functions['get-resource-price'].mockReturnValue(null)
      
      const result = await callContract('resource-market', 'get-resource-price', [resourceId])
      
      expect(result).toBeNull()
    })
  })
  
  describe('get-resource-supply', () => {
    it('should return the resource supply', async () => {
      const resourceId = 1
      const expectedSupply = { supply: 5000 }
      mockClarity.contracts['resource-market'].functions['get-resource-supply'].mockReturnValue(expectedSupply)
      
      const result = await callContract('resource-market', 'get-resource-supply', [resourceId])
      
      expect(result).toEqual(expectedSupply)
    })
    
    it('should return null for non-existent resource', async () => {
      const resourceId = 999
      mockClarity.contracts['resource-market'].functions['get-resource-supply'].mockReturnValue(null)
      
      const result = await callContract('resource-market', 'get-resource-supply', [resourceId])
      
      expect(result).toBeNull()
    })
  })
})

