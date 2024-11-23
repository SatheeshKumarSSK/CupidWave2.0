import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Member } from '../_models/member';
import { of, tap } from 'rxjs';
import { Photo } from '../_models/photo';
import { PaginatedResult } from '../_models/pagination';
import { UserParams } from '../_models/userParams';
import { AccountService } from './account.service';
import { getPaginationHeaders, setPaginatedResponse } from './paginationHelpers';

@Injectable({
  providedIn: 'root'
})
export class MembersService {
  private http = inject(HttpClient);
  private accountService = inject(AccountService);
  baseUrl = environment.apiUrl;
  paginatedResult = signal<PaginatedResult<Member[]> | null>(null);
  memberCache = new Map();
  user = this.accountService.currentUser();
  userParams = signal<UserParams>(new UserParams(this.user));
  // members = signal<Member[]>([]);

  resetUserParams() {
    this.userParams.set(new UserParams(this.accountService.currentUser()));
  }

  getMembers() {
    let members = this.memberCache.get(Object.values(this.userParams()).join('-'));
    if (members) return setPaginatedResponse(members, this.paginatedResult);

    let params = getPaginationHeaders(this.userParams().pageNumber, this.userParams().pageSize);

    params = params.append('minAge', this.userParams().minAge);
    params = params.append('maxAge', this.userParams().maxAge);
    params = params.append('gender', this.userParams().gender);
    params = params.append('orderBy', this.userParams().orderBy);

    return this.http.get<Member[]>(`${this.baseUrl}/users`, { observe: 'response', params }).subscribe({
      next: response => {
        // this.members.set(members);
        setPaginatedResponse(response, this.paginatedResult);
        this.memberCache.set(Object.values(this.userParams()).join('-'), response);
      }
    })
  }

  getMember(username: string) {
    // var member = this.members()?.find(m => m.username == username);
    // if (member) return of(member);
    const member: Member = [...this.memberCache.values()]
      .reduce((arr, element) => arr.concat(element.body), [])
      .find((m: Member) => m.username === username);

    if (member) return of(member);

    return this.http.get<Member>(`${this.baseUrl}/users/${username}`);
  }

  updateMember(member: Member) {
    return this.http.put(`${this.baseUrl}/users`, member).pipe(
      tap(() => {
        // this.members.update(members => members?.map(m => m.username === member.username ? member : m))
      })
    )
  }

  setMainPhoto(photo: Photo, isNew: boolean) {
    // if (isNew) {
    //   this.members.update(members => members?.map(m => {
    //     if (m.photos?.includes(photo)) {
    //       m.photoUrl = photo.url;
    //     }
    //     return m;
    //   }));
    // }
    return this.http.put(`${this.baseUrl}/users/set-main-photo/${photo.id}`, {}).pipe(
      // tap(() => {
      //   this.members.update(members => members?.map(m => {
      //     if (m.photos?.includes(photo)) {
      //       m.photoUrl = photo.url;
      //     }
      //     return m;
      //   }))
      // })
    );
  }

  deletePhoto(photo: Photo) {
    return this.http.delete(`${this.baseUrl}/users/delete-photo/${photo.id}`).pipe(
      // tap(() => {
      //   this.members.update(members => members?.map(m => {
      //     if (m.photos?.includes(photo)) {
      //       m.photos = m.photos?.filter(p => p.id !== photo.id) ?? [];
      //     }
      //     return m;
      //   }))
      // })
    );
  }
}
