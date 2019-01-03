import { Address } from './address'

export class PostcodeInfoResponse {

  constructor (public readonly valid: boolean,
               public readonly addresses?: Address[]) {
  }
}
