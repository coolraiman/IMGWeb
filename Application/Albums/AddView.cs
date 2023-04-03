using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Albums
{
    public class AddView
    {
        public class Command : IRequest<Result<Unit>>
        {
            public int AlbumId {get; set;}
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.Albums)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if(user == null) return null;

                var album = user.Albums.FirstOrDefault(x => x.Id == request.AlbumId);

                if(album == null) return null;

                album.Views++;

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem adding views");
            }
        }
    }
}