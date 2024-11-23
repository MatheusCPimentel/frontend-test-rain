import { renderHook, act } from "@testing-library/react";
import { useFavorites } from ".";
import { Pokemon } from "../../types/pokemon";

describe("useFavorites", () => {
  const mockPokemon: Pokemon = {
    id: 1,
    name: "Bulbasaur",
    types: [{ slot: 1, type: { name: "grass", url: "" } }],
    sprites: { front_default: "url" },
    height: 7,
    weight: 69,
    abilities: [],
    base_experience: 0,
    stats: [],
    moves: [],
  };

  afterEach(() => {
    localStorage.clear();
  });

  it("should load favorites from localStorage", () => {
    localStorage.setItem("favorites", JSON.stringify([mockPokemon]));

    const { result } = renderHook(() => useFavorites());
    expect(result.current.favorites).toEqual([mockPokemon]);
  });

  it("should toggle a Pokemon as favorite", () => {
    const { result } = renderHook(() => useFavorites());

    act(() => {
      result.current.toggleFavorite(mockPokemon);
    });

    expect(result.current.favorites).toEqual([mockPokemon]);

    expect(localStorage.getItem("favorites")).toEqual(
      JSON.stringify([mockPokemon])
    );

    act(() => {
      result.current.toggleFavorite(mockPokemon);
    });

    expect(result.current.favorites).toEqual([]);
    expect(localStorage.getItem("favorites")).toEqual(JSON.stringify([]));
  });
});
