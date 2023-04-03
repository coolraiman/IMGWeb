using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Tags
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Tag Tag {get; set;}
        }

        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Tag).SetValidator(new EditTagValidator());
            }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
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

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await context.Users.Include(t => t.Tags).FirstOrDefaultAsync(x =>
                    x.UserName == userAccessor.GetUsername());

                if(user == null) return null;

                var tag = user.Tags.FirstOrDefault(x => x.Id == request.Tag.Id);

                if(tag == null) return null;

                mapper.Map(request.Tag, tag);

                var result = await context.SaveChangesAsync() > 0;

                if(!result) return Result<Unit>.Failure("Failed to update tag");

                return Result<Unit>.Success(Unit.Value);
            }
        }
    }
}