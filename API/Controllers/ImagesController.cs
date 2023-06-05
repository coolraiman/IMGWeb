using Application.GenericDtos;
using Application.Images;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class ImagesController : BaseApiController
    {
        [HttpGet] 
        public async Task<IActionResult> GetImages()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("not-tagged")] 
        public async Task<IActionResult> GetImagesNotTagged()
        {
            return HandleResult(await Mediator.Send(new ListNotTagged.Query()));
        }

        [HttpGet("get/{id}")] 
        public async Task<IActionResult> GetImage(string id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromForm] Add.Command command)
        {
            return HandleResult(await Mediator.Send(command));
        }
        [Route("search")]
        [HttpPost]
        public async Task<IActionResult> Search(SearchDto searchParam)
        {
            return HandleResult(await Mediator.Send(new Search.Query{SearchParams = searchParam}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{ImageId = id}));
        }

        [HttpPut("addview/{id}")]
        public async Task<IActionResult> AddView(string id)
        {
            return HandleResult(await Mediator.Send(new AddView.Command{ImageId = id}));
        }

        [HttpPut("updatefavorite/{id}")]
        public async Task<IActionResult> UpdateFavorite(string id)
        {
            return HandleResult(await Mediator.Send(new UpdateFavorite.Command{ImageId = id}));
        }

        [HttpPut("updaterating/{id}")]
        public async Task<IActionResult> UpdateRating(string id, IntDto rating)
        {
            return HandleResult(await Mediator.Send(new UpdateRating.Command{ImageId = id, Rating = rating}));
        }
    }
}