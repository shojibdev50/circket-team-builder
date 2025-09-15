import React, { useState, useEffect, useCallback } from 'react';
import { Player } from './types';
import { generateCricketPlayers } from './services/geminiService';
import Header from './components/Header';
import Loader from './components/Loader';
import HomePage from './pages/HomePage';
import TeamManagementPage from './pages/TeamManagementPage';
import TeamDetailsPage from './pages/TeamDetailsPage';

export type View = 'home' | 'manageTeams' | 'teamDetails';

const App: React.FC = () => {
  const [playerPool, setPlayerPool] = useState<Player[]>([]);
  const [teams, setTeams] = useState<{ [key: string]: Player[] }>({ 'Team 1': [] });
  const [activeTeamName, setActiveTeamName] = useState<string>('Team 1');
  const [maxTeamSize, setMaxTeamSize] = useState<number>(6);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<View>('home');
  const [viewingTeamName, setViewingTeamName] = useState<string | null>(null);

  const fetchPlayers = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const players = await generateCricketPlayers(30);
      setPlayerPool(players);
    } catch (err) {
      console.error(err);
      setError('Failed to generate players. Please check the API key and try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPlayers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addPlayerToTeam = (player: Player, teamName: string) => {
    const targetTeam = teams[teamName] || [];
    // For team details page, we use the global maxTeamSize
    if (targetTeam.length < maxTeamSize) {
      setTeams(prev => ({
        ...prev,
        [teamName]: [...targetTeam, player]
      }));
    }
  };

  const removePlayerFromTeam = (player: Player, teamName: string) => {
    setTeams(prev => ({
      ...prev,
      [teamName]: (prev[teamName] || []).filter(p => p.id !== player.id)
    }));
  };

  const handleCreateTeam = (teamName: string) => {
    setTeams(prev => ({ ...prev, [teamName]: [] }));
    setActiveTeamName(teamName);
    setView('home'); // Switch to home view to start building the new team
  };

  const handleDeleteTeam = (teamName: string) => {
    const newTeams = { ...teams };
    delete newTeams[teamName];
    setTeams(newTeams);

    if (activeTeamName === teamName || viewingTeamName === teamName) {
      const remainingTeamNames = Object.keys(newTeams);
      const newActive = remainingTeamNames.length > 0 ? remainingTeamNames[0] : 'Team 1';
      setActiveTeamName(newActive);
      setViewingTeamName(null);
      setView('manageTeams');
    }
  };
  
  const handleRenameTeam = (oldName: string, newName: string) => {
    if (oldName === newName || !teams[oldName]) return;

    const newTeams = { ...teams };
    newTeams[newName] = newTeams[oldName];
    delete newTeams[oldName];
    
    setTeams(newTeams);
    if (activeTeamName === oldName) {
        setActiveTeamName(newName);
    }
    if (viewingTeamName === oldName) {
        setViewingTeamName(newName);
    }
  };

  const handleTeamSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
     // Apply size change across all teams by trimming if necessary
    const updatedTeams = { ...teams };
    for (const teamName in updatedTeams) {
        if (updatedTeams[teamName].length > newSize) {
            updatedTeams[teamName] = updatedTeams[teamName].slice(0, newSize);
        }
    }
    setTeams(updatedTeams);
    setMaxTeamSize(newSize);
  };

  const addPlayersToPool = (newPlayers: Player[]) => {
    let maxId = Math.max(0, ...playerPool.map(p => p.id));
    const playersWithResolvedIds = newPlayers.map(p => ({
        ...p,
        id: ++maxId,
    }));
    setPlayerPool(prev => [...prev, ...playersWithResolvedIds]);
  };

  const handleCreatePlayer = (newPlayer: Omit<Player, 'id'>) => {
    const maxId = Math.max(0, ...playerPool.map(p => p.id));
    const playerWithId = { ...newPlayer, id: maxId + 1 };
    setPlayerPool(prev => [playerWithId, ...prev]);
  };

  const handleViewTeamDetails = (teamName: string) => {
    setViewingTeamName(teamName);
    setView('teamDetails');
  };

  const renderContent = () => {
    if (isLoading) return <Loader />;
    if (error) {
      return (
        <div className="text-center p-8 bg-red-900/50 border border-red-700 rounded-lg">
          <h2 className="text-2xl font-bold text-red-400 mb-2">An Error Occurred</h2>
          <p className="text-red-300">{error}</p>
          <button
            onClick={fetchPlayers}
            className="mt-4 px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-300"
          >
            Retry
          </button>
        </div>
      );
    }

    if (view === 'home') {
      return (
        <HomePage
          playerPool={playerPool}
          teams={teams}
          activeTeamName={activeTeamName}
          maxTeamSize={maxTeamSize}
          addPlayerToTeam={(player) => addPlayerToTeam(player, activeTeamName)}
          removePlayerFromTeam={(player) => removePlayerFromTeam(player, activeTeamName)}
          setActiveTeamName={setActiveTeamName}
          onTeamSizeChange={handleTeamSizeChange}
        />
      );
    }

    if (view === 'manageTeams') {
        return (
            <TeamManagementPage
                teams={teams}
                createTeam={handleCreateTeam}
                deleteTeam={handleDeleteTeam}
                renameTeam={handleRenameTeam}
                addPlayersToPool={addPlayersToPool}
                createPlayer={handleCreatePlayer}
                viewTeamDetails={handleViewTeamDetails}
            />
        );
    }

    if (view === 'teamDetails' && viewingTeamName && teams[viewingTeamName]) {
        return (
            <TeamDetailsPage
                teamName={viewingTeamName}
                teamPlayers={teams[viewingTeamName]}
                playerPool={playerPool}
                maxTeamSize={maxTeamSize}
                addPlayerToTeam={(player) => addPlayerToTeam(player, viewingTeamName)}
                removePlayerFromTeam={(player) => removePlayerFromTeam(player, viewingTeamName)}
                onGoBack={() => setView('manageTeams')}
            />
        );
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-gray-800 font-sans">
      <Header currentView={view} setView={setView}/>
      <main className="container mx-auto p-4 md:p-8">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;