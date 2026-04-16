import { Link } from 'react-router-dom';
import { Users, Tag, Calendar } from 'lucide-react';
import { Club } from '../types';

const categoryColors: Record<string, string> = {
  academic: 'bg-blue-100 text-blue-700',
  arts: 'bg-pink-100 text-pink-700',
  sports: 'bg-orange-100 text-orange-700',
  culture: 'bg-amber-100 text-amber-700',
  technology: 'bg-cyan-100 text-cyan-700',
  community: 'bg-green-100 text-green-700',
  other: 'bg-gray-100 text-gray-700'
};

interface Props {
  club: Club & { memberCount?: number };
}

export default function ClubCard({ club }: Props) {
  const coverFallback = 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=800';

  return (
    <Link
      to={`/clubs/${club._id}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-200 hover:border-blue-200 hover:shadow-lg transition-all duration-200 group flex flex-col"
    >
      <div className="relative h-44 overflow-hidden bg-gray-100">
        <img
          src={club.coverImage || coverFallback}
          alt={club.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          onError={(e) => { (e.target as HTMLImageElement).src = coverFallback; }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        {club.department && (
          <div
            className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold text-white backdrop-blur-sm"
            style={{ backgroundColor: club.department.color + 'cc' }}
          >
            {club.department.name}
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-blue-700 transition-colors">
            {club.name}
          </h3>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${categoryColors[club.category] || categoryColors.other}`}>
            {club.category}
          </span>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed flex-1 line-clamp-2 mb-4">
          {club.shortDescription || club.description || 'No description available.'}
        </p>

        <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <Users size={13} />
            <span>{club.members?.length ?? 0} / {club.maxMembers} members</span>
          </div>
          <div className="flex items-center gap-3">
            {club.foundedYear && (
              <div className="flex items-center gap-1.5">
                <Calendar size={13} />
                <span>Est. {club.foundedYear}</span>
              </div>
            )}
            {club.leader && (
              <div className="flex items-center gap-1.5">
                <Tag size={13} />
                <span className="truncate max-w-[80px]">{club.leader.name}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
