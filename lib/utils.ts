export function formatJoke(joke: string) {
  let formattedJoke: string;
  if (joke.includes("Q:")) {
    formattedJoke = joke.replace("Q: ", "").replace("A: ", "");
  } else {
    formattedJoke = joke;
  }
  return stripMarkdown(formattedJoke);
}

// Mistral still wraps words in markdown emphasis ("a *noodle* for adventure") even though the
// prompt asks for plain text, and the joke box would show the symbols literally.
function stripMarkdown(text: string): string {
  return text
    .replace(/[*`]/g, "")
    .replace(/(^|[\s("'])_+([^_\n]+?)_+(?=$|[\s.,!?;:)"'])/g, "$1$2")
    .replace(/^#{1,6}\s+/gm, "");
}
