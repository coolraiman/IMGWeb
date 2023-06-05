using Domain;
using FluentValidation;

namespace Application.Tags
{
    public class EditTagValidator: AbstractValidator<Tag>
    {
        public EditTagValidator()
        {
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Description).MaximumLength(1000);
        }
    }
}