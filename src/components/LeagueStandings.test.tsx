import { expect, test } from 'vitest'
import { render } from '@testing-library/react'
import { getZoneForRank } from './LeagueStandings'
import LeagueStandings from './LeagueStandings'

test('renders LeagueStandings component', () => {
  expect(LeagueStandings).toBeDefined()
})

test('renders LeagueStandings component with leagues', () => {
  const leagues = [
    {
      name: 'PPL',
      standings: [],
      zones: []
    }
  ]
  const { container } = render(<LeagueStandings leagues={leagues} />)
  expect(container).toBeDefined()
})

test('getZoneForRank should return the correct zone for a given rank', () => {
  const zones = [
    { start: 1, end: 4, color: 'bg-green-50', label: 'Playoffs' },
    { start: -3, end: -1, color: 'bg-red-50', label: 'Relegation Zone' }
  ]
  const totalTeams = 20

  // Test playoff zone - first place
  const playoffZone = getZoneForRank(1, totalTeams, zones)
  expect(playoffZone).toBeDefined()
  expect(playoffZone?.label).toBe('Playoffs')

  // Test relegation zone - last place (rank 20)
  const relegationZoneLast = getZoneForRank(20, totalTeams, zones)
  expect(relegationZoneLast).toBeDefined()
  expect(relegationZoneLast?.label).toBe('Relegation Zone')
  expect(relegationZoneLast?.color).toBe('bg-red-50')

  // Test middle rank - should not be in any zone
  const middleRank = getZoneForRank(10, totalTeams, zones)
  expect(middleRank).toBeNull()
})

