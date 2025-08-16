// API Service para comunicação com o backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Função helper para fazer requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Player API
export const playerApi = {
  // Criar ou atualizar player
  async createOrUpdate(playerData: any): Promise<ApiResponse<any>> {
    return apiRequest('/players', {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  },

  // Buscar player por uniqueId
  async getByUniqueId(uniqueId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/players/by-unique-id/${uniqueId}`);
  },

  // Buscar player por ID
  async getById(id: string): Promise<ApiResponse<any>> {
    return apiRequest(`/players/${id}`);
  },

  // Buscar players por servidor
  async getByServer(server: string, page: number = 1, limit: number = 20): Promise<PaginatedResponse<any>> {
    return apiRequest(`/players/server/${server}?page=${page}&limit=${limit}`);
  },

  // Atualizar atividade
  async updateActivity(id: string): Promise<ApiResponse<any>> {
    return apiRequest(`/players/${id}/activity`, {
      method: 'POST',
    });
  },
};

// Party API
export const partyApi = {
  // Listar parties
  async list(filters: {
    page?: number;
    limit?: number;
    server?: string;
    difficulty?: string;
    bossName?: string;
  } = {}): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    return apiRequest(`/parties?${params.toString()}`);
  },

  // Criar party
  async create(partyData: any): Promise<ApiResponse<any>> {
    return apiRequest('/parties', {
      method: 'POST',
      body: JSON.stringify(partyData),
    });
  },

  // Entrar em party
  async join(partyId: string, playerData: { playerId: string; playerName: string }): Promise<ApiResponse<any>> {
    return apiRequest(`/parties/${partyId}/join`, {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  },

  // Sair da party
  async leave(partyId: string, playerId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/parties/${partyId}/leave`, {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    });
  },

  // Convidar player
  async invite(partyId: string, playerName: string, invitedBy: string): Promise<ApiResponse<any>> {
    return apiRequest(`/parties/${partyId}/invite`, {
      method: 'POST',
      body: JSON.stringify({ playerName, invitedBy }),
    });
  },

  // Listar convites pendentes
  async getInvites(playerId: string): Promise<ApiResponse<any[]>> {
    return apiRequest(`/parties/invites/${playerId}`);
  },

  // Responder a convite
  async respondToInvite(inviteId: string, response: 'accept' | 'decline', playerId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/parties/invites/${inviteId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response, playerId }),
    });
  },
};

// Buff API
export const buffApi = {
  // Listar agendamentos
  async list(filters: {
    page?: number;
    limit?: number;
    server?: string;
    buffType?: string;
  } = {}): Promise<PaginatedResponse<any>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined) {
        params.append(key, value.toString());
      }
    });
    
    return apiRequest(`/buffs?${params.toString()}`);
  },

  // Criar agendamento
  async create(buffData: {
    playerId: string;
    playerName: string;
    server: string;
    buffType: 'exp' | 'drop' | 'burning' | 'other';
    scheduledTime: number;
    location: string;
    description?: string;
  }): Promise<ApiResponse<any>> {
    return apiRequest('/buffs', {
      method: 'POST',
      body: JSON.stringify(buffData),
    });
  },

  // Votar em agendamento
  async vote(scheduleId: string, voteData: {
    voterId: string;
    voteType: 'upvote' | 'downvote' | 'report';
    reason?: string;
  }): Promise<ApiResponse<any>> {
    return apiRequest(`/buffs/${scheduleId}/vote`, {
      method: 'POST',
      body: JSON.stringify(voteData),
    });
  },

  // Confirmar uso do buff
  async confirm(scheduleId: string, playerId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/buffs/${scheduleId}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ playerId }),
    });
  },

  // Cancelar agendamento
  async cancel(scheduleId: string, playerId: string): Promise<ApiResponse<any>> {
    return apiRequest(`/buffs/${scheduleId}`, {
      method: 'DELETE',
      body: JSON.stringify({ playerId }),
    });
  },

  // Buscar agendamentos do player
  async getPlayerSchedules(playerId: string): Promise<ApiResponse<any[]>> {
    return apiRequest(`/buffs/player/${playerId}`);
  },

  // Obter estatísticas
  async getStats(server?: string): Promise<ApiResponse<any>> {
    const params = server ? `?server=${server}` : '';
    return apiRequest(`/buffs/stats${params}`);
  },
};

// WebSocket connection helper
export class ApiWebSocket {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;

  constructor(private url: string = 'ws://localhost:3002') {}

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.ws = new WebSocket(this.url);

        this.ws.onopen = () => {
          console.log('WebSocket connected');
          this.reconnectAttempts = 0;
          resolve();
        };

        this.ws.onclose = () => {
          console.log('WebSocket disconnected');
          this.handleReconnect();
        };

        this.ws.onerror = (error) => {
          console.error('WebSocket error:', error);
          reject(error);
        };
      } catch (error) {
        reject(error);
      }
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        console.log(`Reconnecting WebSocket (attempt ${this.reconnectAttempts})`);
        this.connect();
      }, 1000 * this.reconnectAttempts);
    }
  }

  joinServer(server: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'join-server', server }));
    }
  }

  joinParty(partyId: string) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type: 'join-party', partyId }));
    }
  }

  onMessage(callback: (data: any) => void) {
    if (this.ws) {
      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          callback(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export default {
  player: playerApi,
  party: partyApi,
  buff: buffApi,
  WebSocket: ApiWebSocket,
};
