import { Game } from './game';

export interface StrapiImage {
  data: {
    attributes: {
      url: string;
    };
  } | null;
}

export interface StrapiGameItem {
  id: number;
  attributes: {
    titolo: string;
    descrizioneBreve: string;
    categoria: string;
    giocatori: string;
    durata: string;
    difficolta: string;
    rules: string;
    immagineCopertina?: StrapiImage;
    immagineDettaglio?: StrapiImage;
  };
}
