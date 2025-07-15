import type { User } from "@/types/user";
import type { Note } from "@/types/note";
import {
  serverApi,
  clientApi,
  ServerBoolResponse,
  type GetNotesRequest,
} from "./api";

export interface RegisterRequest {
  email: string;
  password: string;
  message?: string;
}
export async function register(data: RegisterRequest): Promise<User> {
  const res = await clientApi.post<User>("/auth/register", data);
  return res.data;
}
export interface LoginRequest {
  email: string;
  password: string;
  message?: string;
}
export async function login(data: LoginRequest): Promise<User> {
  const res = await clientApi.post<User>("/auth/login", data);
  return res.data;
}

export async function logout(): Promise<void> {
  await clientApi.post("/auth/logout");
}
export async function getMe(): Promise<User> {
  const res = await clientApi.get<User>("/users/me");
  return res.data;
}

export const checkSession = async () => {
  const res = await clientApi.get<ServerBoolResponse>("/auth/session", {
    withCredentials: true,
  });
  return res;
};
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
  const response = await serverApi.get<GetNotesResponse>(
    "notes/",
    noteSearchParams
  );

  return response.data;
}
export type GetNotesResponse = {
  notes: Note[];
  totalPages: number;
};
export async function fetchNoteById(id: number): Promise<Note> {
  const response = await serverApi.get<Note>(`notes/${id}`, {
    withCredentials: true,
  });
  return response.data;
}
export async function createNote(note: FormData): Promise<Note> {
  const response = await serverApi.post<Note>("notes/", note);
  return response.data;
}

export async function removeNote(id: string): Promise<Note> {
  const response = await serverApi.delete<Note>(`notes/${id}`, {
    withCredentials: true,
  });
  return response.data;
}
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
  const response = await clientApi.patch<NewUserDataResponse>(
    "users/me",
    newData,
    { withCredentials: true }
  );

  return response.data;
}
