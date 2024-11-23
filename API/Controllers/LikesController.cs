using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class LikesController(ILikesRepository likesRepository) : BaseApiController
    {
        [HttpPost("{targetuserId:int}")]
        public async Task<IActionResult> ToggleLike(int targetuserId)
        {
            var sourceUserId = User.GetUserId();

            if (sourceUserId == targetuserId) return BadRequest("You can't like yourself");

            var existingLike = await likesRepository.GetUserLike(sourceUserId, targetuserId);

            if (existingLike == null)
            {
                UserLike like = new()
                {
                    SourceUserId = sourceUserId,
                    TargetUserId = targetuserId
                };

                likesRepository.AddLike(like);
            }
            else
            {
                likesRepository.DeleteLike(existingLike);
            }

            if (await likesRepository.SaveChanges()) return Ok();

            return BadRequest("Failed to update like");
        }

        [HttpGet("list")]
        public async Task<ActionResult<IEnumerable<int>>> GetCurrentUserLikeIds()
        {
            return Ok(await likesRepository.GetCurrentUserLikeIds(User.GetUserId()));
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<MemberDto>>> GetUserLikes([FromQuery] LikesParams likesParams)
        {
            likesParams.UserId = User.GetUserId();

            var members = await likesRepository.GetUserLikes(likesParams);

            Response.AddPaginationHeader(members);

            return Ok(members);
        }
    }
}
