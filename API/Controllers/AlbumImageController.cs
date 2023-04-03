using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.AlbumImage;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AlbumImageController : BaseApiController
    {
        [HttpPost]
        public async Task<IActionResult> AddTagImage(AlbumImageDto albumImageDto)
        {
            return HandleResult(await Mediator.Send(new Add.Command {AlbumImageDto = albumImageDto}));
        }

        [HttpDelete]
        public async Task<IActionResult> RemoveTagImage(AlbumImageDto albumImageDto)
        {
            return HandleResult(await Mediator.Send(new Remove.Command {AlbumImageDto = albumImageDto}));
        }
    }
}