using Application.Albums;
using Microsoft.AspNetCore.Mvc;
using Application.GenericDtos;

namespace API.Controllers
{
    [Route("api/[controller]")]
    public class AlbumsController : BaseApiController
    {
        [HttpGet] 
        public async Task<IActionResult> GetImages()
        {
            return HandleResult(await Mediator.Send(new List.Query()));
        }

        [HttpGet("get/{id}")] 
        public async Task<IActionResult> GetImage(int id)
        {
            return HandleResult(await Mediator.Send(new Details.Query{Id = id}));
        }

        [HttpPost]
        public async Task<IActionResult> CreateAlbum(CreateAlbumDto album)
        {
            return HandleResult(await Mediator.Send(new Create.Command {Album = album}));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command{AlbumId = id}));
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> EditTag(int id, EditAlbumDto album)
        {
            album.Id = id;
            return HandleResult(await Mediator.Send(new Edit.Command{Album = album}));
        }

        [Route("search")]
        [HttpPost]
        public async Task<IActionResult> Search(StringDto searchParam)
        {
            return HandleResult(await Mediator.Send(new Search.Query{SearchParam = searchParam}));
        }

        [HttpPut("addview/{id}")]
        public async Task<IActionResult> AddView(int id)
        {
            return HandleResult(await Mediator.Send(new AddView.Command{AlbumId = id}));
        }

        [HttpPut("updatefavorite/{id}")]
        public async Task<IActionResult> UpdateFavorite(int id)
        {
            return HandleResult(await Mediator.Send(new UpdateFavorite.Command{AlbumId = id}));
        }

        [HttpPut("updaterating/{id}")]
        public async Task<IActionResult> UpdateRating(int id, IntDto rating)
        {
            return HandleResult(await Mediator.Send(new UpdateRating.Command{AlbumId = id, Rating = rating}));
        }
    }
}