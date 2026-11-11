export const MIN_WORDS = 2;
export const MAX_WORDS = 3;

// Shared by the cards and the API route: the route only accepts these words, so it can't be
// used to run arbitrary prompts on our Mistral key.
export const WORDS: string[] = [
  "Queen",
  "Giant",
  "Sneeze",
  "Sun",
  "Tequila",
  "Dad",
  "Surf",
  "Carrot",
  "Devil",
  "Toy",
  "Crocs",
  "Monkey",
  "T-Rex",
  "Leggings",
  "Spring",
  "Bubbles",
  "Spaghetti",
  "Ball",
  "Robot",
  "Pan",
  "WC",
  "Lollipop",
  "Castle",
];

// Cloudinary icons are named after the original (misspelled) labels, so corrected labels map back.
const IMAGE_NAMES: Record<string, string> = {
  Leggings: "leggins",
};

export function imageName(word: string): string {
  return IMAGE_NAMES[word] ?? word.toLowerCase();
}
