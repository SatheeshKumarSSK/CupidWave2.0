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

            if (resultContext == null || resultContext.HttpContext.User.Identity == null
                || !resultContext.HttpContext.User.Identity.IsAuthenticated) return;

            var userId = resultContext.HttpContext.User.GetUserId();

            var unitOfWork = resultContext.HttpContext.RequestServices.GetService<IUnitOfWork>();
            if (unitOfWork == null) return;

            var user = await unitOfWork.UserRepository.GetUserAsync(userId);
            if (user == null) return;

            user.LastActive = DateTime.UtcNow;
            await unitOfWork.Complete();
        }
    }
}
