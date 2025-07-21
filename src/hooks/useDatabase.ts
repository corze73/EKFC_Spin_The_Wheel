import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Player, SpinResult } from '../types/database';

export function useDatabase() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [results, setResults] = useState<SpinResult[]>([]);
  const [loading, setLoading] = useState(true);

  // Load players from database
  const loadPlayers = async () => {
    try {
      const { data, error } = await supabase
        .from('players')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setPlayers(data || []);
    } catch (error) {
      console.error('Error loading players:', error);
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

  // Load results from database
  const loadResults = async () => {
    try {
      const { data, error } = await supabase
        .from('spin_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50);
      
      if (error) throw error;
      setResults(data || []);
    } catch (error) {
      console.error('Error loading results:', error);
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

  // Add player to database
  const addPlayer = async (name: string) => {
    try {
      const { data, error } = await supabase
        .from('players')
        .insert([{ name }])
        .select()
        .single();
      
      if (error) throw error;
      setPlayers([...players, data]);
      return true;
    } catch (error) {
      console.error('Error adding player:', error);
      return false;
    }
  };

  // Remove player from database
  const removePlayer = async (id: string) => {
    try {
      const { error } = await supabase
        .from('players')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPlayers(players.filter(p => p.id !== id));
      return true;
    } catch (error) {
      console.error('Error removing player:', error);
      return false;
    }
  };

  // Add spin result to database
  const addResult = async (playerName: string, result: string) => {
    try {
      const { data, error } = await supabase
        .from('spin_results')
        .insert([{
          player_name: playerName,
          result: result,
          timestamp: new Date().toISOString()
        }])
        .select()
        .single();
      
      if (error) throw error;
      setResults([data, ...results]);
      return true;
    } catch (error) {
      console.error('Error adding result:', error);
      return false;
    }
  };

  // Clear all results
  const clearResults = async () => {
    try {
      const { error } = await supabase
        .from('spin_results')
        .delete()
        .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
      
      if (error) throw error;
      setResults([]);
      return true;
    } catch (error) {
      console.error('Error clearing results:', error);
      return false;
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