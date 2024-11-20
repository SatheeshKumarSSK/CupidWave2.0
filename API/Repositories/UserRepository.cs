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
    public class UserRepository(DataContext context, IMapper mapper) : IUserRepository
    {
        public async Task<MemberDto?> GetMemberAsync(string username)
        {
            return await context.AppUsers.Where(a => a.UserName == username.ToLower())
                .ProjectTo<MemberDto>(mapper.ConfigurationProvider).SingleOrDefaultAsync();
        }

        public async Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams)
        {
            var query = context.AppUsers.AsQueryable();

            query = query.Where(x => x.UserName != userParams.CurrentUserName);

            if (userParams.Gender != null) query = query.Where(q => q.Gender == userParams.Gender);

            var minDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MaxAge));
            var maxDob = DateOnly.FromDateTime(DateTime.Today.AddYears(-userParams.MinAge));

            query = query.Where(x => x.DateOfBirth >= minDob && x.DateOfBirth <= maxDob);

            query = userParams.OrderBy switch
            {
                "created" => query.OrderByDescending(x => x.Created),
                _ => query.OrderByDescending(y => y.LastActive)
            };

            return await PagedList<MemberDto>.CreateAsync(query.ProjectTo<MemberDto>(mapper.ConfigurationProvider),
                userParams.PageNumber, userParams.PageSize);
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
