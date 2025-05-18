import { Game } from './game';

export interface StrapiGameItem {
  id: number;
  titolo: string;
  descrizioneBreve: string;
  categoria: string;
  giocatori: string;
  durata: string;
  difficolta: string;
  rules: string;
  immagineCopertina?: {
    url: string;
  };
  immagineDettaglio?: {
    url: string;
  };
}
