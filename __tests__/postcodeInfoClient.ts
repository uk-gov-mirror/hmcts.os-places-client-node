import * as fs from 'fs'
import * as nock from 'nock'
import * as path from 'path'
import * as request from 'request-promise-native'
import { PostcodeInfoClient } from '../src'

const mockPostcode = 'http://localhost'
const postcodeInfoClient: PostcodeInfoClient = new PostcodeInfoClient('APIKEY', request, mockPostcode)

describe('postcodeInfoClient', () => {
  test('should return valid false if no postcode found', () => {
      nock(mockPostcode)
        .get(/\/places\/v1\/addresses\/postcode\?offset=.+&key=.+&postcode=.+/)
        .reply(404, [])

      return postcodeInfoClient
        .lookupPostcode('XXXX')
        .then(postcodeResponse => {
          expect(postcodeResponse).toEqual({ addresses: [], statusCode: 404, valid: false })
        })
    }
  )

  test('should return found postcodes', () => {
      nock(mockPostcode)
        .get(/\/places\/v1\/addresses\/postcode\?offset=0&key=.+&postcode=.+/)
        .reply(200, fs.readFileSync(path.join(__dirname, 'mockPostcodeLookupResponsePage1.json')))
      nock(mockPostcode)
        .get(/\/places\/v1\/addresses\/postcode\?offset=1&key=.+&postcode=.+/)
        .reply(200, fs.readFileSync(path.join(__dirname, 'mockPostcodeLookupResponsePage2.json')))
      nock(mockPostcode)
        .get(/\/places\/v1\/addresses\/postcode\?offset=2&key=.+&postcode=.+/)
        .reply(200, fs.readFileSync(path.join(__dirname, 'mockPostcodeLookupResponsePage3.json')))

      return postcodeInfoClient.lookupPostcode('1234')
        .then(postcodeResponse => {
          expect(postcodeResponse).toEqual(
            {
              addresses: [
                {
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
                },
                {
                  buildingName: undefined,
                  buildingNumber: '2',
                  departmentName: undefined,
                  dependentLocality: '',
                  dependentThoroughfareName: undefined,
                  doubleDependentLocality: undefined,
                  formattedAddress: '2, THE ROAD, THE TOWN, 1234',
                  organisationName: undefined,
                  poBoxNumber: undefined,
                  point: { 'coordinates': [492237, 181505], 'type': 'Point' },
                  postTown: 'THE TOWN',
                  postcode: '1234',
                  postcodeType: 'D',
                  subBuildingName: undefined,
                  thoroughfareName: 'THE ROAD',
                  uprn: '100080489735'
                },
                {
                  buildingName: undefined,
                  buildingNumber: '3',
                  departmentName: undefined,
                  dependentLocality: '',
                  dependentThoroughfareName: undefined,
                  doubleDependentLocality: undefined,
                  formattedAddress: '3, THE ROAD, THE TOWN, 1234',
                  organisationName: undefined,
                  poBoxNumber: undefined,
                  point: { 'coordinates': [492237, 181505], 'type': 'Point' },
                  postTown: 'THE TOWN',
                  postcode: '1234',
                  postcodeType: 'D',
                  subBuildingName: undefined,
                  thoroughfareName: 'THE ROAD',
                  uprn: '100080489735'
                }
              ],
              statusCode: 200,
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
