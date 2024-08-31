using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Cryptography;
using System.Text;

namespace API.Controllers
{
    public class AccountController(DataContext context, ITokenService tokenService) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (await UserExists(registerDto.UserName)) return BadRequest("UserName is taken");

            using var hmac = new HMACSHA512();

            var user = new AppUser()
            {
                UserName = registerDto.UserName.ToLower(),
                PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
                PasswordSalt = hmac.Key
            };

            context.AppUsers.Add(user);
            await context.SaveChangesAsync();

            return new UserDto { UserName = registerDto.UserName, Token = tokenService.CreateToken(user) };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await context.AppUsers.FirstOrDefaultAsync(a => a.UserName == loginDto.UserName.ToLower());

            if (user == null) return Unauthorized("Invalid username");

            using var hmac = new HMACSHA512(user.PasswordSalt);

            var computeHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDto.Password));

            for (var i = 0; i < computeHash.Length; i++)
            {
                if (computeHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
            }

            return new UserDto { UserName = loginDto.UserName, Token = tokenService.CreateToken(user) };
        }

        private async Task<bool> UserExists(string userName)
        {
            return await context.AppUsers.AnyAsync(a => a.UserName.ToLower() == userName.ToLower());
        }
    }
}
