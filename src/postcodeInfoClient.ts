import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'
import { Address } from './address'
import { Point } from './point'
import { PostcodeInfoResponse } from './postcodeInfoResponse'

export class PostcodeInfoClient {
  constructor (private readonly apiToken: string,
               private readonly request: requestDefault.RequestAPI<requestPromise.RequestPromise,
                 requestPromise.RequestPromiseOptions,
                 requestDefault.RequiredUriUrl> = requestPromise,
               private readonly apiUrl: string = 'https://api.ordnancesurvey.co.uk') {
  }

  public lookupPostcode (postcode: string): Promise<PostcodeInfoResponse> {
    if (!postcode) {
      return Promise.reject(new Error('Missing required postcode'))
    }

    const postcodeQueryPromise = this.getUri(`/places/v1/addresses/postcode?key=${this.apiToken}&postcode=${postcode}`)

    return Promise.resolve(postcodeQueryPromise)
      .then((postcodeQuery) => {
        if (postcodeQuery.statusCode >= 500) {
          throw new Error('Error with postcode service')
        } else if (postcodeQuery.statusCode === 404) {
          return new PostcodeInfoResponse(false)
        } else if (postcodeQuery.statusCode === 401) {
          throw new Error('Authentication failed')
        }

        const postcodeQueryBody = JSON.parse(postcodeQuery.body)

        return new PostcodeInfoResponse(
          postcodeQuery.statusCode === 200,
          postcodeQueryBody.results.map((address: any) => {
              return new Address(
                address.DPA.UPRN,                             // 1
                address.DPA.ORGANISATION_NAME,                // 0..1
                address.DPA.DEPARTMENT_NAME,                  // 0..1
                address.DPA.PO_BOX_NUMBER,                    // 0..1
                address.DPA.BUILDING_NAME,                    // 0..1
                address.DPA.SUB_BUILDING_NAME,                // 0..1
                address.DPA.BUILDING_NUMBER,                  // 0..1
                address.DPA.THOROUGHFARE_NAME,                // 0..1
                address.DPA.DEPENDENT_THOROUGHFARE_NAME,      // 0..1
                address.DPA.DEPENDENT_LOCALITY,               // 0..1
                address.DPA.DOUBLE_DEPENDENT_LOCALITY,        // 0..1
                address.DPA.POST_TOWN,                        // 1
                address.DPA.POSTCODE,                         // 1
                address.DPA.POSTAL_ADDRESS_CODE,              // 1
                address.DPA.ADDRESS,                          // 1
                new Point('Point', [address.DPA.X_COORDINATE, address.DPA.Y_COORDINATE])
              )
            }
          )
        )
      })
  }

  private getUri (path: string): Promise<any> {
    return this.request.get({
      json: false,
      resolveWithFullResponse: true,
      simple: false,
      uri: `${this.apiUrl}${path}`
    })
  }

}
