import { Calendar, MapPin, Clock } from 'lucide-react';
import { Event } from '../types';

interface Props {
  event: Event;
  onDelete?: (id: string) => void;
}

export default function EventCard({ event, onDelete }: Props) {
  const date = new Date(event.date);
  const isPast = date < new Date();

  return (
    <div className={`bg-white rounded-xl border p-4 flex gap-4 ${isPast ? 'opacity-60' : 'border-gray-200 hover:border-blue-200 hover:shadow-sm transition-all'}`}>
      <div className={`flex-shrink-0 w-14 h-14 rounded-xl flex flex-col items-center justify-center text-center ${isPast ? 'bg-gray-100' : 'bg-blue-600'}`}>
        <span className={`text-xs font-semibold uppercase ${isPast ? 'text-gray-500' : 'text-blue-200'}`}>
          {date.toLocaleString('en', { month: 'short' })}
        </span>
        <span className={`text-xl font-bold leading-none ${isPast ? 'text-gray-700' : 'text-white'}`}>
          {date.getDate()}
        </span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="font-semibold text-gray-900 text-sm leading-snug">{event.title}</h4>
          {onDelete && (
            <button
              onClick={() => onDelete(event._id)}
              className="text-xs text-red-500 hover:text-red-700 transition-colors shrink-0"
            >
              Remove
            </button>
          )}
        </div>
        {event.description && (
          <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{event.description}</p>
        )}
        <div className="flex flex-wrap items-center gap-3 mt-2">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock size={11} />
            {date.toLocaleTimeString('en', { hour: '2-digit', minute: '2-digit' })}
          </div>
          {event.location && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={11} />
              {event.location}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
