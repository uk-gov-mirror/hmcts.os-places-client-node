import { Header } from '../src/header'

describe('header', () => {

  test('should return false for next page with 1 page of results [offset=0, maxresults=10, totalresults=1]', () => {
      const header: Header = new Header(
        '', '', 0, 1, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(false)
    }
  )

  test('should return false for next page with 1 page of results [offset=0, maxresults=10, totalresults=5]', () => {
      const header: Header = new Header(
        '', '', 0, 5, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(false)
    }
  )

  test('should return false for next page with 1 page of results [offset=0, maxresults=10, totalresults=10]', () => {
      const header: Header = new Header(
        '', '', 0, 10, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(false)
    }
  )

  test('should return true for next page when on 1st page and 2 pages of results [offset=0, maxresults=10, totalresults=11]', () => {
      const header: Header = new Header(
        '', '', 0, 11, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(true)
    }
  )

  test('should return false for next page when on 2nd page and 2 pages of results [offset=1, maxresults=10, totalresults=11]', () => {
      const header: Header = new Header(
        '', '', 10, 11, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(false)
    }
  )

  test('should return true for next page when on 1st page and 2 pages of results [offset=0, maxresults=10, totalresults=20]', () => {
      const header: Header = new Header(
        '', '', 0, 11, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(true)
    }
  )

  test('should return false for next page when on 2nd page and 2 pages of results [offset=1, maxresults=10, totalresults=20]', () => {
      const header: Header = new Header(
        '', '', 10, 11, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(false)
    }
  )

  test('should return true for next page when on 10th page and 10 pages of results [offset=90, maxresults=10, totalresults=100]', () => {
      const header: Header = new Header(
        '', '', 90, 100, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(false)
    }
  )

  test('should return true for next page when on 9th page and 10 pages of results [offset=80, maxresults=10, totalresults=100]', () => {
      const header: Header = new Header(
        '', '', 70, 100, '', '', 0, 10, '', ''
      )
      expect(header.hasNextPage()).toEqual(true)
    }
  )

})
