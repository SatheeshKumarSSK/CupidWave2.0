import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { PaginatedResult } from '../_models/pagination';
import { getPaginationHeaders, setPaginatedResponse } from './paginationHelpers';

@Injectable({
  providedIn: 'root'
})
export class LikesService {
  private http = inject(HttpClient);
  baseUrl = environment.apiUrl;
  likedIds = signal<number[]>([]);
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);

  toggleLike(targetId: number) {
    return this.http.post(`${this.baseUrl}/likes/${targetId}`, {});
  }

  getUserLikes(predicate: string, pageNumber: number, pageSize: number) {
    let params = getPaginationHeaders(pageNumber, pageSize);

    params = params.append('predicate', predicate);

    return this.http.get<Member[]>(`${this.baseUrl}/likes`, { observe: 'response', params }).subscribe({
      next: response => {
        setPaginatedResponse(response, this.paginatedResult);
      }
    });
  }

  getLikeIds() {
    return this.http.get<number[]>(`${this.baseUrl}/likes/list`).subscribe({
      next: ids => this.likedIds.set(ids)
    })
  }
}
