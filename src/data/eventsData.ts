// src/data/eventsData.ts
import type { Event } from '../types/event';

export const eventsData: Event[] = [
  {
    id: 'nerd-birthday',
    title: 'WE ARE NERD - BIRTHDAY',
    date: '2025-07-10',
    time: '20:30',
    description: 'Festeggia con noi! Speciale NERDQUIZ PARTY per il nostro compleanno.',
    icon: 'fa-birthday-cake',
    link: '#contatti',
  },
  {
    id: 'serata-scenari',
    title: 'Serata Scenari D&D',
    date: '2025-07-17',
    time: '21:00',
    description: 'Unisciti ai nostri master per una notte di avventure epiche a Dungeons & Dragons.',
    icon: 'fa-dragon',
  },
  {
    id: 'torneo-catan',
    title: 'Torneo Catan',
    date: '2025-07-24',
    time: '18:00',
    description: 'Sfida i migliori colonizzatori di Taranto in un torneo all’ultimo punto.',
    icon: 'fa-chess',
    link: '#contatti',
  },
  // aggiungi gli altri eventi qui…
];
