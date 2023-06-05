using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.TagImages
{
    public class Remove
    {
        public class Command : IRequest<Result<Unit>>
        {
            public TagImageDto TagImageDto;
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

                TagImageData tid = await context.TagImageDatas.FirstOrDefaultAsync(
                    x => x.TagId == request.TagImageDto.TagId && x.ImageDataId == request.TagImageDto.ImageId);

                if(tid == null) return null;
                context.TagImageDatas.Remove(tid);

                var Success = await context.SaveChangesAsync() > 0;
                //we do not want an error if the tag was not removed
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}