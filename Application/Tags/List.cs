using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tags
{
    public class List
    {
        public class Query : IRequest<Result<List<TagDto>>> {}

        public class Handler : IRequestHandler<Query, Result<List<TagDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.context = context;
                this.mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<List<TagDto>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(t => t.Tags).ThenInclude(x => x.TagImageData).FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());
                //could not use mapper in this context
                List<TagDto> tagDtos = new List<TagDto>();
                foreach(Tag tag in user.Tags)
                {
                    tagDtos.Add(new TagDto(tag, tag.TagImageData.Count()));
                }

                return Result<List<TagDto>>.Success(tagDtos);
            }
        }
    }
}