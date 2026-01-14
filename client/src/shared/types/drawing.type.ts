export type Drawpoint = {
  x: number,
  y: number,
  strokeWidth: number;
  color: string;
}

export type Point = {
  x: number,
  y: number;
}

export type DrawStroke = {
  userId: string,
  points: Point[],
  strokeWidth: number,
  color: string
}