import { delay } from '@/utils/delay';

const VALID_EMAIL = 'demo@gamemirror.app';
const VALID_PASSWORD = '123456';

export interface MockAuthResponse {
  accessToken: string;
  user: { id: string; name: string; email: string };
}

export const loginMock = async (email: string, password: string): Promise<MockAuthResponse> => {
  await delay(700);

  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    return {
      accessToken: 'mock-token-123',
      user: { id: 'user-1', name: 'Jogador Pro', email },
    };
  }

  throw new Error('Credenciais inválidas. Use demo@gamemirror.app / 123456.');
};

export const signupMock = async (name: string, email: string, password: string): Promise<MockAuthResponse> => {
  await delay(900);

  if (!name || !email || !password) {
    throw new Error('Preencha todos os campos para criar a conta.');
  }

  return {
    accessToken: 'mock-token-new-user',
    user: { id: 'user-new', name, email },
  };
};
