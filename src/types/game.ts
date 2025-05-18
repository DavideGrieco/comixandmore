export interface Game {
  id: string;
  documentId: string; // ID del documento in Strapi
  titolo: string;
  immagineCopertina: string;
  immagineDettaglio: string;
  descrizioneBreve: string;
  categoria: string;
  giocatori: string;
  durata: string;
  difficolta: string;
  rules: string;
}