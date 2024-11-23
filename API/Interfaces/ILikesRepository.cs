using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface ILikesRepository
    {
        void AddLike(UserLike like);
        void DeleteLike(UserLike like);
        Task<IEnumerable<int>> GetCurrentUserLikeIds(int currentUserId);
        Task<UserLike?> GetUserLike(int sourceUserId, int targerUserId);
        Task<PagedList<MemberDto>> GetUserLikes(LikesParams likesParams);
        Task<bool> SaveChanges();
    }
}
