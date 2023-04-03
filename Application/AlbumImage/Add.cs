using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.AlbumImage
{
    public class Add
    {
        public class Command : IRequest<Result<Unit>>
        {
            public AlbumImageDto AlbumImageDto {get; set;}
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
                var user = await context.Users
                    .Include(t => t.Albums.Where(a => a.Id == request.AlbumImageDto.AlbumId).Take(1))
                    .Include(i => i.ImagesData.Where(a => a.Id == request.AlbumImageDto.ImageId).Take(1))
                    .FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                var album = user.Albums.FirstOrDefault();
                var img = user.ImagesData.FirstOrDefault();

                if(album == null || img == null) return null;
                AlbumImages aid = new AlbumImages{
                    ImageDataId = img.Id,
                    AlbumId = album.Id
                };
                //verify if tag already exist
                album.AlbumImages.Add(aid);
                img.AlbumImages.Add(aid);

                var result = await context.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Failure("Failed to add image to album");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}