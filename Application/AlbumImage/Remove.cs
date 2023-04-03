using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.AlbumImage
{
    public class Remove
    {
        public class Command : IRequest<Result<Unit>>
        {
            public AlbumImageDto AlbumImageDto;
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
                var user = await context.Users.FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                AlbumImages aid = await context.AlbumImages.FirstOrDefaultAsync
                    (x => x.ImageDataId == request.AlbumImageDto.ImageId && x.AlbumId == request.AlbumImageDto.AlbumId);
                
                if(aid == null) return null;
                context.AlbumImages.Remove(aid);

                var Success = await context.SaveChangesAsync() > 0;

                if(Success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem finding the album or image");
            }
        }
    }
}