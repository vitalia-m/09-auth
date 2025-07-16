import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import {
  type GetNotesRequest,
  type GetNotesResponse,
  nextServer,
  type ServerBoolResponse,
} from "./api";

// --- Register ---
export interface RegisterRequest {
  email: string;
  password: string;
  message?: string;
}
export type RegisterResponse = {
  email?: string;
  password?: string;
  message?: string;
};

export async function register(data: RegisterRequest): Promise<User> {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
}
// --- Login ---
export interface LoginRequest {
  email: string;
  password: string;
  message?: string;
}
export type LoginResponse = {
  username?: string;
  email?: string;
  avatar?: string;
  message?: string;
};
export async function login(data: LoginRequest): Promise<User> {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
}
// --- Logout ---
export type LogoutResponse = {
  message?: string;
};

export const logout = async () => {
  const res = await nextServer.post<LogoutResponse>("/auth/logout");
  return res.data;
};
// --- Get Current User ---
export async function getMe(): Promise<User> {
  const res = await nextServer.get<User>("/users/me");
  return res.data;
}
// --- Session Check ---
export const checkSession = async () => {
  const res = await nextServer.get<ServerBoolResponse>("/auth/session", {
    withCredentials: true,
  });
  return res;
};
// --- Fetch Notes ---
export async function fetchNotes(
  query: string,
  page: number,
  tag?: string | undefined
): Promise<GetNotesResponse> {
  const noteSearchParams: GetNotesRequest = {
    params: {
      page,
      perPage: 12,
      tag,
    },
    withCredentials: true,
  };
  if (query.trim() !== "") {
    noteSearchParams.params.search = query.trim();
  }
  const response = await nextServer.get<GetNotesResponse>(
    "notes/",
    noteSearchParams
  );

  return response.data;
}
// --- Fetch Note by ID ---
export async function fetchNoteById(id: number): Promise<Note> {
  const response = await nextServer.get<Note>(`notes/${id}`, {
    withCredentials: true,
  });
  return response.data;
}
// --- Create Note ---
export async function createNote(note: FormData): Promise<Note> {
  const response = await nextServer.post<Note>("notes/", note);
  return response.data;
}
// --- Remove Note ---
export async function removeNote(id: string): Promise<Note> {
  const response = await nextServer.delete<Note>(`notes/${id}`, {
    withCredentials: true,
  });
  return response.data;
}
// --- Edit User ---
export type NewUserData = {
  email: string;
  username: string;
};

export type NewUserDataResponse = {
  username: string;
  email: string;
  avatar: string;
};

export async function editUser(
  newData: NewUserData
): Promise<NewUserDataResponse> {
  const response = await nextServer.patch<NewUserDataResponse>(
    "users/me",
    newData,
    { withCredentials: true }
  );

  return response.data;
}
