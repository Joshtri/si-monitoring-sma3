export interface Guru {
  id: string;
  nama: string;
  nip: string;
  userId: string;
}


export interface User {
  id: string;
  username: string;
  email: string;
  phoneNumber?: string;
  role: string;
}

export interface Guru {
  id: string;
  nama: string;
  nip: string;
  userId: string;
}

export interface GuruWithUser extends Guru {
  user: User;
}