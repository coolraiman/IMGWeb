using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetProfile()
        {
            return HandleResult(await Mediator.Send(new Details.Query{}));
        }
    }
}