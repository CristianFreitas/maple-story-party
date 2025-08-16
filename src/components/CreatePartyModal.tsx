'use client';

import { useState } from 'react';
import { usePlayerSession } from '@/hooks/usePlayerSession';
import { useLanguage } from '@/contexts/LanguageContext';
import { getAvailableBosses, servers } from '@/data/bosses';
import { X, Plus, Calendar, Users, MessageSquare } from 'lucide-react';

interface CreatePartyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreatePartyModal({ isOpen, onClose }: CreatePartyModalProps) {
  const { profile, createParty } = usePlayerSession();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    bossName: '',
    maxMembers: 6,
    server: profile?.server || '',
    scheduledTime: '',
    requirements: '',
    description: '',
  });

  const bosses = getAvailableBosses();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile) {
      alert(t.messages.profileNeeded);
      return;
    }

    if (!formData.bossName || !formData.server) {
      alert(t.messages.fillAllFields);
      return;
    }

    const partyData = {
      ...formData,
      currentMembers: 1,
      scheduledTime: formData.scheduledTime ? new Date(formData.scheduledTime).getTime() : undefined,
    };

    createParty(partyData);
    onClose();
    
    // Reset form
    setFormData({
      bossName: '',
      maxMembers: 6,
      server: profile?.server || '',
      scheduledTime: '',
      requirements: '',
      description: '',
    });
  };

  const selectedBoss = bosses.find(boss => boss.name === formData.bossName);

  if (!isOpen) return null;

  if (!profile) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="maple-panel max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-display font-bold text-maple-dark mb-4">
            Perfil Necessário
          </h2>
          <p className="text-gray-600 mb-6">
            Você precisa criar um perfil antes de criar uma party!
          </p>
          <button
            onClick={onClose}
            className="maple-button px-6 py-2"
          >
            Entendi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="maple-panel max-w-2xl w-full max-h-[90vh] overflow-y-auto" style={{ maxHeight: 'calc(100vh - 2rem)' }}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Plus className="w-6 h-6 text-maple-blue" />
              <h2 className="text-2xl font-display font-bold text-maple-dark">
                Criar Nova Party
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Boss Selection */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                Boss *
              </label>
              <select
                value={formData.bossName}
                onChange={(e) => setFormData(prev => ({ ...prev, bossName: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
                required
              >
                <option value="">Selecione um boss</option>
                {bosses.map(boss => (
                  <option key={boss.id} value={boss.name}>
                    {boss.icon} {boss.name} ({boss.difficulty}) - Lv.{boss.level}
                  </option>
                ))}
              </select>
              
              {selectedBoss && (
                <div className="mt-2 p-3 bg-maple-light rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-2xl">{selectedBoss.icon}</span>
                    <div>
                      <h4 className="font-bold text-maple-dark">{selectedBoss.name}</h4>
                      <p className="text-sm text-gray-600">
                        {selectedBoss.difficulty.charAt(0).toUpperCase() + selectedBoss.difficulty.slice(1)} • 
                        Level {selectedBoss.level} • 
                        {selectedBoss.estimatedTime}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">{selectedBoss.description}</p>
                  {selectedBoss.requirements && (
                    <p className="text-xs text-maple-blue mt-1">
                      <strong>Requisitos:</strong> {selectedBoss.requirements}
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Server */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                Servidor *
              </label>
              <select
                value={formData.server}
                onChange={(e) => setFormData(prev => ({ ...prev, server: e.target.value }))}
                className="w-full px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
                required
              >
                <option value="">Selecione um servidor</option>
                {servers.map(server => (
                  <option key={server} value={server}>{server}</option>
                ))}
              </select>
            </div>

            {/* Max Members */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                Máximo de Membros
              </label>
              <div className="flex items-center space-x-4">
                <input
                  type="range"
                  min="2"
                  max={selectedBoss?.maxPartySize || 6}
                  value={formData.maxMembers}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxMembers: parseInt(e.target.value) }))}
                  className="flex-1"
                />
                <div className="flex items-center space-x-2 text-maple-dark">
                  <Users className="w-5 h-5" />
                  <span className="font-bold text-lg">{formData.maxMembers}</span>
                </div>
              </div>
              {selectedBoss && (
                <p className="text-xs text-gray-600 mt-1">
                  Este boss suporta até {selectedBoss.maxPartySize} jogadores
                </p>
              )}
            </div>

            {/* Scheduled Time */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                Horário Agendado (opcional)
              </label>
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5 text-maple-blue" />
                <input
                  type="datetime-local"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  className="flex-1 px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
                  min={new Date().toISOString().slice(0, 16)}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Deixe vazio se o horário for flexível
              </p>
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                Requisitos (opcional)
              </label>
              <input
                type="text"
                value={formData.requirements}
                onChange={(e) => setFormData(prev => ({ ...prev, requirements: e.target.value }))}
                placeholder="Ex: Level 180+, experiência com o boss..."
                className="w-full px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-maple-dark mb-2">
                Descrição (opcional)
              </label>
              <div className="flex items-start space-x-2">
                <MessageSquare className="w-5 h-5 text-maple-blue mt-2" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Descrição da party, estratégias, observações..."
                  rows={3}
                  className="flex-1 px-4 py-2 border-2 border-maple-blue rounded-lg focus:outline-none focus:border-maple-orange resize-none"
                />
              </div>
            </div>

            {/* Host Info */}
            <div className="bg-maple-light p-4 rounded-lg">
              <h4 className="font-bold text-maple-dark mb-2">👑 Você será o host desta party</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Personagem:</strong> {profile.name}
                </div>
                <div>
                  <strong>Level:</strong> {profile.level}
                </div>
                <div>
                  <strong>Classe:</strong> {profile.job}
                </div>
                <div>
                  <strong>Servidor:</strong> {profile.server}
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 rounded-lg text-gray-700 hover:border-gray-400"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="maple-button px-6 py-2 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Criar Party</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

