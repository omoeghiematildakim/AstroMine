import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'mining-simulation': {
      functions: {
        'register-asteroid': vi.fn(),
        'start-mining-operation': vi.fn(),
        'simulate-mining': vi.fn(),
        'get-asteroid': vi.fn(),
        'get-mining-operation': vi.fn(),
      },
    },
  },
  globals: {
    'tx-sender': 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
    'block-height': 123456,
  },
}

function callContract(contractName: string, functionName: string, args: any[]) {
  return mockClarity.contracts[contractName].functions[functionName](...args)
}

describe('Mining Simulation Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('register-asteroid', () => {
    it('should register an asteroid successfully', async () => {
      const name = 'Ceres'
      const size = 1000
      const resourceRichness = 80
      const miningDifficulty = 50
      mockClarity.contracts['mining-simulation'].functions['register-asteroid'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('mining-simulation', 'register-asteroid', [name, size, resourceRichness, miningDifficulty])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
  })
  
  describe('start-mining-operation', () => {
    it('should start a mining operation successfully', async () => {
      const asteroidId = 1
      const durationDays = 30
      mockClarity.contracts['mining-simulation'].functions['start-mining-operation'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('mining-simulation', 'start-mining-operation', [asteroidId, durationDays])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
    
    it('should fail when asteroid does not exist', async () => {
      const asteroidId = 999
      const durationDays = 30
      mockClarity.contracts['mining-simulation'].functions['start-mining-operation'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('mining-simulation', 'start-mining-operation', [asteroidId, durationDays])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('simulate-mining', () => {
    it('should simulate mining successfully', async () => {
      const operationId = 1
      mockClarity.contracts['mining-simulation'].functions['simulate-mining'].mockReturnValue({ success: true })
      
      const result = await callContract('mining-simulation', 'simulate-mining', [operationId])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when operation does not exist', async () => {
      const operationId = 999
      mockClarity.contracts['mining-simulation'].functions['simulate-mining'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('mining-simulation', 'simulate-mining', [operationId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
    
    it('should fail when caller is not the operator', async () => {
      const operationId = 1
      mockClarity.contracts['mining-simulation'].functions['simulate-mining'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('mining-simulation', 'simulate-mining', [operationId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
    
    it('should fail when operation has ended', async () => {
      const operationId = 1
      mockClarity.contracts['mining-simulation'].functions['simulate-mining'].mockReturnValue({ success: false, error: 400 })
      
      const result = await callContract('mining-simulation', 'simulate-mining', [operationId])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(400)
    })
  })
  
  describe('get-asteroid', () => {
    it('should return asteroid details', async () => {
      const asteroidId = 1
      const expectedAsteroid = {
        name: 'Ceres',
        size: 1000,
        resource_richness: 80,
        mining_difficulty: 50
      }
      mockClarity.contracts['mining-simulation'].functions['get-asteroid'].mockReturnValue(expectedAsteroid)
      
      const result = await callContract('mining-simulation', 'get-asteroid', [asteroidId])
      
      expect(result).toEqual(expectedAsteroid)
    })
    
    it('should return null for non-existent asteroid', async () => {
      const asteroidId = 999
      mockClarity.contracts['mining-simulation'].functions['get-asteroid'].mockReturnValue(null)
      
      const result = await callContract('mining-simulation', 'get-asteroid', [asteroidId])
      
      expect(result).toBeNull()
    })
  })
  
  describe('get-mining-operation', () => {
    it('should return mining operation details', async () => {
      const operationId = 1
      const expectedOperation = {
        asteroid_id: 1,
        operator: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        start_block: 123456,
        end_block: 127296,
        resources_extracted: 1000
      }
      mockClarity.contracts['mining-simulation'].functions['get-mining-operation'].mockReturnValue(expectedOperation)
      
      const result = await callContract('mining-simulation', 'get-mining-operation', [operationId])
      
      expect(result).toEqual(expectedOperation)
    })
    
    it('should return null for non-existent operation', async () => {
      const operationId = 999
      mockClarity.contracts['mining-simulation'].functions['get-mining-operation'].mockReturnValue(null)
      
      const result = await callContract('mining-simulation', 'get-mining-operation', [operationId])
      
      expect(result).toBeNull()
    })
  })
})

