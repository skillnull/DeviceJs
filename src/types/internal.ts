export type GeoPositionResult = GeolocationPosition | {
  coords: {
    longitude: string
    latitude: string
  }
}
