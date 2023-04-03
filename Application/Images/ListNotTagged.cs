using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Images
{
    public class ListNotTagged
    {
        public class Query : IRequest<Result<List<ImageDataDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<ImageDataDto>>>
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

            public async Task<Result<List<ImageDataDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await context.Users
                    .Include(x => x.ImagesData.Where(i => i.TagImageData.Count == 0))
                    .ThenInclude(x => x.TagImageData)
                    .ThenInclude(x => x.Tag)
                    .FirstOrDefaultAsync(x =>x.UserName == userAccessor.GetUsername());

                List<ImageDataDto> imgDto = new List<ImageDataDto>();
                foreach (ImageData i in user.ImagesData)
                {
                    imgDto.Add(new ImageDataDto(i));
                }

                return Result<List<ImageDataDto>>.Success(imgDto);
            }
        }
    }
}