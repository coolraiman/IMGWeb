using Application.Tags;
using Domain;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class TagsController : BaseApiController
    {
        [HttpGet]
        public async Task<IActionResult> GetTags()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("{id}")] 
        public async Task<ActionResult<TagDto>> GetTag(long id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTag(Tag tag)
        {
            return HandleResult(await Mediator.Send(new Create.Command {Tag = tag}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTag(long id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{Id = id}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditTag(long id, Tag tag)
        {
            tag.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Tag = tag}));
        }
    }
}