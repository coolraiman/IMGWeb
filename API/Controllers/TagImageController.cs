using Application.TagImages;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TagImageController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> AddTagImage(TagImageDto tag)
        {
            return HandleResult(await Mediator.Send(new Add.Command {TagImageDto = tag}));
        }

        [Route("remove")]
        [HttpPost]
        public async Task<IActionResult> RemoveTagImage(TagImageDto tag)
        {
            return HandleResult(await Mediator.Send(new Remove.Command {TagImageDto = tag}));
        }
    }
}