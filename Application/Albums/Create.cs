using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Albums
{
    public class Create
    {
        public class Command : IRequest<Result<AlbumDto>>
        {
            public CreateAlbumDto Album {get; set;}
        }

        public class Handler : IRequestHandler<Command, Result<AlbumDto>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<AlbumDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(t => t.Albums).FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());

                if(user == null) return null;
                Album album = new Album{Name = request.Album.Name, Description = request.Album.Description};
                user.Albums.Add(album);

                var result = await context.SaveChangesAsync() > 0;

                if(!result) return Result<AlbumDto>.Failure("Failed to create tag");
                AlbumDto albumDto = new AlbumDto(album);

                return Result<AlbumDto>.Success(albumDto);
            }
        }
    }
}