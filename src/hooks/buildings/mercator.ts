export function lonLatToMercator(lon: number, lat: number): [x: number, y: number] {
  const earthRadius = 6378137; // Радиус Земли в метрах (WGS84)
  const x = lon * (earthRadius * Math.PI / 180);
  const y = Math.log(Math.tan((90 + lat) * Math.PI / 360)) * earthRadius;
  return [x, y];
}
