export type FakeUser = { nome: string; email: string; senha: string };

export function fakeRegister(user: FakeUser): { success: boolean; message: string } {
  const users = JSON.parse(localStorage.getItem("fakeUsers") || "[]");
  if (users.find((u: FakeUser) => u.email === user.email)) {
    return { success: false, message: "E-mail já cadastrado" };
  }
  users.push(user);
  localStorage.setItem("fakeUsers", JSON.stringify(users));
  return { success: true, message: "Cadastro realizado com sucesso!" };
}

export function fakeLogin(email: string, senha: string): { success: boolean; message: string } {
  const users = JSON.parse(localStorage.getItem("fakeUsers") || "[]");
  const user = users.find((u: FakeUser) => u.email === email && u.senha === senha);
  if (user) {
    localStorage.setItem("fakeLoggedUser", JSON.stringify(user));
    localStorage.setItem("token", "fake-token");
    return { success: true, message: "Login realizado com sucesso!" };
  }
  return { success: false, message: "E-mail ou senha inválidos" };
}

export function fakeLogout(): void {
  localStorage.removeItem("fakeLoggedUser");
  localStorage.removeItem("token");
}
