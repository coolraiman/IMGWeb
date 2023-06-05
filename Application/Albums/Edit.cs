using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Albums
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public EditAlbumDto Album {get; set;}
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(t => t.Albums).FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                var album = user.Albums.FirstOrDefault(x => x.Id == request.Album.Id);

                if(album == null) return null;

                album.Name = request.Album.Name;
                album.Description = request.Album.Description;

                var result = await context.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Failure("Failed to update album");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}