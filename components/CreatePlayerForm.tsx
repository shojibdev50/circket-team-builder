import React, { useState } from 'react';
import { Player, PlayerRole } from '../types';

interface CreatePlayerFormProps {
  onSubmit: (player: Omit<Player, 'id'>) => void;
  onSuccess: () => void;
}

const initialStats = {
  runs: 0,
  wickets: 0,
  battingAverage: 0,
  highestRun: 0,
  highestWicket: '0/0',
  manOfTheMatch: 0,
};

const initialState = {
  name: '',
  country: '',
  role: PlayerRole.BATSMAN,
  stats: initialStats,
};

const CreatePlayerForm: React.FC<CreatePlayerFormProps> = ({ onSubmit, onSuccess }) => {
  const [playerData, setPlayerData] = useState<Omit<Player, 'id'>>(initialState);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!playerData.name.trim()) newErrors.name = 'Name is required.';
    if (!playerData.country.trim()) newErrors.country = 'Country is required.';
    if (playerData.stats.runs < 0) newErrors.runs = 'Runs cannot be negative.';
    if (playerData.stats.wickets < 0) newErrors.wickets = 'Wickets cannot be negative.';
    if (playerData.stats.battingAverage < 0) newErrors.battingAverage = 'Average cannot be negative.';
    if (playerData.stats.highestRun < 0) newErrors.highestRun = 'Highest run cannot be negative.';
    if (playerData.stats.manOfTheMatch < 0) newErrors.mom = 'MoM awards cannot be negative.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleStatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPlayerData(prev => ({
        ...prev,
        stats: {
            ...prev.stats,
            [name]: name === 'highestWicket' ? value : Number(value)
        }
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(playerData);
      onSuccess();
    }
  };
  
  const InputField: React.FC<{ name: string; label: string; value: string | number; error?: string; type?: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }> = 
  ({ name, label, value, error, type = 'text', onChange }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input 
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField name="name" label="Player Name" value={playerData.name} error={errors.name} onChange={handleChange} />
        <InputField name="country" label="Country" value={playerData.country} error={errors.country} onChange={handleChange} />
      </div>

      <div>
        <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-1">Role</label>
        <select name="role" id="role" value={playerData.role} onChange={handleChange} className="w-full bg-slate-700 border border-slate-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none">
            {Object.values(PlayerRole).map(role => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>

      <hr className="border-slate-600" />
      <h3 className="text-lg font-semibold text-slate-200">Statistics</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputField name="runs" label="Total Runs" type="number" value={playerData.stats.runs} error={errors.runs} onChange={handleStatChange} />
        <InputField name="wickets" label="Total Wickets" type="number" value={playerData.stats.wickets} error={errors.wickets} onChange={handleStatChange} />
        <InputField name="battingAverage" label="Batting Average" type="number" value={playerData.stats.battingAverage} error={errors.battingAverage} onChange={handleStatChange} />
        <InputField name="highestRun" label="Highest Run" type="number" value={playerData.stats.highestRun} error={errors.highestRun} onChange={handleStatChange} />
        <InputField name="highestWicket" label="Best Bowling (e.g., 5/25)" value={playerData.stats.highestWicket} onChange={handleStatChange} />
        <InputField name="manOfTheMatch" label="Man of the Match Awards" type="number" value={playerData.stats.manOfTheMatch} error={errors.mom} onChange={handleStatChange} />
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors duration-300">
            Create Player
        </button>
      </div>
    </form>
  );
};

export default CreatePlayerForm;
