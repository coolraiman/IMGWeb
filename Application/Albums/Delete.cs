using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Albums
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int AlbumId {get; set;}
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
                var user = await context.Users.Include(i => i.Albums).FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                var album = user.Albums.FirstOrDefault(x => x.Id == request.AlbumId);

                if(album == null) return null;

                context.Albums.Remove(album);

                var success = await context.SaveChangesAsync() > 0;

                if(success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting album");
            }
        }
    }
}