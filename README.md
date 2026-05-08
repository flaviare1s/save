# 💰 Save

> Controle seus gastos, organize suas finanças, compreenda seus hábitos de consumo

[![Deploy Status](https://img.shields.io/badge/Deploy-Live-success)](https://save-4089e.web.app/)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)

## 📋 Sobre o Projeto

**Save** é uma aplicação web desenvolvida para o hackathon da ADA que ajuda pessoas a:

- ✅ Acompanhar hábitos de consumo e gastos pessoais
- ✅ Organizar metas financeiras realistas
- ✅ Visualizar insights detalhados sobre gastos por categoria
- ✅ Tomar decisões financeiras mais informadas

O projeto fornece uma interface intuitiva e responsiva para gerenciamento financeiro pessoal, permitindo que usuários tenham melhor controle sobre suas despesas e entendam seus padrões de gastos.

## 🚀 Acesso Rápido

Acesse a aplicação em produção: **[save-4089e.web.app](https://save-4089e.web.app/)**

## 🛠️ Tecnologias

- **Frontend Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Visualização de Dados**: Chart.js
- **Backend & Database**: Firebase
  - Authentication
  - Cloud Firestore
  - Hosting
- **Linting**: ESLint

## 📋 Pré-requisitos

- Node.js (v16 ou superior)
- npm ou yarn
- Conta Firebase (para variáveis de ambiente)

## 🏃 Como Rodar Localmente

### 1. Clonar o repositório

```bash
git clone <repository-url>
cd save
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `config.ts` na pasta firebase com suas credenciais Firebase:

```
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "1",
  measurementId: "",
```

### 4. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

### 5. Build de produção

```bash
npm run build
```

### 6. Preview do build

```bash
npm run preview
```

## 📁 Estrutura do Projeto

```
src/
├── components/        # Componentes React reutilizáveis
├── contexts/          # Context API para gerenciamento de estado
├── firebase/          # Configuração e serviços Firebase
├── layouts/           # Layouts principais da aplicação
├── pages/             # Páginas da aplicação
├── routes/            # Configuração de rotas
├── utils/             # Funções utilitárias
└── App.tsx            # Componente principal
```

## 👥 Equipe de Desenvolvimento

 
- [Flávia Reis de Almeida](https://github.com/flaviare1s)
- [Izabella Maria Pessoa Lins](https://github.com/izabella-m)
- [Mayara Amâncio Zaltrão](https://github.com/maayamancio/maayamancio)

## 📝 Scripts Disponíveis

| Comando           | Descrição                          |
| ----------------- | ---------------------------------- |
| `npm run dev`     | Inicia servidor de desenvolvimento |
| `npm run build`   | Gera build de produção             |
| `npm run preview` | Visualiza build localmente         |
| `npm run lint`    | Executa ESLint                     |

## 🤝 Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um Fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abra um Pull Request

--- 

Este projeto foi desenvolvido para o hackathon da ADA.
