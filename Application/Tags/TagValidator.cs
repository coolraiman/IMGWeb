using Domain;
using FluentValidation;

namespace Application.Tags
{
    public class TagValidator: AbstractValidator<Tag>
    {
        public TagValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Description).MaximumLength(1000);
        }
    }
}