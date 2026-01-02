# 📅 EscalasIASD

Aplicativo para visualizar e gerenciar **escalas** de atividades da **Igreja**.

Este projeto contém a interface **front-end** do aplicativo e uma versão **APK publicada (v1.0)**.

---

## 🧠 Sobre

O **EscalasIASD** é uma aplicação desenvolvida para facilitar o acesso às escalas de serviços, cultos, eventos e atividades da Igreja diretamente no **celular ou navegador**.
> ⚠️ O site (versão web) ainda está em desenvolvimento.


Seu foco principal é tornar a consulta de horários mais **rápida, prática e organizada**, auxiliando tanto **membros** quanto **líderes da igreja**.

---

## 📦 Funcionalidades

### ✨ Principais recursos

- 📋 Visualização de escalas de eventos e cultos
- 📱 Interface intuitiva e responsiva para dispositivos móveis
- 📦 APK disponível para instalação  
- 🔄 Atualização dinâmica de dados (quando conectado à internet)

---

## 📁 Estrutura do Projeto

```text
EscalasIASD/
├─ EscalasFrontEnd/       # Código front-end principal (JavaScript)
├─ .gitattributes
├─ README.md              # Este arquivo
```

---

## 🛠️ Tecnologias Utilizadas

### ⚙️ Framework Principal

- **Expo (React Native)** – Framework utilizado para o desenvolvimento do aplicativo mobile multiplataforma (Android, iOS e Web)

### 🧩 Linguagens

- **JavaScript**
- **React**
- **React Native**

---

### 📚 Bibliotecas e Dependências

#### 📱 Interface e Navegação
- **react-native** – Base do aplicativo mobile  
- **react-native-elements** – Componentes prontos de UI  
- **@react-navigation/native** – Navegação entre telas  
- **@react-navigation/native-stack** – Navegação em pilha  
- **react-native-safe-area-context** – Ajuste de layout para áreas seguras  
- **react-native-screens** – Otimização de telas  
- **react-native-gesture-handler** – Gestos e interações  
- **react-native-reanimated** – Animações avançadas  
- **react-native-vector-icons** / **@expo/vector-icons** – Ícones do aplicativo  

#### 📆 Data, Hora e Formatação
- **@react-native-community/datetimepicker** – Seleção de data e horário  
- **react-native-mask-text** – Máscaras de texto (ex: datas, horários)

#### 💾 Armazenamento e Estado
- **@react-native-async-storage/async-storage** – Armazenamento local no dispositivo  

#### 🌐 Comunicação e Backend
- **axios** – Requisições HTTP  
- **jsonwebtoken** – Manipulação de tokens JWT  

#### 🧪 Expo e Utilitários
- **expo** – Núcleo do framework  
- **expo-application** – Informações do aplicativo  
- **expo-font** – Carregamento de fontes  
- **expo-status-bar** – Controle da Status Bar  
- **expo-updates** – Atualizações OTA (over-the-air)  
- **@expo/metro-runtime** – Runtime do Metro Bundler  

#### 🌍 Web
- **react-dom** – Renderização web  
- **react-native-web** – Compatibilidade com navegador  

#### 🔐 Segurança e Utilidades
- **react-native-get-random-values** – Geração de valores aleatórios seguros  
- **react-native-worklets** – Execução de código em threads separadas  

---

## 🌐 Backend e Infraestrutura

O **servidor (backend)** do projeto é desenvolvido em **Node.js**, sendo responsável pela comunicação entre o aplicativo e o banco de dados, além do gerenciamento de autenticação e regras de negócio.

### ⚙️ Tecnologias do Backend

- **Node.js** – Ambiente de execução do servidor  
- **Express.js** – Framework para criação da API  
- **JWT (JSON Web Token)** – Autenticação e segurança das requisições  

### ☁️ Hospedagem

- **Render** – Plataforma utilizada para hospedar o servidor backend, garantindo disponibilidade e escalabilidade da aplicação

### 🗄️ Banco de Dados

- **Supabase** – Utilizado como banco de dados principal e serviço de backend, fornecendo:
  - Banco de dados PostgreSQL
  - Autenticação
  - API segura para acesso aos dados
---

### 🧪 Ambiente de Desenvolvimento

- **Node.js**
- **npm**
- **Expo CLI**

