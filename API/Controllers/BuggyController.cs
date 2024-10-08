﻿using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class BuggyController(DataContext context) : BaseApiController
    {
        [HttpGet("auth"), Authorize]
        public ActionResult<string> GetAuth()
        {
            return Unauthorized();
        }

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var user = context.AppUsers.Find(-1);
            if (user == null) return NotFound();
            return user;
        }

        [HttpGet("server-error")]
        public ActionResult<AppUser> GetServerError()
        {
            var thing = context.AppUsers.Find(-1) ?? throw new Exception("A bad thing has happened");
            return thing;
        }

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This was not a good request");
        }
    }
}
