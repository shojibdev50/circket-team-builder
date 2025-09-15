import React, { useState } from 'react';
import { Player, PlayerRole } from '../types';
import BatIcon from './icons/BatIcon';
import BallIcon from './icons/BallIcon';
import TrophyIcon from './icons/TrophyIcon';

interface PlayerCardProps {
  player: Player;
  onAction: (player: Player) => void;
  actionType: 'add' | 'remove';
  isActionDisabled?: boolean;
}

const StatItem: React.FC<{ icon: React.ReactNode; label: string; value: string | number }> = ({ icon, label, value }) => (
  <div className="flex items-center text-sm p-2 bg-slate-700/50 rounded-md">
    <span className="text-emerald-400 mr-2">{icon}</span>
    <span className="text-slate-300 mr-auto">{label}</span>
    <span className="font-semibold text-white">{value}</span>
  </div>
);

const PlayerCard: React.FC<PlayerCardProps> = ({ player, onAction, actionType, isActionDisabled }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRoleColor = (role: PlayerRole) => {
    switch (role) {
      case PlayerRole.BATSMAN: return 'bg-blue-500/20 text-blue-300 border-blue-500';
      case PlayerRole.BOWLER: return 'bg-red-500/20 text-red-300 border-red-500';
      case PlayerRole.ALL_ROUNDER: return 'bg-purple-500/20 text-purple-300 border-purple-500';
      case PlayerRole.WICKET_KEEPER: return 'bg-yellow-500/20 text-yellow-300 border-yellow-500';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 transition-all duration-300 ease-in-out hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-900/50">
      <div className="p-4 flex items-center">
        <div className="flex-grow">
          <h3 className="text-lg font-bold text-white">{player.name}</h3>
          <p className="text-sm text-slate-400">{player.country}</p>
          <span className={`text-xs font-semibold px-2 py-1 rounded-full mt-2 inline-block border ${getRoleColor(player.role)}`}>
            {player.role}
          </span>
        </div>
        <div className="flex flex-col items-end space-y-2">
          <button
            onClick={() => onAction(player)}
            disabled={isActionDisabled}
            className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors duration-200 ${
              actionType === 'add' 
              ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white'
            } ${isActionDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {actionType === 'add' ? 'Add Player' : 'Remove'}
          </button>
          <button onClick={() => setIsExpanded(!isExpanded)} className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
            {isExpanded ? 'Hide Stats' : 'Show Stats'}
          </button>
        </div>
      </div>
      {isExpanded && (
        <div className="border-t border-slate-700 p-4 animate-fade-in">
          <h4 className="font-semibold mb-2 text-slate-200">Career Statistics</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <StatItem icon={<BatIcon />} label="Runs" value={player.stats.runs.toLocaleString()} />
            <StatItem icon={<BatIcon />} label="Highest Score" value={player.stats.highestRun} />
            <StatItem icon={<BatIcon />} label="Batting Avg" value={player.stats.battingAverage.toFixed(2)} />
            <StatItem icon={<BallIcon />} label="Wickets" value={player.stats.wickets} />
            <StatItem icon={<BallIcon />} label="Best Bowling" value={player.stats.highestWicket} />
            <StatItem icon={<TrophyIcon />} label="Man of the Match" value={player.stats.manOfTheMatch} />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCard;
