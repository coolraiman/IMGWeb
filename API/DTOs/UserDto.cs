using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto
    {
        public string DisplayName { get; set; }
        public string Token { get; set; }
        public string UserName {get; set;}
        public long SpaceUsed {get; set;}
        public long SpaceAllowed {get; set;}
    }
}