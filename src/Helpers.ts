// Loads text file from URL 
export async function loadText(url: string): Promise<string> {
  return fetch(url).then(r => {
    if (!r.ok) throw new Error(`Failed to load ${url}`);
    return r.text();
  });
}