// api/authApi.ts
export type AuthUser = {
  id?: number;
  nome?: string;
  name?: string;
  email: string;
  tipo?: "CLIENT" | "COLLECTOR" | "ADMIN";
  cnpj?: string;
};

export type AuthResult<T = any> = {
  success: boolean;
  message: string;
  data?: T;
};

const API_BASE_URL = "http://localhost:3000/api/v1";

export async function loginApi(
  email: string,
  senha: string
): Promise<AuthResult<{ token: string; user: AuthUser }>> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: senha }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: body.message || "Erro ao fazer login.",
      };
    }

    const { token, user } = body;

    localStorage.setItem("token", token);
    localStorage.setItem("loggedUser", JSON.stringify(user));

    return {
      success: true,
      message: "Login realizado com sucesso!",
      data: { token, user },
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível conectar ao servidor.",
    };
  }
}

export async function registerApi(params: {
  cnpj: string;
  nome: string;
  endereco: string;
  email: string;
  senha: string;
}): Promise<AuthResult> {
  try {
    const res = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: params.nome,
        email: params.email,
        password: params.senha,
        cnpj: params.cnpj,
        address: params.endereco,
      }),
    });

    const body = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: body.message || "Erro ao realizar cadastro.",
      };
    }

    return {
      success: true,
      message: body.message || "Cadastro realizado com sucesso!",
    };
  } catch {
    return {
      success: false,
      message: "Não foi possível conectar ao servidor.",
    };
  }
}

export function logoutApi() {
  localStorage.removeItem("token");
  localStorage.removeItem("loggedUser");
}

export function getLoggedUser(): AuthUser | null {
  const raw = localStorage.getItem("loggedUser");
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
