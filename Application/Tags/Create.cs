using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tags
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Tag Tag {get; set;}
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Tag).SetValidator(new TagValidator());
            }
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

                user.Tags.Add(request.Tag);

                var result = await context.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Failure("Failed to create tag");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}