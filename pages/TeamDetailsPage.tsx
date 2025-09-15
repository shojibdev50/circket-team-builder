import React from 'react';
import { Player } from '../types';
import PlayerList from '../components/PlayerList';

interface TeamDetailsPageProps {
  teamName: string;
  teamPlayers: Player[];
  playerPool: Player[];
  maxTeamSize: number;
  addPlayerToTeam: (player: Player) => void;
  removePlayerFromTeam: (player: Player) => void;
  onGoBack: () => void;
}

const TeamDetailsPage: React.FC<TeamDetailsPageProps> = ({
  teamName,
  teamPlayers,
  playerPool,
  maxTeamSize,
  addPlayerToTeam,
  removePlayerFromTeam,
  onGoBack,
}) => {
  const isTeamFull = teamPlayers.length >= maxTeamSize;
  const teamPlayerIds = new Set(teamPlayers.map(p => p.id));
  const availablePlayers = playerPool.filter(p => !teamPlayerIds.has(p.id));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">
          Team Details: <span className="text-white">{teamName}</span>
        </h1>
        <button
          onClick={onGoBack}
          className="px-5 py-2 bg-slate-700 hover:bg-slate-600 text-white font-semibold rounded-lg transition-colors duration-300"
        >
          &larr; Back to Manage Teams
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlayerList
          title="Player Pool"
          players={availablePlayers}
          onPlayerAction={addPlayerToTeam}
          actionType="add"
          emptyMessage="All available players are in this team."
          isTeamFull={isTeamFull}
        />
        <PlayerList
          title={`Team Roster (${teamPlayers.length}/${maxTeamSize})`}
          players={teamPlayers}
          onPlayerAction={removePlayerFromTeam}
          actionType="remove"
          emptyMessage="This team has no players."
        />
      </div>
    </div>
  );
};

export default TeamDetailsPage;
