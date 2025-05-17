// src/types/event.ts
export interface Event {
  id: string;
  title: string;
  date: string;         // es. "2025-06-15"
  time?: string;        // es. "21:00"
  description: string;
  icon: string;         // icona FontAwesome, es. "fa-birthday-cake"
  link?: string;        // se vuoi un link per prenotare
}
