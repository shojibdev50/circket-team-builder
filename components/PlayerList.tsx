import React from 'react';
import { Player } from '../types';
import PlayerCard from './PlayerCard';

interface PlayerListProps {
  title: string;
  players: Player[];
  onPlayerAction: (player: Player) => void;
  actionType: 'add' | 'remove';
  emptyMessage: string;
  isTeamFull?: boolean;
}

const PlayerList: React.FC<PlayerListProps> = ({ title, players, onPlayerAction, actionType, emptyMessage, isTeamFull }) => {
  return (
    <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
      <h2 className="text-2xl font-bold mb-4 text-emerald-400">{title} ({players.length})</h2>
      {players.length === 0 ? (
        <div className="flex items-center justify-center h-48 bg-slate-800 rounded-lg">
          <p className="text-slate-400">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {players.map(player => (
            <PlayerCard 
              key={player.id} 
              player={player} 
              onAction={onPlayerAction} 
              actionType={actionType}
              isActionDisabled={actionType === 'add' && isTeamFull}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PlayerList;
