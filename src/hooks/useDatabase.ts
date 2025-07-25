import { useState, useEffect } from 'react';
import { sql } from '../lib/neon';
import { Player, SpinResult } from '../types/database';

export function useDatabase() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [results, setResults] = useState<SpinResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Load players from Neon database
  const loadPlayers = async () => {
    try {
      if (!sql) {
        // Fallback to localStorage if no database connection
        const savedPlayers = localStorage.getItem('football-wheel-players');
        if (savedPlayers) {
          const playerNames = JSON.parse(savedPlayers);
          setPlayers(playerNames.map((name: string, index: number) => ({
            id: `local-${index}`,
            name,
            created_at: new Date().toISOString()
          })));
        }
        return;
      }
      const data = await sql`SELECT * FROM players ORDER BY name`;
      setPlayers(data.map(row => ({
        id: row.id,
        name: row.name,
        created_at: row.created_at
      })));
    } catch (error) {
      console.warn('Error loading players:', error);
      // Fallback to localStorage if database fails
      const savedPlayers = localStorage.getItem('football-wheel-players');
      if (savedPlayers) {
        const playerNames = JSON.parse(savedPlayers);
        setPlayers(playerNames.map((name: string, index: number) => ({
          id: `local-${index}`,
          name,
          created_at: new Date().toISOString()
        })));
      }
    }
  };

  // Load results from Neon database
  const loadResults = async () => {
    try {
      if (!sql) {
        // Fallback to localStorage if no database connection
        const savedResults = localStorage.getItem('football-wheel-results');
        if (savedResults) {
          const localResults = JSON.parse(savedResults);
          setResults(localResults.map((r: any) => ({
            id: r.id,
            player_name: r.player,
            result: r.result,
            timestamp: r.timestamp,
            created_at: r.timestamp
          })));
        }
        return;
      }
      const data = await sql`SELECT * FROM spin_results ORDER BY created_at DESC LIMIT 50`;
      setResults(data.map(row => ({
        id: row.id,
        player_name: row.player_name,
        result: row.result,
        timestamp: row.timestamp,
        created_at: row.created_at
      })));
    } catch (error) {
      console.warn('Database not ready, using localStorage fallback:', error);
      // Fallback to localStorage if database fails
      const savedResults = localStorage.getItem('football-wheel-results');
      if (savedResults) {
        const localResults = JSON.parse(savedResults);
        setResults(localResults.map((r: any) => ({
          id: r.id,
          player_name: r.player,
          result: r.result,
          timestamp: r.timestamp,
          created_at: r.timestamp
        })));
      }
    }
  };

  // Add player to Neon database
  const addPlayer = async (name: string) => {
    try {
      if (!sql) {
        // Fallback to localStorage if no database connection
        const newPlayer = {
          id: `local-${Date.now()}`,
          name,
          created_at: new Date().toISOString()
        };
        const updatedPlayers = [...players, newPlayer];
        setPlayers(updatedPlayers);
        const playerNames = updatedPlayers.map(p => p.name);
        localStorage.setItem('football-wheel-players', JSON.stringify(playerNames));
        return true;
      }
      
      const result = await sql`
        INSERT INTO players (name) 
        VALUES (${name}) 
        RETURNING *
      `;
      const newPlayer = {
        id: result[0].id,
        name: result[0].name,
        created_at: result[0].created_at
      };
      setPlayers([...players, newPlayer]);
      return true;
    } catch (error) {
      console.warn('Error adding player to database, trying localStorage fallback:', error);
      // Fallback to localStorage if database fails
      const newPlayer = {
        id: `local-${Date.now()}`,
        name,
        created_at: new Date().toISOString()
      };
      const updatedPlayers = [...players, newPlayer];
      setPlayers(updatedPlayers);
      const playerNames = updatedPlayers.map(p => p.name);
      localStorage.setItem('football-wheel-players', JSON.stringify(playerNames));
      return true;
    }
  };

  // Remove player from Neon database
  const removePlayer = async (id: string) => {
    try {
      if (!sql) {
        // Fallback to localStorage if no database connection
        const playerToRemove = players.find(p => p.id === id);
        if (playerToRemove) {
          const updatedPlayers = players.filter(p => p.id !== id);
          setPlayers(updatedPlayers);
          const playerNames = updatedPlayers.map(p => p.name);
          localStorage.setItem('football-wheel-players', JSON.stringify(playerNames));
        }
        return true;
      }
      await sql`DELETE FROM players WHERE id = ${id}`;
      setPlayers(players.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.warn('Error removing player from database, trying localStorage fallback:', error);
      // Fallback to localStorage if database fails
      const playerToRemove = players.find(p => p.id === id);
      if (playerToRemove) {
        const updatedPlayers = players.filter(p => p.id !== id);
        setPlayers(updatedPlayers);
        const playerNames = updatedPlayers.map(p => p.name);
        localStorage.setItem('football-wheel-players', JSON.stringify(playerNames));
        return true;
      }
      return false;
    }
  };

  // Add spin result to Neon database
  const addResult = async (playerName: string, result: string) => {
    try {
      if (!sql) {
        // Fallback to localStorage if no database connection
        const timestamp = new Date().toISOString();
        const newResult = {
          id: `local-${Date.now()}`,
          player_name: playerName,
          result,
          timestamp,
          created_at: timestamp
        };
        const updatedResults = [newResult, ...results];
        setResults(updatedResults);
        localStorage.setItem('football-wheel-results', JSON.stringify(updatedResults));
        return true;
      }
      
      const timestamp = new Date().toISOString();
      const dbResult = await sql`
        INSERT INTO spin_results (player_name, result, timestamp) 
        VALUES (${playerName}, ${result}, ${timestamp}) 
        RETURNING *
      `;
      const newResult = {
        id: dbResult[0].id,
        player_name: dbResult[0].player_name,
        result: dbResult[0].result,
        timestamp: dbResult[0].timestamp,
        created_at: dbResult[0].created_at
      };
      setResults([newResult, ...results]);
      return true;
    } catch (error) {
      console.warn('Error adding result to database, trying localStorage fallback:', error);
      // Fallback to localStorage if database fails
      const timestamp = new Date().toISOString();
      const newResult = {
        id: `local-${Date.now()}`,
        player_name: playerName,
        result,
        timestamp,
        created_at: timestamp
      };
      const updatedResults = [newResult, ...results];
      setResults(updatedResults);
      localStorage.setItem('football-wheel-results', JSON.stringify(updatedResults));
      return true;
    }
  };

  // Clear all results from Neon database
  const clearResults = async () => {
    try {
      await sql`DELETE FROM spin_results`;
      setResults([]);
      return true;
    } catch (error) {
      console.error('Error clearing results:', error);
      // Fallback to localStorage if database fails
      setResults([]);
      localStorage.removeItem('football-wheel-results');
      return true;
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      setLoading(true);
      await Promise.all([loadPlayers(), loadResults()]);
      setLoading(false);
    };

    initializeData();
  }, []);

  return {
    players,
    results,
    loading,
    addPlayer,
    removePlayer,
    addResult,
    clearResults,
    refreshData: () => Promise.all([loadPlayers(), loadResults()])
  };
}