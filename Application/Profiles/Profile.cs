using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Domain;

namespace Application.Profiles
{
    public class Profile
    {
        public string Username { get; set; }
        public string DisplayName { get; set; }
        public long SpaceUsed { get; set; }
        public long SpaceAllowed {get; set;}
    }
}