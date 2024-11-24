import { Photo } from "./photo";

export interface Member {
    id: number;
    username: string;
    age: number;
    photoUrl: string | null;
    knownAs: string | null;
    created: Date;
    lastActive: Date;
    gender: string | null;
    introduction: string | null;
    interests: string | null;
    lookingFor: string | null;
    city: string | null;
    country: string | null;
    photos: Photo[] | null;
}