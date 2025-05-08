// Define types for our data
export interface BusStop {
    id: string
    name: string
    location: [number, number] // [latitude, longitude]
    trafficFactor: number
  }
  
  export interface BusStopBasic {
    id: string
    name: string
  }
  
  export interface BusRoute {
    id: string
    name: string
    color: string
    frequency: string
    fare: number
    trafficFactor: number
    path: [number, number][] // Array of [latitude, longitude] coordinates
    stops: BusStopBasic[]
    type?: string
  }
  
  // Sample bus data for Marrakech
  export const busStops: BusStop[] = [
    { id: "GZ1", name: "Gueliz Center", location: [31.6295, -7.9811], trafficFactor: 0.9 },
    { id: "MV1", name: "Mohammed V Avenue", location: [31.628, -7.985], trafficFactor: 1.2 },
    { id: "MJ1", name: "Majorelle Garden", location: [31.627, -7.99], trafficFactor: 1.0 },
    { id: "BD1", name: "Bab Doukkala", location: [31.626, -7.995], trafficFactor: 1.1 },
    { id: "MC1", name: "Medina Center", location: [31.625, -8.0], trafficFactor: 1.3 },
    { id: "TS1", name: "Marrakech Train Station", location: [31.632, -7.978], trafficFactor: 1.2 },
    { id: "AM1", name: "Avenue Mohammed VI", location: [31.631, -7.98], trafficFactor: 1.0 },
    { id: "MM1", name: "Menara Mall", location: [31.63, -7.985], trafficFactor: 1.4 },
    { id: "RT1", name: "Royal Theater", location: [31.629, -7.99], trafficFactor: 0.9 },
    { id: "KM1", name: "Koutoubia Mosque", location: [31.628, -7.995], trafficFactor: 1.2 },
    { id: "JF1", name: "Jamaa el Fna Square", location: [31.627, -8.0], trafficFactor: 1.5 },
    { id: "AK1", name: "Avenue Abdelkrim El Khattabi", location: [31.635, -7.99], trafficFactor: 0.8 },
    { id: "MJ2", name: "Marjane Market", location: [31.64, -8.0], trafficFactor: 1.0 },
    { id: "HR1", name: "Hay Riad", location: [31.645, -8.01], trafficFactor: 0.7 },
    { id: "QT1", name: "Quartier Tamansourt", location: [31.65, -8.02], trafficFactor: 0.6 },
    { id: "GS1", name: "Grand Stade de Marrakech", location: [31.6667, -8.0303], trafficFactor: 0.5 },
    { id: "AP1", name: "Marrakech Menara Airport", location: [31.61, -8.03], trafficFactor: 0.8 },
    { id: "RC1", name: "Route de Casablanca", location: [31.62, -8.025], trafficFactor: 0.7 },
    { id: "AG1", name: "Agdal Gardens", location: [31.63, -8.02], trafficFactor: 0.6 },
    { id: "PR1", name: "Palmeraie Resort", location: [31.64, -8.015], trafficFactor: 0.5 },
    { id: "TR1", name: "Tramway Central", location: [31.6305, -7.975], trafficFactor: 1.0 },
    { id: "TR2", name: "Tramway Medina", location: [31.6255, -7.990], trafficFactor: 1.1 },
    { id: "TR3", name: "Tramway Agdal", location: [31.635, -8.01], trafficFactor: 0.9 },
    { id: "TR4", name: "Tramway Palmeraie", location: [31.645, -8.015], trafficFactor: 0.8 },
    { id: "TR5", name: "Tramway Sidi Youssef", location: [31.650, -8.025], trafficFactor: 0.7 },
    { id: "TR6", name: "Tramway Mhamid", location: [31.620, -8.000], trafficFactor: 0.8 },
    { id: "TR7", name: "Tramway Massira", location: [31.610, -8.010], trafficFactor: 0.9 },
    { id: "TR8", name: "Tramway Daoudiate", location: [31.640, -7.970], trafficFactor: 0.8 },
    { id: "TR9", name: "Tramway Ennakhil", location: [31.655, -7.965], trafficFactor: 0.7 },
    { id: "BZ1", name: "Bab Ziat", location: [31.620, -7.970], trafficFactor: 1.0 },
    { id: "BZ2", name: "Bab Doukkala Extension", location: [31.625, -7.960], trafficFactor: 1.1 },
    { id: "BZ3", name: "Avenue Hassan II", location: [31.630, -7.950], trafficFactor: 1.2 },
    { id: "BZ4", name: "Marrakech Mall", location: [31.635, -7.940], trafficFactor: 1.3 },
  ]
  
  export const busRoutes: BusRoute[] = [
    {
      id: "L3",
      name: "Gueliz - Medina",
      color: "#e74c3c",
      frequency: "Every 10-15 min",
      fare: 3.5,
      trafficFactor: 0.8,
      type: "bus",
      path: [
        [31.6295, -7.9811], // Gueliz
        [31.628, -7.985],
        [31.627, -7.99],
        [31.626, -7.995],
        [31.625, -8.0], // Medina
      ],
      stops: [
        { id: "GZ1", name: "Gueliz Center" },
        { id: "MV1", name: "Mohammed V Avenue" },
        { id: "MJ1", name: "Majorelle Garden" },
        { id: "BD1", name: "Bab Doukkala" },
        { id: "MC1", name: "Medina Center" },
      ],
    },
    {
      id: "L8",
      name: "Train Station - Jamaa el Fna",
      color: "#3498db",
      frequency: "Every 15-20 min",
      fare: 4.0,
      trafficFactor: 1.1,
      type: "bus",
      path: [
        [31.632, -7.978], // Train Station
        [31.631, -7.98],
        [31.63, -7.985],
        [31.629, -7.99],
        [31.628, -7.995],
        [31.627, -8.0], // Jamaa el Fna
      ],
      stops: [
        { id: "TS1", name: "Marrakech Train Station" },
        { id: "AM1", name: "Avenue Mohammed VI" },
        { id: "MM1", name: "Menara Mall" },
        { id: "RT1", name: "Royal Theater" },
        { id: "KM1", name: "Koutoubia Mosque" },
        { id: "JF1", name: "Jamaa el Fna Square" },
      ],
    },
    {
      id: "L12",
      name: "Gueliz - Grand Stade",
      color: "#2ecc71",
      frequency: "Every 20-25 min",
      fare: 4.5,
      trafficFactor: 0.7,
      type: "bus",
      path: [
        [31.6295, -7.9811], // Gueliz
        [31.635, -7.99],
        [31.64, -8.0],
        [31.645, -8.01],
        [31.65, -8.02],
        [31.6667, -8.0303], // Grand Stade
      ],
      stops: [
        { id: "GZ1", name: "Gueliz Center" },
        { id: "AK1", name: "Avenue Abdelkrim El Khattabi" },
        { id: "MJ2", name: "Marjane Market" },
        { id: "HR1", name: "Hay Riad" },
        { id: "QT1", name: "Quartier Tamansourt" },
        { id: "GS1", name: "Grand Stade de Marrakech" },
      ],
    },
    {
      id: "L19",
      name: "Airport Express - Grand Stade",
      color: "#9b59b6",
      frequency: "Every 30 min",
      fare: 6.0,
      trafficFactor: 0.6,
      type: "bus",
      path: [
        [31.61, -8.03], // Airport
        [31.62, -8.025],
        [31.63, -8.02],
        [31.64, -8.015],
        [31.65, -8.02],
        [31.6667, -8.0303], // Grand Stade
      ],
      stops: [
        { id: "AP1", name: "Marrakech Menara Airport" },
        { id: "RC1", name: "Route de Casablanca" },
        { id: "AG1", name: "Agdal Gardens" },
        { id: "PR1", name: "Palmeraie Resort" },
        { id: "QT1", name: "Quartier Tamansourt" },
        { id: "GS1", name: "Grand Stade de Marrakech" },
      ],
    },
    {
      id: "T1",
      name: "Tramway Central - Palmeraie",
      color: "#FF9800",
      frequency: "Every 12 min",
      fare: 6.0,
      trafficFactor: 0.7,
      type: "tram",
      path: [
        [31.6305, -7.975], // Tramway Central
        [31.6255, -7.990], // Tramway Medina
        [31.635, -8.01],   // Tramway Agdal
        [31.645, -8.015],  // Tramway Palmeraie
      ],
      stops: [
        { id: "TR1", name: "Tramway Central" },
        { id: "TR2", name: "Tramway Medina" },
        { id: "TR3", name: "Tramway Agdal" },
        { id: "TR4", name: "Tramway Palmeraie" },
      ],
    },
    {
      id: "T2",
      name: "Tramway Sidi Youssef - Mhamid",
      color: "#00BCD4",
      frequency: "Every 15 min",
      fare: 7.0,
      trafficFactor: 0.8,
      type: "tram",
      path: [
        [31.650, -8.025], // Sidi Youssef
        [31.635, -8.01],  // Agdal
        [31.620, -8.000], // Mhamid
      ],
      stops: [
        { id: "TR5", name: "Tramway Sidi Youssef" },
        { id: "TR3", name: "Tramway Agdal" },
        { id: "TR6", name: "Tramway Mhamid" },
      ],
    },
    {
      id: "T3",
      name: "Tramway Daoudiate - Ennakhil",
      color: "#8BC34A",
      frequency: "Every 18 min",
      fare: 7.5,
      trafficFactor: 0.9,
      type: "tram",
      path: [
        [31.640, -7.970], // Daoudiate
        [31.6305, -7.975], // Central
        [31.655, -7.965], // Ennakhil
      ],
      stops: [
        { id: "TR8", name: "Tramway Daoudiate" },
        { id: "TR1", name: "Tramway Central" },
        { id: "TR9", name: "Tramway Ennakhil" },
      ],
    },
    {
      id: "B21",
      name: "Bab Ziat - Marrakech Mall",
      color: "#FF5722",
      frequency: "Every 20 min",
      fare: 5.0,
      trafficFactor: 0.9,
      type: "bus",
      path: [
        [31.620, -7.970], // Bab Ziat
        [31.625, -7.960], // Bab Doukkala Extension
        [31.630, -7.950], // Avenue Hassan II
        [31.635, -7.940], // Marrakech Mall
      ],
      stops: [
        { id: "BZ1", name: "Bab Ziat" },
        { id: "BZ2", name: "Bab Doukkala Extension" },
        { id: "BZ3", name: "Avenue Hassan II" },
        { id: "BZ4", name: "Marrakech Mall" },
      ],
    },
    {
      id: "B22",
      name: "Gueliz - Bab Ziat",
      color: "#3F51B5",
      frequency: "Every 25 min",
      fare: 5.5,
      trafficFactor: 1.0,
      type: "bus",
      path: [
        [31.6295, -7.9811], // Gueliz Center
        [31.620, -7.970],   // Bab Ziat
      ],
      stops: [
        { id: "GZ1", name: "Gueliz Center" },
        { id: "BZ1", name: "Bab Ziat" },
      ],
    },
  ]
  
  // Helper functions
  export const getRouteById = (routeId: string): BusRoute | undefined => {
    return busRoutes.find((route) => route.id === routeId)
  }
  
  export const getStopById = (stopId: string): BusStop | undefined => {
    return busStops.find((stop) => stop.id === stopId)
  }
  
  export const getRoutesBetween = (originId: string, destinationId: string): BusRoute[] => {
    // In a real app, this would implement a pathfinding algorithm
    // For now, just return a sample route
    return busRoutes.filter((route) => {
      const stopIds = route.stops.map((stop) => stop.id)
      return stopIds.includes(originId) && stopIds.includes(destinationId)
    })
  }
  