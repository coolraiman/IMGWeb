using Application.Core;
using Application.Interfaces;
using AutoMapper;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tags
{
    public class Details
    {
        public class Query : IRequest<Result<TagDto>>
        {
            public long Id {get; set;}
        }

        public class Handler : IRequestHandler<Query, Result<TagDto>>
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
            public async Task<Result<TagDto>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(t => t.Tags).Include(i => i.ImagesData).FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());
                //could not use mapper in this context
                if(user == null) return null;
                var tag = user.Tags.FirstOrDefault(u => u.Id == request.Id);

                if(tag == null) return null;
                int references = context.TagImageDatas.Where(x => x.TagId == tag.Id).Count();
                TagDto tagDto = new TagDto(tag, references);

                return Result<TagDto>.Success(tagDto);
            }
        }
    }
}