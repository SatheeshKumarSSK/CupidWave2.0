using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc.Filters;

namespace API.Helpers
{
    public class LogUserActivity : IAsyncActionFilter
    {
        public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
        {
            var resultContext = await next();

            if (!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();
            var repository = resultContext.HttpContext.RequestServices.GetService<IUserRepository>();
            var user = await repository.GetUserAsync(userId);
            user.LastActive = DateTime.UtcNow;
            await repository.SaveAllAsync();
        }
    }
}
