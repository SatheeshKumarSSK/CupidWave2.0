using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        Task<List<AppUser>> GetUsersAsync();
        Task<AppUser?> GetUserAsync(int id);
        Task<AppUser?> GetUserAsync(string name);
        Task<bool> SaveAllAsync();
        void UpdateUserAsync(AppUser user);
        Task<MemberDto?> GetMemberAsync(string username);
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);
    }
}
