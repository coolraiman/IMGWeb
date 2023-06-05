using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string ImageId {get; set;}
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            private readonly IPhotoAccessor photoAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IPhotoAccessor photoAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
                this.photoAccessor = photoAccessor;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(i => i.ImagesData).FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                var imgData = user.ImagesData.FirstOrDefault(x => x.Id == request.ImageId);

                if(imgData == null) return null;

                var result = await photoAccessor.DeletePhoto(imgData.Id);

                if(result == null) return Result<Unit>.Failure("Problem deleting photo from cloud");

                context.ImagesData.Remove(imgData);

                var success = await context.SaveChangesAsync() > 0;

                if(success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting photo from API");
            }
        }
    }
}