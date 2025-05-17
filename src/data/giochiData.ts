// src/data/giochiData.ts
import type { Game } from '../types/game';

export const giochiData: Game[] = [
  {
    id: 'catan',
    titolo: 'Catan',
    immagineCopertina: '/img/games/catan.jpg',
    immagineDettaglio: '/img/games/catan.jpg',
    descrizioneBreve: 'Commercia, costruisci, colonizza!',
    categoria: 'Strategia, Gestione Risorse',
    giocatori: '3-4 (esp. 5-6)',
    durata: '60-120 min',
    difficolta: 'Media',
    rules: `
1. Posiziona il tabellone e distribuisci le tessere risorsa.
2. Ogni giocatore piazza 2 insediamenti e 2 strade.
3. A turno, lancia i dadi e raccogli le risorse corrispondenti.
4. Scambia risorse o costruisci strade, insediamenti e città.
5. Il primo che raggiunge 10 punti vittoria vince la partita.
    `.trim(),
  },
  {
    id: 'ticket-to-ride',
    titolo: 'Ticket to Ride',
    immagineCopertina: '/img/games/tickettoride.jpeg',
    immagineDettaglio: '/img/games/tickettoride.jpeg',
    descrizioneBreve: 'Collega città attraverso gli Stati Uniti.',
    categoria: 'Famiglia, Strategia Leggera',
    giocatori: '2-5',
    durata: '30-60 min',
    difficolta: 'Facile',
    rules: `
1. Distribuisci 4 carte Vagone a ciascun giocatore.
2. Pesca 3 carte Destinazione (puoi scartarne fino a 1).
3. A turno, scegli un’azione: pescare carte Vagone, reclamare una tratta o pescare carte Destinazione.
4. Per reclamare una tratta, scarta il numero e il colore di carte Vagone richieste.
5. Alla fine del gioco, aggiungi punti per tratte completate e sottrai quelli delle Destinazioni non realizzate.
    `.trim(),
  },
  {
    id: 'dixit',
    titolo: 'Dixit',
    immagineCopertina: '/img/games/dixit.jpg',
    immagineDettaglio: '/img/games/dixit.jpg',
    descrizioneBreve: 'Un’immagine vale mille parole!',
    categoria: 'Party Game, Narrazione',
    giocatori: '3-6 (fino a 12 con esp.)',
    durata: '30 min',
    difficolta: 'Molto Facile',
    rules: `
1. Ogni giocatore riceve 6 carte illustrate.
2. A turno il narratore sceglie una carta e dice una parola o frase a essa ispirata.
3. Gli altri giocatori scelgono dalla propria mano la carta che meglio corrisponde all’indizio.
4. Si mescolano le carte scelte e si rivelano, quindi si vota quale carte appartiene al narratore.
5. Si assegnano punti in base a chi indovina e a chi inganna gli altri.
    `.trim(),
  },
  {
    id: 'esempio-4',
    titolo: 'Nome Gioco Lungo Che Potrebbe Troncare',
    immagineCopertina: '/img/games/placeholder4.jpg',
    immagineDettaglio: '/img/games/placeholder4-detail.jpg',
    descrizioneBreve: 'Un altro gioco fantastico.',
    categoria: 'Avventura, Cooperativo',
    giocatori: '1-4',
    durata: '90-180 min',
    difficolta: 'Difficile',
    rules: `
1. Preparare il tabellone con le tessere mappa.
2. Ogni giocatore sceglie un personaggio con abilità uniche.
3. Collaborate per superare gli obiettivi scenari.
4. Usate abilità e risorse in modo strategico.
5. Se completate tutti gli obiettivi prima del tempo, vincete.
    `.trim(),
  },
  {
    id: 'esempio-5',
    titolo: 'Nome Gioco Lsaadsaso Che Potrebbe Troncare',
    immagineCopertina: '/img/games/placeholder5.jpg',
    immagineDettaglio: '/img/games/placeholder5-detail.jpg',
    descrizioneBreve: 'Un gioco sperimentale.',
    categoria: 'Fantasy, Narrativo',
    giocatori: '2-6',
    durata: '45-90 min',
    difficolta: 'Media',
    rules: `
1. Distribuire 5 carte Avventura a ciascun giocatore.
2. A turno pescare una carta Evento e risolvere l’effetto.
3. Giocare carte Avventura per accumulare punti storia.
4. Bilanciare rischio e ricompensa per massimizzare il punteggio.
5. Vince chi ha più punti storia al termine del mazzo Evento.
    `.trim(),
  },
];
