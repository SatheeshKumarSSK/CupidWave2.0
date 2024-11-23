using API.Data;
using API.DTOs;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class LikesRepository(DataContext context, IMapper mapper) : ILikesRepository
    {
        public void AddLike(UserLike like)
        {
            context.Likes.Add(like);
        }

        public void DeleteLike(UserLike like)
        {
            context.Likes.Remove(like);
        }

        public async Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId)
        {
            return await context.Likes.Where(l => l.SourceUserId == currentUserId).Select(l => l.TargetUserId).ToListAsync();
        }

        public async Task<UserLike?> GetUserLike(int sourceUserId, int targerUserId)
        {
            return await context.Likes.FindAsync(sourceUserId, targerUserId);
        }

        public async Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams)
        {
            var likes = context.Likes.AsQueryable();
            IQueryable<MemberDto> query;

            switch (likesParams.Predicate)
            {
                case "liked":
                    query = likes.Where(l => l.SourceUserId == likesParams.UserId)
                        .Select(l => l.TargetUser)
                        .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                    break;

                case "likedBy":
                    query = likes.Where(l => l.TargetUserId == likesParams.UserId)
                        .Select(l => l.SourceUser)
                        .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                    break;

                default:
                    var likedIds = await GetCurrentUserLikeIds(likesParams.UserId);

                    query = likes.Where(l => l.TargetUserId == likesParams.UserId && likedIds.Contains(l.SourceUserId))
                        .Select(l => l.SourceUser)
                        .ProjectTo<MemberDto>(mapper.ConfigurationProvider);
                    break;
            }

            return await PagedList<MemberDto>.CreateAsync(query, likesParams.PageNumber, likesParams.PageSize);
        }

        public async Task<bool> SaveChanges()
        {
            return await context.SaveChangesAsync() > 0;
        }
    }
}
