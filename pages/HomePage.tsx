import React from 'react';
import { Player } from '../types';
import PlayerList from '../components/PlayerList';

interface HomePageProps {
  playerPool: Player[];
  teams: { [key: string]: Player[] };
  activeTeamName: string;
  maxTeamSize: number;
  addPlayerToTeam: (player: Player) => void;
  removePlayerFromTeam: (player: Player) => void;
  setActiveTeamName: (name: string) => void;
  onTeamSizeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

const HomePage: React.FC<HomePageProps> = ({
  playerPool,
  teams,
  activeTeamName,
  maxTeamSize,
  addPlayerToTeam,
  removePlayerFromTeam,
  setActiveTeamName,
  onTeamSizeChange
}) => {
    
  const activeTeam = teams[activeTeamName] || [];
  const isTeamFull = activeTeam.length >= maxTeamSize;
  const activeTeamPlayerIds = new Set(activeTeam.map(p => p.id));
  const availablePlayers = playerPool.filter(p => !activeTeamPlayerIds.has(p.id));

  return (
    <>
      <div className="mb-8 p-4 md:p-6 bg-slate-800/60 rounded-xl border border-slate-700 flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <label htmlFor="team-select" className="font-semibold text-slate-300">Active Team:</label>
          <select
            id="team-select"
            value={activeTeamName}
            onChange={(e) => setActiveTeamName(e.target.value)}
            className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            {Object.keys(teams).map(name => <option key={name} value={name}>{name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4">
          <label htmlFor="size-select" className="font-semibold text-slate-300">Team Size:</label>
          <select
            id="size-select"
            value={maxTeamSize}
            onChange={onTeamSizeChange}
            className="bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
          >
            <option value="5">5 Players</option>
            <option value="6">6 Players</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PlayerList
          title="Player Pool"
          players={availablePlayers}
          onPlayerAction={addPlayerToTeam}
          actionType="add"
          emptyMessage="All available players have been selected for this team."
          isTeamFull={isTeamFull}
        />
        <PlayerList
          title={`Your Team: ${activeTeamName}`}
          players={activeTeam}
          onPlayerAction={removePlayerFromTeam}
          actionType="remove"
          emptyMessage="Select players from the pool to build your team."
        />
      </div>
    </>
  );
};

export default HomePage;
