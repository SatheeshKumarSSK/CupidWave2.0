using API.DTOs;
using API.Entities;
using API.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper) : BaseApiController
    {
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register([FromBody] RegisterDto registerDto)
        {
            if (await UserExists(registerDto.Username)) return BadRequest("Username is already taken");

            var user = mapper.Map<AppUser>(registerDto);

            user.UserName = registerDto.Username.ToLower();

            var result = await userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest(result.Errors);

            var roleResult = await userManager.AddToRoleAsync(user, "Member");

            if (!roleResult.Succeeded) return BadRequest(roleResult.Errors);

            return new UserDto
            {
                Username = registerDto.Username,
                KnownAs = registerDto.KnownAs,
                Gender = registerDto.Gender,
                Token = await tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault()?.Url
            };
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login([FromBody] LoginDto loginDto)
        {
            var user = await userManager.Users.Include(a => a.Photos)
                .FirstOrDefaultAsync(a => a.NormalizedUserName == loginDto.Username.ToUpper());

            if (user == null || user.UserName == null) return Unauthorized("Invalid username");

            var result = await userManager.CheckPasswordAsync(user, loginDto.Password);

            if (!result) return Unauthorized();

            return new UserDto
            {
                Username = user.UserName,
                KnownAs = user.KnownAs,
                Gender = user.Gender,
                Token = await tokenService.CreateToken(user),
                PhotoUrl = user.Photos.FirstOrDefault(p => p.IsMain)?.Url
            };
        }

        private async Task<bool> UserExists(string userName)
        {
            return await userManager.Users.AnyAsync(a => a.NormalizedUserName == userName.ToUpper());
        }
    }
}
