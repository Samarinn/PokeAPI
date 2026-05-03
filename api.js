const BASE_URL = 'https://pokeapi.co/api/v2';

export async function fetchPokemonList(limit = 20, offset = 0) {
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  if (!res.ok) throw new Error('Falha ao carregar lista');
  const data = await res.json();
  // Buscar detalhes para cada um (imagem, etc.)
  const detalhesPromises = data.results.map(p => fetchPokemonDetail(p.name));
  return await Promise.all(detalhesPromises);
}

export async function fetchPokemonDetail(name) {
  const res = await fetch(`${BASE_URL}/pokemon/${name}`);
  if (!res.ok) throw new Error(`Falha ao carregar detalhes de ${name}`);
  return res.json();
}