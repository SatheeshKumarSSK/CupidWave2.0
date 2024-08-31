using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;

namespace API.Controllers
{
    [Authorize]
    public class UsersController(DataContext context) : BaseApiController
    {
        // GET: api/Users
        [HttpGet, AllowAnonymous]
        public async Task<ActionResult<IEnumerable<AppUser>>> GetAppUsers()
        {
            return await context.AppUsers.ToListAsync();
        }

        // GET: api/Users/5
        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetAppUser(int id)
        {
            var appUser = await context.AppUsers.FindAsync(id);

            if (appUser == null) return NotFound();

            return appUser;
        }
    }
}
