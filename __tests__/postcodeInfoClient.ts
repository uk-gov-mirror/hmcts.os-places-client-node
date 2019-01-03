import * as fs from 'fs'
import * as nock from 'nock'
import * as path from 'path'
import * as request from 'request-promise-native'
import { PostcodeInfoClient } from '../src'

const mockPostcode = 'http://localhost'
const postcodeInfoClient: PostcodeInfoClient = new PostcodeInfoClient('1234', request, mockPostcode)

describe('postcodeInfoClient', () => {
  test('should return valid false if no postcode found', () => {
      nock(mockPostcode)
        .get(/\/places\/v1\/addresses\/postcode\?key=.+&postcode=.+/)
        .reply(404, [])

      return postcodeInfoClient
        .lookupPostcode('123')
        .then(postcodeResponse => {
          expect(postcodeResponse).toEqual({ valid: false })
        })
    }
  )

  test('should return found postcodes', () => {
      nock(mockPostcode)
        .get(/\/places\/v1\/addresses\/postcode\?key=.+&postcode=.+/)
        .reply(200, fs.readFileSync(path.join(__dirname, 'mockPostcodeLookupResponse.json')))

      return postcodeInfoClient.lookupPostcode('SN15NB')
        .then(postcodeResponse => {
          expect(postcodeResponse).toEqual(
            {
              addresses: [{
                buildingName: undefined,
                buildingNumber: '1',
                departmentName: undefined,
                dependentLocality: '',
                dependentThoroughfareName: undefined,
                doubleDependentLocality: undefined,
                formattedAddress: '1, THE ROAD, THE TOWN, 1234',
                organisationName: undefined,
                poBoxNumber: undefined,
                point: { 'coordinates': [492237, 181505], 'type': 'Point' },
                postTown: 'THE TOWN',
                postcode: '1234',
                postcodeType: 'D',
                subBuildingName: undefined,
                thoroughfareName: 'THE ROAD',
                uprn: '100080489735'
              }],
              valid: true
            }
          )
        })
    }
  )

  test('should reject promise if no postcode', () =>
    expect(postcodeInfoClient.lookupPostcode('')).rejects.toEqual(new Error('Missing required postcode'))
  )
})
