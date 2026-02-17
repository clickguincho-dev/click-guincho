/* ============================================
   CLICK GUINCHO - FUNÇÕES JAVASCRIPT
   ============================================ */

// ===== GEOLOCALIZAÇÃO =====
function obterLocalizacao() {
    return new Promise((resolve, reject) => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        accuracy: position.coords.accuracy
                    });
                },
                (error) => {
                    reject(error);
                }
            );
        } else {
            reject(new Error("Geolocalização não suportada"));
        }
    });
}

// ===== ARMAZENAMENTO LOCAL =====
const Storage = {
    salvar: (chave, valor) => {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
            return true;
        } catch (e) {
            console.error('Erro ao salvar no localStorage:', e);
            return false;
        }
    },
    
    obter: (chave) => {
        try {
            const valor = localStorage.getItem(chave);
            return valor ? JSON.parse(valor) : null;
        } catch (e) {
            console.error('Erro ao ler do localStorage:', e);
            return null;
        }
    },
    
    remover: (chave) => {
        try {
            localStorage.removeItem(chave);
            return true;
        } catch (e) {
            console.error('Erro ao remover do localStorage:', e);
            return false;
        }
    }
};

// ===== DADOS DO USUÁRIO =====
const Usuario = {
    obterDados: () => {
        return Storage.obter('usuario') || {
            nome: 'Usuário',
            foto: 'https://via.placeholder.com/100',
            telefone: '',
            email: ''
        };
    },
    
    salvarDados: (dados) => {
        return Storage.salvar('usuario', dados);
    }
};

// ===== SOLICITAÇÃO DE GUINCHO =====
const Solicitacao = {
    criar: (dados) => {
        const solicitacao = {
            id: Date.now(),
            usuario: Usuario.obterDados(),
            servico: dados.servico || 'guincho-simples',
            localizacao: dados.localizacao,
            destino: dados.destino || null,
            localPerigoso: dados.localPerigoso || false,
            status: 'aguardando',
            dataHora: new Date().toISOString(),
            valor: dados.valor || 0
        };
        
        Storage.salvar('solicitacaoAtual', solicitacao);
        
        // Adicionar ao histórico
        const historico = Storage.obter('historico') || [];
        historico.unshift(solicitacao);
        Storage.salvar('historico', historico.slice(0, 50)); // Manter últimas 50
        
        return solicitacao;
    },
    
    obterAtual: () => {
        return Storage.obter('solicitacaoAtual');
    },
    
    atualizar: (status) => {
        const solicitacao = Solicitacao.obterAtual();
        if (solicitacao) {
            solicitacao.status = status;
            solicitacao.atualizadoEm = new Date().toISOString();
            Storage.salvar('solicitacaoAtual', solicitacao);
        }
        return solicitacao;
    },
    
    finalizar: () => {
        Storage.remover('solicitacaoAtual');
    }
};

// ===== NOTIFICAÇÕES =====
function mostrarNotificacao(mensagem, tipo = 'info') {
    // Criar elemento de notificação
    const notificacao = document.createElement('div');
    notificacao.className = `fixed top-20 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg z-50 transition-all duration-300 ${
        tipo === 'success' ? 'bg-green-500' :
        tipo === 'error' ? 'bg-red-500' :
        tipo === 'warning' ? 'bg-yellow-500' :
        'bg-blue-500'
    } text-white font-medium`;
    
    notificacao.textContent = mensagem;
    notificacao.style.opacity = '0';
    notificacao.style.transform = 'translate(-50%, -20px)';
    
    document.body.appendChild(notificacao);
    
    // Animar entrada
    setTimeout(() => {
        notificacao.style.opacity = '1';
        notificacao.style.transform = 'translate(-50%, 0)';
    }, 10);
    
    // Remover após 3 segundos
    setTimeout(() => {
        notificacao.style.opacity = '0';
        notificacao.style.transform = 'translate(-50%, -20px)';
        setTimeout(() => notificacao.remove(), 300);
    }, 3000);
}

// ===== FORMATAÇÃO =====
const Formatacao = {
    moeda: (valor) => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        }).format(valor);
    },
    
    data: (dataISO) => {
        return new Intl.DateTimeFormat('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(dataISO));
    },
    
    distancia: (metros) => {
        if (metros < 1000) {
            return `${Math.round(metros)}m`;
        }
        return `${(metros / 1000).toFixed(1)}km`;
    },
    
    tempo: (minutos) => {
        if (minutos < 60) {
            return `${minutos} min`;
        }
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        return `${horas}h ${mins}min`;
    }
};

// ===== VALIDAÇÕES =====
const Validacao = {
    telefone: (tel) => {
        const regex = /^\(?[1-9]{2}\)? ?(?:[2-8]|9[1-9])[0-9]{3}\-?[0-9]{4}$/;
        return regex.test(tel.replace(/\s/g, ''));
    },
    
    email: (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
};

// ===== DEBUG MODE =====
const DEBUG = true;

function log(...args) {
    if (DEBUG) {
        console.log('[Click Guincho]', ...args);
    }
}

// Exportar para uso global
window.ClickGuincho = {
    obterLocalizacao,
    Storage,
    Usuario,
    Solicitacao,
    mostrarNotificacao,
    Formatacao,
    Validacao,
    log
};
