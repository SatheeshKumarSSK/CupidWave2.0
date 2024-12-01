using System.Security.Claims;

namespace API.Extensions
{
    public static class ClaimsPrincipleExtensions
    {
        public static string GetUsername(this ClaimsPrincipal user)
        {
            var username = user.FindFirstValue(ClaimTypes.Name);

            return username ?? throw new Exception("Username not found in the token");
        }

        public static int GetUserId(this ClaimsPrincipal user)
        {
            var userId = int.Parse(user.FindFirstValue(ClaimTypes.NameIdentifier) ?? "0");

            return userId;
        }
    }
}
