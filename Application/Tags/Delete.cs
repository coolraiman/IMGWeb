using Application.Core;
using Application.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tags
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public long Id {get; set;}
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
                var user = await context.Users.Include(t => t.Tags).FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                var tag = user.Tags.FirstOrDefault(x => x.Id == request.Id);

                if(tag == null) return null;

                context.Tags.Remove(tag);

                var Success = await context.SaveChangesAsync() > 0;

                if(Success) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem deleting tag from API");
            }
        }
    }
}