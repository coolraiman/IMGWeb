using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Tags
{
    public class TagDto
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
        public int References {get; set;} = 0;

        public TagDto(){}
        public TagDto(Tag tag, int references)
        {
            Id = tag.Id;
            Name = tag.Name;
            Description = tag.Description;
            References = references;
        }
    }
}