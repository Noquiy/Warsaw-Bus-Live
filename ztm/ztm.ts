import { Session } from './session';
import { ZtmRide, ZtmSchedule, ZtmVehicle, GeoLocation } from './models';
import axios from 'axios'

export class ZtmSession extends Session{
  location_endpoint: string
  schedule_endpoint: string

  constructor(apiKey: string){
    super(apiKey)
    this.location_endpoint = 'https://api.um.warszawa.pl/api/action/busestrams_get'
    this.schedule_endpoint = 'https://api.um.warszawa.pl/api/action/dbtimetable_get'
  }

  parse_vehicle_location_data(record: Record<string, string>, vehicle_type: number) : ZtmVehicle{
    return new ZtmVehicle(
      new GeoLocation(parseFloat(record['Lon']), parseFloat(record['Lat'])),
      record['Lines'],
      record['VehicleNumber'],
      new Date(record['Time']),
      record['Brigade'],
      vehicle_type    )
  }

  parse_multiple_vehicle_location_data(data: Record<string, string>[], vehicle_type:number) : ZtmVehicle[]{
    const vehicles: ZtmVehicle[] = []
    for (const record of data){
      vehicles.push(this.parse_vehicle_location_data(record, vehicle_type))
    }
    return vehicles
  }

  get_buses_location_url(line?: string) : string{
    const query_params: Record<string, string | number | null> = {
      "resource_id": 'f2e5503e-927d-4ad3-9500-4ab9e55deb59',
      "type": 1,
      "apikey": this.apiKey,
      "line": line ? line : null,
    }
    
    return `${this.location_endpoint}?${Object.keys(query_params).map(key => key + '=' + query_params[key]).join('&')}`
  }

  async get_data_from_ztm(url: string, query_params: Record<string, string | number | null>) : Promise<string>{
    const response = await axios.get(url, {
      params: {

        ...query_params
      }
    }).then((response) => {
      if (response.status !== 200){
        throw new Error('Invalid response')
      }
      console.log(response.data)
      return response.data
    })
  
    return typeof response === 'string' ? response : JSON.stringify(response);
  }

  async get_vehicle_location(vehicle_type:number, line: string | null) : Promise<ZtmVehicle[]>{
    const query_params: Record<string, string | number | null> = {
      "resource_id": 'f2e5503e-927d-4ad3-9500-4ab9e55deb59',
      "type": vehicle_type,
      "apikey": this.apiKey,
      "line": line ? line : null,
    }
    const response = await this.get_data_from_ztm(this.location_endpoint, query_params)
  
    const vehicles = this.parse_multiple_vehicle_location_data(JSON.parse(response)['result'], vehicle_type)
    return vehicles
  }

  get_buses_location(line?: string) : Promise<ZtmVehicle[]>{
    return this.get_vehicle_location(1, line ? line : null)
  }

  get_trams_location(line?: string) : Promise<ZtmVehicle[]>{
    return this.get_vehicle_location(2, line ? line : null)
  }
}