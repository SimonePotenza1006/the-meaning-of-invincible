export interface Terrain {
  key: string;
  name: string;
  description: string;
}

export const TERRAINS: Terrain[] = [
  { key: 'forest', name: 'Foresta', description: 'Alberi fitti: terreno difficile e visuale ridotta.' },
  { key: 'dungeon', name: 'Sotterraneo', description: 'Corridoi angusti e stanze in penombra.' },
  { key: 'cave', name: 'Caverna', description: 'Buio profondo, stalattiti e passaggi stretti.' },
  { key: 'swamp', name: 'Palude', description: 'Fango e acqua bassa: terreno difficile ovunque.' },
  { key: 'mountain', name: 'Montagna', description: 'Dislivelli, rocce instabili e vento tagliente.' },
  { key: 'plains', name: 'Pianura', description: 'Campo aperto, poche coperture.' },
  { key: 'city', name: 'Città', description: 'Vicoli, tetti e folla: coperture ovunque.' },
  { key: 'desert', name: 'Deserto', description: 'Sabbia, calore opprimente e scarso riparo.' },
  { key: 'coast', name: 'Costa', description: 'Scogli, sabbia e acqua a un passo.' },
  { key: 'indoor', name: 'Interno / Taverna', description: 'Spazi chiusi: tavoli e mobilio come copertura.' },
];

export function getTerrain(key: string): Terrain | undefined {
  return TERRAINS.find((t) => t.key === key);
}
