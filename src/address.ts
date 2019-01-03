import { Point } from './point'

export class Address {
  constructor (public readonly uprn: string,
               public readonly organisationName: string,
               public readonly departmentName: string,
               public readonly poBoxNumber: string,
               public readonly buildingName: string,
               public readonly subBuildingName: string,
               public readonly buildingNumber: number,
               public readonly thoroughfareName: string,
               public readonly dependentThoroughfareName: string,
               public readonly dependentLocality: string,
               public readonly doubleDependentLocality: string,
               public readonly postTown: string,
               public readonly postcode: string,
               public readonly postcodeType: string,
               public readonly formattedAddress: string,
               public readonly point: Point) {
  }
}
