using Application.Core;
using Application.Interfaces;
using Application.GenericDtos;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;


namespace Application.Images
{
    public class UpdateRating
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string ImageId {get; set;}
            public IntDto Rating {get; set;}
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext _context;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                _context = context;
                _userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                if(request.Rating.Value < 0 || request.Rating.Value > 5)
                {
                    return Result<Unit>.Failure("Rating must be between 0 and 5");
                }

                var user = await _context.Users.Include(p => p.ImagesData)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if(user == null) return null;

                var img = user.ImagesData.FirstOrDefault(x => x.Id == request.ImageId);

                if(img == null) return null;

                img.Rating = request.Rating.Value;

                var result = await _context.SaveChangesAsync() > 0;

                if(result) return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Problem changing rating");
            }
        }
    }
}