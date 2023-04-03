using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Albums
{
    public class List
    {
        public class Query : IRequest<Result<List<AlbumDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<AlbumDto>>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<List<AlbumDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(x => x.Albums)
                    .ThenInclude(x => x.AlbumImages).ThenInclude(x => x.ImageData).ThenInclude(x => x.TagImageData).ThenInclude(x =>x.Tag)
                    .FirstOrDefaultAsync(x =>x.UserName == userAccessor.GetUsername());

                List<AlbumDto> albumsDto = new List<AlbumDto>();
                foreach (Album i in user.Albums)
                {
                    albumsDto.Add(new AlbumDto(i));
                }

                return Result<List<AlbumDto>>.Success(albumsDto);
            }
        }
    }
}