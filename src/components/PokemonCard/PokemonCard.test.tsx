import { render, screen, fireEvent } from "@testing-library/react";
import { PokemonCard } from "./index";
import { Pokemon } from "../../types/pokemon";

const mockToggleFavorite = jest.fn();

const mockPokemon: Pokemon = {
  id: 1,
  name: "bulbasaur",
  sprites: { front_default: "https://example.com/bulbasaur.png" },
  types: [
    { type: { name: "grass", url: "" }, slot: 1 },
    { type: { name: "poison", url: "" }, slot: 2 },
  ],
  height: 7,
  weight: 69,
  abilities: [
    { ability: { name: "overgrow", url: "" }, is_hidden: false, slot: 1 },
    { ability: { name: "chlorophyll", url: "" }, is_hidden: true, slot: 2 },
  ],
  base_experience: 64,
  stats: [],
  moves: [],
};

describe("PokemonCard Component", () => {
  it("should render the Pokemon's name, image, and details", () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        toggleFavorite={mockToggleFavorite}
      />
    );

    expect(screen.getByText("Bulbasaur")).toBeInTheDocument();

    expect(screen.getByAltText("bulbasaur")).toHaveAttribute(
      "src",
      "https://example.com/bulbasaur.png"
    );

    expect(screen.getByText("Grass, Poison")).toBeInTheDocument();
    expect(screen.getByText("0.7m")).toBeInTheDocument();
    expect(screen.getByText("6.9kg")).toBeInTheDocument();
    expect(screen.getByText("Overgrow, Chlorophyll")).toBeInTheDocument();
  });

  it("should display a filled heart if the Pokemon is a favorite", () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={true}
        toggleFavorite={mockToggleFavorite}
      />
    );

    const heartIcon = screen.getByTestId("favorite-icon");

    expect(heartIcon).toBeInTheDocument();
    expect(heartIcon.querySelector("svg")).toHaveAttribute("fill", "red");
  });

  it("should display an empty heart if the Pokemon is not a favorite", () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        toggleFavorite={mockToggleFavorite}
      />
    );

    const heartIcon = screen.getByTestId("favorite-icon");

    expect(heartIcon).toBeInTheDocument();
    expect(heartIcon.querySelector("svg")).toHaveAttribute("fill", "none");
  });

  it("should call toggleFavorite with the correct Pokemon when the heart is clicked", () => {
    render(
      <PokemonCard
        pokemon={mockPokemon}
        isFavorite={false}
        toggleFavorite={mockToggleFavorite}
      />
    );

    const heartIcon = screen.getByTestId("favorite-icon");
    fireEvent.click(heartIcon);

    expect(mockToggleFavorite).toHaveBeenCalledTimes(1);
    expect(mockToggleFavorite).toHaveBeenCalledWith(mockPokemon);
  });
});
