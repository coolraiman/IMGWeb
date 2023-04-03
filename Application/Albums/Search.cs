using Application.Core;
using Application.Interfaces;
using Application.GenericDtos;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Albums
{
    public class Search
    {
        public class Query : IRequest<Result<List<AlbumDto>>> 
        {
            public StringDto SearchParam {get; set;}
        }

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
                var user = await context.Users
                    .Include(x => x.Albums
                        .Where(i =>
                            i.Name.Contains(request.SearchParam.Value)
                        )
                    ).ThenInclude(x => x.AlbumImages)
                    .ThenInclude(x => x.ImageData)
                    .ThenInclude(x => x.TagImageData)
                    .ThenInclude(x =>x.Tag)
                    .FirstOrDefaultAsync(x =>x.UserName == userAccessor.GetUsername());

                List<AlbumDto> albumDto = new List<AlbumDto>();
                foreach (Album i in user.Albums)
                {
                    albumDto.Add(new AlbumDto(i));
                }

                return Result<List<AlbumDto>>.Success(albumDto);
            }
        }
    }
}