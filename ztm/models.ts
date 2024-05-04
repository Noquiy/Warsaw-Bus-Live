export class GeoLocation {
  longitude: number
  latitude: number

  constructor(longitude: number, latitude: number) {
    this.longitude = longitude
    this.latitude = latitude
    
    if (this.longitude < -180 || this.longitude > 180) {
      throw new Error('Invalid longitude')
    }
    if (this.latitude < -90 || this.latitude > 90) {
      throw new Error('Invalid latitude')
    }
  }

    isEqual (other: Object): boolean {
      if (!(other instanceof GeoLocation)) {
        throw new Error('Can only compare with other GeoLocation objects')
      }
      return this.longitude === other.longitude && this.latitude === other.latitude
    }
}

export class ZtmVehicle{
  location: GeoLocation
  line: string
  vehicle_number: string
  time: Date
  brigade: string
  type: number

  constructor(location: GeoLocation, line: string, vehicle_number: string, time: Date, brigade: string, type: number) {
    this.location = location
    this.line = line
    this.vehicle_number = vehicle_number
    this.time = time
    this.brigade = brigade
    this.type = type
  }

  toString(): string {
    return `A ZTM Vehicle:  ${this.type} ${this.line} ${this.vehicle_number} at ${this.location.longitude}, ${this.location.latitude} at ${this.time.toISOString()}`
  }
}

export class ZtmRide{
  brigade: string
  direction: string
  route: string
  time: Date

  constructor(brigade: string, direction: string, route: string, time: Date) {
    this.brigade = brigade
    this.direction = direction
    this.route = route
    this.time = time
  }

  isEqual(other: Object): boolean {
    if (!(other instanceof ZtmRide)) {
      throw new Error('Can only compare with other ZtmRide objects')
    }
    return this.brigade === other.brigade && this.direction === other.direction && this.route === other.route && this.time === other.time
  }
}

export class ZtmSchedule{
  line: string
  bus_stop_id: number
  bus_stop_nr: number
  rides: ZtmRide[]

  constructor(line: string, bus_stop_id: number, bus_stop_nr: number, rides: ZtmRide[]) {
    this.line = line
    this.bus_stop_id = bus_stop_id
    this.bus_stop_nr = bus_stop_nr
    this.rides = rides
  }

  isEqual(other: Object): boolean {
    if (!(other instanceof ZtmSchedule)) {
      throw new Error('Can only compare with other ZtmSchedule objects')
    }
    return this.line === other.line && this.bus_stop_id === other.bus_stop_id && this.bus_stop_nr === other.bus_stop_nr && this.rides === other.rides
  }
}