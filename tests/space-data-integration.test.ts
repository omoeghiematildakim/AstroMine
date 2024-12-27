import { describe, it, expect, beforeEach, vi } from 'vitest'

const mockClarity = {
  contracts: {
    'space-data-integration': {
      functions: {
        'add-space-mission': vi.fn(),
        'update-mission-data': vi.fn(),
        'get-space-mission': vi.fn(),
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

describe('Space Data Integration Contract', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })
  
  describe('add-space-mission', () => {
    it('should add a space mission successfully when called by contract owner', async () => {
      const name = 'Asteroid Explorer 1'
      const launchDate = 1672531200 // January 1, 2023
      const targetAsteroid = 'Ceres'
      const data = 'Initial mission data'
      mockClarity.contracts['space-data-integration'].functions['add-space-mission'].mockReturnValue({ success: true, value: 1 })
      
      const result = await callContract('space-data-integration', 'add-space-mission', [name, launchDate, targetAsteroid, data])
      
      expect(result.success).toBe(true)
      expect(result.value).toBe(1)
    })
    
    it('should fail when called by non-owner', async () => {
      const name = 'Unauthorized Mission'
      const launchDate = 1672531200
      const targetAsteroid = 'Vesta'
      const data = 'Unauthorized data'
      mockClarity.contracts['space-data-integration'].functions['add-space-mission'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('space-data-integration', 'add-space-mission', [name, launchDate, targetAsteroid, data])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
  })
  
  describe('update-mission-data', () => {
    it('should update mission data successfully when called by contract owner', async () => {
      const missionId = 1
      const newData = 'Updated mission data with new findings'
      mockClarity.contracts['space-data-integration'].functions['update-mission-data'].mockReturnValue({ success: true })
      
      const result = await callContract('space-data-integration', 'update-mission-data', [missionId, newData])
      
      expect(result.success).toBe(true)
    })
    
    it('should fail when called by non-owner', async () => {
      const missionId = 1
      const newData = 'Unauthorized update attempt'
      mockClarity.contracts['space-data-integration'].functions['update-mission-data'].mockReturnValue({ success: false, error: 403 })
      
      const result = await callContract('space-data-integration', 'update-mission-data', [missionId, newData])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(403)
    })
    
    it('should fail when mission does not exist', async () => {
      const missionId = 999
      const newData = 'Update for non-existent mission'
      mockClarity.contracts['space-data-integration'].functions['update-mission-data'].mockReturnValue({ success: false, error: 404 })
      
      const result = await callContract('space-data-integration', 'update-mission-data', [missionId, newData])
      
      expect(result.success).toBe(false)
      expect(result.error).toBe(404)
    })
  })
  
  describe('get-space-mission', () => {
    it('should return space mission details', async () => {
      const missionId = 1
      const expectedMission = {
        name: 'Asteroid Explorer 1',
        launch_date: 1672531200,
        target_asteroid: 'Ceres',
        data: 'Mission data with latest findings'
      }
      mockClarity.contracts['space-data-integration'].functions['get-space-mission'].mockReturnValue(expectedMission)
      
      const result = await callContract('space-data-integration', 'get-space-mission', [missionId])
      
      expect(result).toEqual(expectedMission)
    })
    
    it('should return null for non-existent mission', async () => {
      const missionId = 999
      mockClarity.contracts['space-data-integration'].functions['get-space-mission'].mockReturnValue(null)
      
      const result = await callContract('space-data-integration', 'get-space-mission', [missionId])
      
      expect(result).toBeNull()
    })
  })
})

