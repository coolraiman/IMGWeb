using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Images;
using Application.Tags;
using AutoMapper;
using Domain;

namespace Application.Core
{
    public class MappingProfiles : Profile
    {
        public MappingProfiles()
        {
            CreateMap<Tag, Tag>();
            CreateMap<Tag, TagDto>();
            CreateMap<AppUser, Profiles.Profile>();
        }
    }
}