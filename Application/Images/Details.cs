using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
    public class Details
    {
        public class Query : IRequest<Result<ImageDataDto>>
        {
            public string Id {get; set;}
        }

        public class Handler : IRequestHandler<Query, Result<ImageDataDto>>
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

            public async Task<Result<ImageDataDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await context.Users
                    .Include(x => x.ImagesData.Where(t => t.Id == request.Id))
                    .ThenInclude(x => x.TagImageData)
                    .ThenInclude(x => x.Tag)
                    .FirstOrDefaultAsync(x =>x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                ImageData img = user.ImagesData.FirstOrDefault();
                if(img == null) return null;

                return Result<ImageDataDto>.Success(new ImageDataDto(img));
            }
        }
    }
}