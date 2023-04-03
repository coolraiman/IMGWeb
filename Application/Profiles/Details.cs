using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Details
    {
        public class Query : IRequest<Result<Profile>>{}

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Profile>> Handle(Query request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(p => p.ImagesData)
                    .FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                return Result<Profile>.Success(new Profile{
                     Username = user.UserName,
                     DisplayName = user.DisplayName,
                     SpaceUsed = user.SpaceUsed,
                     SpaceAllowed = user.SpaceAllowed
                     });
            }
        }
    }
}