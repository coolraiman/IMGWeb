using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Albums
{
    public class Details
    {
        public class Query : IRequest<Result<AlbumDto>>
        {
            public int Id {get; set;}
        }

        public class Handler : IRequestHandler<Query, Result<AlbumDto>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            private readonly IMapper mapper;

            public Handler(DataContext context, IUserAccessor userAccessor, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<AlbumDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await context.Users
                    .Include(x => x.Albums.Where(a => a.Id == request.Id).Take(1))
                    .ThenInclude(x => x.AlbumImages)
                    .ThenInclude(x => x.ImageData)
                    .ThenInclude(x => x.TagImageData)
                    .ThenInclude(x =>x.Tag)
                    .FirstOrDefaultAsync(x =>x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                Album album = user.Albums.FirstOrDefault();
                if(album == null) return null;

                return Result<AlbumDto>.Success(new AlbumDto(album));
            }
        }
    }
}