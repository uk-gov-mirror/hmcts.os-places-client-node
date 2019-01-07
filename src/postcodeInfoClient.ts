import * as requestDefault from 'request'
import * as requestPromise from 'request-promise-native'
import { Address } from './address'
import { Header } from './header'
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

    const uri = `${this.apiUrl}/places/v1/addresses/postcode?offset=0&key=${this.apiToken}&postcode=${postcode}`
    return this.getResponse(uri, new PostcodeInfoResponse(999, false))
  }

  private getResponse (uri: string, postcodeInfoResponse: PostcodeInfoResponse): Promise<any> {
    return this.request.get({
      json: false,
      resolveWithFullResponse: true,
      simple: false,
      uri: `${uri}`
    }).then((response) => {

      if (response.statusCode >= 500) {
        throw new Error('Error with postcode service')
      } else if (response.statusCode === 404) {
        return new PostcodeInfoResponse(404, false)
      } else if (response.statusCode === 401) {
        throw new Error('Authentication failed')
      }

      const postcodeQueryBody = JSON.parse(response.body)
      const header: Header = new Header(
        postcodeQueryBody.header.uri,
        postcodeQueryBody.header.query,
        postcodeQueryBody.header.offset,
        postcodeQueryBody.header.totalresults,
        postcodeQueryBody.header.format,
        postcodeQueryBody.header.dataset,
        postcodeQueryBody.header.lr,
        postcodeQueryBody.header.maxresults,
        postcodeQueryBody.header.epoch,
        postcodeQueryBody.header.output_srs
      )

      if (postcodeInfoResponse.statusCode === 999) {
        postcodeInfoResponse = new PostcodeInfoResponse(response.statusCode, response.statusCode === 200)
      }

      postcodeInfoResponse.addAll(
        postcodeQueryBody.results.map((jsonAddress: any) => {
            return new Address(
              jsonAddress.DPA.UPRN,                             // 1
              jsonAddress.DPA.ORGANISATION_NAME,                // 0..1
              jsonAddress.DPA.DEPARTMENT_NAME,                  // 0..1
              jsonAddress.DPA.PO_BOX_NUMBER,                    // 0..1
              jsonAddress.DPA.BUILDING_NAME,                    // 0..1
              jsonAddress.DPA.SUB_BUILDING_NAME,                // 0..1
              jsonAddress.DPA.BUILDING_NUMBER,                  // 0..1
              jsonAddress.DPA.THOROUGHFARE_NAME,                // 0..1
              jsonAddress.DPA.DEPENDENT_THOROUGHFARE_NAME,      // 0..1
              jsonAddress.DPA.DEPENDENT_LOCALITY,               // 0..1
              jsonAddress.DPA.DOUBLE_DEPENDENT_LOCALITY,        // 0..1
              jsonAddress.DPA.POST_TOWN,                        // 1
              jsonAddress.DPA.POSTCODE,                         // 1
              jsonAddress.DPA.POSTAL_ADDRESS_CODE,              // 1
              jsonAddress.DPA.ADDRESS,                          // 1
              new Point('Point', [jsonAddress.DPA.X_COORDINATE, jsonAddress.DPA.Y_COORDINATE])
            )
          }
        )
      )

      if (header.hasNextPage()) {
        const next = header.uri.replace(/offset=\d+/, 'offset=' + header.getNextOffset())
        return this.getResponse(next, postcodeInfoResponse);
      }

      return postcodeInfoResponse;
    });
  }
}
