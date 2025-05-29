import { BASEURL } from "constants/base-url";
import type { Route } from "./+types/home";
import { useEffect, useState } from "react";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Website" },
    { name: "description", content: "Crud users and auth" },
  ];
}

const TOKEN =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjUxYWQ1NzczLTZlZjEtNDAxZC04MGFkLTAxY2UyZjEyMTdmNCIsImlhdCI6MTc0ODUyMTg2NX0.Gh-LSCee6GoLnI1SQk8IjE5pOS3W-3llBIqxIQ2S6no";

type User = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = () => {
    setLoading(true);
    setError(null);

    fetch(`${BASEURL}/users`, {
      headers: {
        Authorization: TOKEN,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Erro ao buscar usuários.");
        return res.json();
      })
      .then((data: User[]) => {
        setUsers(data);
      })
      .catch((err) => {
        setError(err.message || "Erro desconhecido");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    try {
      setLoading(true);
      if (editId) {
        const res = await fetch(`${BASEURL}/users/${editId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: TOKEN,
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) throw new Error("Erro ao atualizar usuário.");
      } else {
        const res = await fetch(`${BASEURL}/users`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: TOKEN,
          },
          body: JSON.stringify({ name, email, password }),
        });

        if (!res.ok) throw new Error("Erro ao criar usuário.");
      }

      setName("");
      setEmail("");
      setEditId(null);
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: User) => {
    setName(user.name);
    setEmail(user.email);
    setEditId(user.id);
  };

  const handleDelete = async (id: string) => {
    const confirm = window.confirm("Deseja realmente excluir este usuário?");
    if (!confirm) return;

    try {
      setLoading(true);
      const res = await fetch(`${BASEURL}/users/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: TOKEN,
        },
      });

      if (!res.ok) throw new Error("Erro ao excluir usuário.");
      fetchUsers();
    } catch (err: any) {
      setError(err.message || "Erro ao excluir");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 mx-auto">
      <h2 className="text-2xl font-bold mb-4">Dashboard - CRUD de Usuários</h2>

      {loading && <p>Carregando...</p>}
      {error && <p className="text-red-600 mb-4">Erro: {error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        <input
          type="text"
          placeholder="Nome"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={loading}
        />
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Palavra-passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full"
          disabled={loading}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {editId ? "Atualizar Usuário" : "Adicionar Usuário"}
        </button>
      </form>

      <table className="w-full border-collapse border">
        <thead>
          <tr>
            <th className="border p-2">Nome</th>
            <th className="border p-2">E-mail</th>
            <th className="border p-2">Criado em</th>
            <th className="border p-2">Ações</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="text-center">
              <td className="border p-2">{user.name}</td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                {new Date(user.createdAt).toLocaleString("pt-BR", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                })}
              </td>
              <td className="border p-2 space-x-2">
                <button
                  onClick={() => handleEdit(user)}
                  className="text-blue-500"
                  disabled={loading}
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500"
                  disabled={loading}
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
          {users.length === 0 && !loading && (
            <tr>
              <td colSpan={4} className="text-center p-4">
                Nenhum usuário encontrado.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
