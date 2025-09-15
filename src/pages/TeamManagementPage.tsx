import React, { useState } from 'react';
import { Player } from '../types';
import Modal from '../components/Modal';
import CreatePlayerForm from '../components/CreatePlayerForm';

interface TeamManagementPageProps {
  teams: { [key: string]: Player[] };
  createTeam: (teamName: string) => void;
  deleteTeam: (teamName: string) => void;
  renameTeam: (oldName: string, newName: string) => void;
  // FIX: The prop type is updated to accept players without an ID.
  addPlayersToPool: (newPlayers: Omit<Player, 'id'>[]) => void;
  createPlayer: (newPlayer: Omit<Player, 'id'>) => void;
  viewTeamDetails: (teamName: string) => void;
}

const TeamManagementPage: React.FC<TeamManagementPageProps> = ({
  teams,
  createTeam,
  deleteTeam,
  renameTeam,
  addPlayersToPool,
  createPlayer,
  viewTeamDetails
}) => {
  const [newTeamName, setNewTeamName] = useState('');
  const [editingTeam, setEditingTeam] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreatePlayerModalOpen, setIsCreatePlayerModalOpen] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);


  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) {
      setError('Team name cannot be empty.');
      return;
    }
    if (teams[newTeamName.trim()]) {
      setError('A team with this name already exists.');
      return;
    }
    createTeam(newTeamName.trim());
    setNewTeamName('');
    setError(null);
  };

  const handleStartEditing = (name: string) => {
    setEditingTeam(name);
    setEditingName(name);
  };

  const handleCancelEditing = () => {
    setEditingTeam(null);
    setEditingName('');
  };

  const handleSaveRename = (oldName: string) => {
    if (!editingName.trim() || editingName.trim() === oldName) {
        handleCancelEditing();
        return;
    }
    if (teams[editingName.trim()]) {
        alert('A team with this name already exists.');
        return;
    }
    renameTeam(oldName, editingName.trim());
    handleCancelEditing();
  };

  const handleDelete = (name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
        deleteTeam(name);
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const text = e.target?.result as string;
            const data = JSON.parse(text);
            if (!Array.isArray(data) || data.some(p => typeof p.name !== 'string')) { // Simple validation
                throw new Error("Invalid format. Expected an array of player objects.");
            }
            addPlayersToPool(data as Omit<Player, 'id'>[]);
            setUploadStatus({ message: `${data.length} players uploaded successfully!`, type: 'success' });
            setTimeout(() => setIsUploadModalOpen(false), 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
            setUploadStatus({ message: `Upload failed: ${errorMessage}`, type: 'error' });
        }
    };
    reader.readAsText(file);
  };
  
  const handlePlayerCreated = () => {
    setIsCreatePlayerModalOpen(false);
  };

  return (
    <div className="space-y-8">
      {/* --- Management Actions Card --- */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h2 className="text-2xl font-bold mb-4 text-emerald-400">Team & Player Management</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Team */}
            <div>
                 <h3 className="text-lg font-semibold mb-2 text-slate-200">Create a New Team</h3>
                <form onSubmit={handleCreateTeam} className="flex flex-col sm:flex-row items-stretch gap-2">
                    <input 
                        type="text"
                        value={newTeamName}
                        onChange={(e) => { setNewTeamName(e.target.value); setError(null); }}
                        placeholder="Enter new team name"
                        className="flex-grow bg-slate-700 border border-slate-600 rounded-md px-4 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    />
                    <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-colors duration-300">
                        Create
                    </button>
                </form>
                {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            </div>

            {/* Player Actions */}
            <div className="flex flex-col items-start gap-4">
                 <div className="w-full">
                    <h3 className="text-lg font-semibold mb-2 text-slate-200">Add Players to Pool</h3>
                    <div className="flex items-center gap-2">
                        <button onClick={() => { setUploadStatus(null); setIsUploadModalOpen(true); }} className="flex-1 px-5 py-2 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold rounded-lg transition-colors duration-300">
                            Upload from JSON
                        </button>
                        <button onClick={() => setIsCreatePlayerModalOpen(true)} className="flex-1 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-300">
                           Create New Player
                        </button>
                    </div>
                </div>
            </div>
        </div>
      </div>


      {/* --- Existing Teams List --- */}
      <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <h3 className="text-xl font-bold mb-4 text-emerald-400">Existing Teams</h3>
        <div className="space-y-3">
            {Object.keys(teams).length > 0 ? Object.keys(teams).map(name => (
                <div key={name} className="flex items-center justify-between bg-slate-800 p-4 rounded-lg">
                    {editingTeam === name ? (
                         <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            onBlur={() => handleSaveRename(name)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSaveRename(name)}
                            autoFocus
                            className="bg-slate-700 border border-slate-500 rounded-md px-3 py-1 text-white"
                        />
                    ) : (
                        <button onClick={() => viewTeamDetails(name)} className="text-lg text-white font-semibold hover:text-emerald-400 transition-colors">
                          {name} <span className="text-sm font-normal text-slate-400">({teams[name].length} players)</span>
                        </button>
                    )}
                   
                    <div className="flex items-center gap-2">
                        {editingTeam === name ? (
                             <button onClick={handleCancelEditing} className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold text-sm rounded-md">Cancel</button>
                        ) : (
                             <button onClick={() => handleStartEditing(name)} className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-md">Rename</button>
                        )}
                        <button onClick={() => handleDelete(name)} className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-md">Delete</button>
                    </div>
                </div>
            )) : (
              <p className="text-slate-400 text-center py-4">No teams created yet. Use the form above to create your first team.</p>
            )}
        </div>
      </div>

       {/* --- Modals --- */}
       <Modal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} title="Upload Player JSON File">
            <div className="text-slate-300">
                <p className="mb-4">Please select a JSON file containing an array of player objects.</p>
                <p className="mb-4 text-xs bg-slate-700 p-2 rounded">
                    Example: `[{"name": "Player Name", "country": "Country", ...}]`
                </p>
                <input
                    type="file"
                    accept=".json"
                    onChange={handleFileChange}
                    className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
                {uploadStatus && (
                    <p className={`mt-4 text-sm font-semibold ${uploadStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                        {uploadStatus.message}
                    </p>
                )}
            </div>
        </Modal>

        <Modal isOpen={isCreatePlayerModalOpen} onClose={() => setIsCreatePlayerModalOpen(false)} title="Create New Player">
            <CreatePlayerForm
                onSubmit={createPlayer}
                onSuccess={handlePlayerCreated}
            />
        </Modal>
    </div>
  );
};

export default TeamManagementPage;