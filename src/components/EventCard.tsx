// src/components/EventCard.tsx
import React from 'react';
import type { Event } from '../types/event';

interface EventCardProps {
  event: Event;
}

const EventCard: React.FC<EventCardProps> = ({ event }) => (
  <div className="card flex flex-col justify-between p-6">
    <div>
      <div className="text-5xl brand-yellow mb-4">
        <i className={`fas ${event.icon}`} />
      </div>
      <h3 className="text-2xl font-semibold text-white mb-2">{event.title}</h3>
      <p className="text-gray-400 mb-1">
        <strong className="text-brand-yellow">Data:</strong> {event.date}
      </p>
      {event.time && (
        <p className="text-gray-400 mb-3">
          <strong className="text-brand-yellow">Ora:</strong> {event.time}
        </p>
      )}
      <p className="text-gray-300">{event.description}</p>
    </div>
    {event.link && (
      <a
        href={event.link}
        className="mt-4 inline-block text-sm text-brand-blue hover:underline"
      >
        Prenota il tuo posto →
      </a>
    )}
  </div>
);

export default EventCard;
