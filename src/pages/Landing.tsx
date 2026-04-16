import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  GraduationCap,
  Users,
  BookOpen,
  Star,
  Zap,
  Globe,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { api } from '../lib/api';
import { Club, Event } from '../types';
import ClubCard from '../components/ClubCard';
import EventCard from '../components/EventCard';

export default function Landing() {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    api.clubs.list().then((d: unknown) => {
      const data = d as { clubs: Club[] };
      setClubs(data.clubs.slice(0, 6));
    });
    api.events.upcoming().then((d: unknown) => {
      const data = d as { events: Event[] };
      setEvents(data.events.slice(0, 4));
    });
  }, []);

  const stats = [
    { icon: BookOpen, value: clubs.length + '+', label: 'Active Clubs' },
    { icon: Users, value: '500+', label: 'Student Members' },
    { icon: Globe, value: '6+', label: 'Departments' },
    { icon: Calendar, value: '50+', label: 'Events / Year' }
  ];

  const features = [
    { icon: Star, title: 'Discover Clubs', desc: 'Browse clubs across every department — academic, arts, sports, technology, and more.' },
    { icon: CheckCircle, title: 'Easy Applications', desc: 'Apply to multiple clubs with one click and track your membership status in real time.' },
    { icon: Zap, title: 'Stay Updated', desc: 'Never miss an event. Get the latest schedules, workshops, and activities from your clubs.' }
  ];

  return (
    <div className="bg-gray-50">
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-400 rounded-full opacity-10 blur-3xl" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23ffffff%22%20fill-opacity%3D%220.03%22%3E%3Cpath%20d%3D%22M36%2034v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6%2034v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6%204V0H4v4H0v2h4v4h2V6h4V4H6z%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E')] opacity-30" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-sm px-4 py-1.5 rounded-full mb-8 backdrop-blur-sm">
              <Zap size={13} />
              University Club Management Portal
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
              Find Your{' '}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                Community
              </span>{' '}
              on Campus
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10">
              Explore student clubs, apply for membership, and stay connected with events — all from one modern platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/auth?tab=register"
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 shadow-lg shadow-blue-900/50 hover:shadow-blue-800/60"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 backdrop-blur-sm border border-white/20"
              >
                <BookOpen size={18} />
                Browse Clubs
              </Link>
            </div>
          </div>
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 pb-16">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-colors">
                <s.icon size={22} className="text-blue-400 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-white">{s.value}</div>
                <div className="text-xs text-slate-400 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything You Need</h2>
          <p className="text-gray-500 max-w-lg mx-auto">One platform for students, leaders, and administrators to manage university clubs seamlessly.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <div key={i} className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-5">
                <f.icon size={22} className="text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {clubs.length > 0 && (
        <section className="bg-white py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Clubs</h2>
                <p className="text-gray-500 mt-1">Discover clubs that match your interests</p>
              </div>
              <Link
                to="/clubs"
                className="hidden sm:inline-flex items-center gap-1.5 text-blue-600 font-medium text-sm hover:text-blue-700 transition-colors"
              >
                View all clubs
                <ArrowRight size={15} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {clubs.map((club) => (
                <ClubCard key={club._id} club={club} />
              ))}
            </div>
            <div className="text-center mt-10">
              <Link
                to="/clubs"
                className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-blue-700 transition-colors"
              >
                Explore All Clubs
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">Upcoming Events</h2>
            <p className="text-gray-500 mt-1">Don't miss what's happening on campus</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-gradient-to-r from-blue-600 to-cyan-600 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <GraduationCap size={44} className="text-white/80 mx-auto mb-5" />
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Get Involved?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Join thousands of students already making the most of their university experience.
          </p>
          <Link
            to="/auth?tab=register"
            className="inline-flex items-center gap-2 bg-white text-blue-700 font-bold px-8 py-3.5 rounded-xl hover:bg-blue-50 transition-colors shadow-xl"
          >
            Create Your Account
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="bg-slate-900 text-slate-400 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
              <GraduationCap size={15} className="text-white" />
            </div>
            <span className="text-white font-bold">UniClubs</span>
          </div>
          <p className="text-sm">University Club Management System &copy; {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
