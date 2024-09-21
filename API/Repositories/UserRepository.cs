using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;

namespace API.Repositories
{
    public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
    {
        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await context.AppUsers.Where(a => a.UserName == username.ToLower())
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }

        public async Task<List<MemberDto>?> GetMembersAsync()
        {
            return await context.AppUsers.ProjectTo<MemberDto>(mapper.ConfigurationProvider).ToListAsync();
        }

        public async Task<AppUser?> GetUserAsync(int id)
        {
            return await context.AppUsers.FindAsync(id);
        }

        public async Task<AppUser?> GetUserAsync(string name)
        {
            return await context.AppUsers.Include(a => a.Photos).SingleOrDefaultAsync(a => a.UserName == name);
        }

        public async Task<List<AppUser>> GetUsersAsync()
        {
            return await context.AppUsers.Include(a => a.Photos).ToListAsync();
        }

        public async Task<bool> SaveAllAsync()
        {
            return await context.SaveChangesAsync() > 0;
        }

        public void UpdateUserAsync(AppUser user)
        {
            context.Entry(user).State = EntityState.Modified;
        }
    }
}
