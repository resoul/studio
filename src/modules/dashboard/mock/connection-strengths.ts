import { ConnectionStrength } from '../types/connection-strength';

export const CONNECTION_STRENGTHS: ConnectionStrength[] = [
  {
    id: '1',
    name: 'Very weak',
    score: '1',
    color: 'bg-red-400',
  },
  {
    id: '2',
    name: 'Weak',
    score: '2',
    color: 'bg-sky-400',
  },
  {
    id: '3',
    name: 'Medium',
    score: '3',
    color: 'bg-blue-500',
  },
  {
    id: '4',
    name: 'Strong',
    score: '4',
    color: 'bg-yellow-500',
  },
  {
    id: '5',
    name: 'Very strong',
    score: '5',
    color: 'bg-emerald-500',
  },
];
