import { renderHook, act, waitFor } from "@testing-library/react";
import { fetchWrapper } from "../../services/api";
import { usePokemons } from "../usePokemons";

jest.mock("../../services/api");

const mockedFetchWrapper = fetchWrapper as jest.Mock;

describe("usePokemons", () => {
  const mockPokemon = {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch pokemons by page", async () => {
    mockedFetchWrapper.mockResolvedValueOnce({
      data: {
        count: 2,
        results: [{ name: "bulbasaur" }, { name: "ivysaur" }],
      },
    });

    mockedFetchWrapper.mockResolvedValueOnce({ data: mockPokemon });
    mockedFetchWrapper.mockResolvedValueOnce({ data: mockPokemon });

    const { result } = renderHook(() => usePokemons(2));

    await act(async () => {
      await result.current.fetchPokemonsByPage(1);
    });

    expect(result.current.pokemonsToShow.length).toBe(2);
    expect(result.current.totalPages).toBe(1);
  });

  it("should fetch a specific Pokemon by name via searchWithDebounce", async () => {
    mockedFetchWrapper.mockResolvedValueOnce({ data: mockPokemon });

    const { result } = renderHook(() => usePokemons(20));

    act(() => {
      result.current.searchWithDebounce("Bulbasaur", 1);
    });

    await waitFor(() => {
      expect(result.current.pokemonsToShow).toEqual([mockPokemon]);
    });
  });
});
