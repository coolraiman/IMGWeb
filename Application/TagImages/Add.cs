using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.TagImages
{
    public class Add
    {
        public class Command : IRequest<Result<Unit>>
        {
            public TagImageDto TagImageDto {get; set;}
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
                var user = await context.Users.
                    Include(t => t.Tags).Include(i => i.ImagesData).ThenInclude(ti => ti.TagImageData)
                    .FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                var tag = user.Tags.FirstOrDefault(x => x.Id == request.TagImageDto.TagId);
                var img = user.ImagesData.FirstOrDefault(x => x.Id == request.TagImageDto.ImageId);

                if(tag == null || img == null) return null;
                TagImageData tid = new TagImageData{
                    ImageDataId = request.TagImageDto.ImageId,
                    TagId = request.TagImageDto.TagId
                };
                //verify if tag already exist for this image
                if(img.TagImageData.FirstOrDefault(t => t.TagId == tag.Id) != null)
                {//do not return an error, it is expected that some images may already have the tag
                    return Result<Unit>.Success(Unit.Value);
                }
                tag.TagImageData.Add(tid);
                img.TagImageData.Add(tid);

                var result = await context.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Failure("Failed to add tag to image");
                
                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}