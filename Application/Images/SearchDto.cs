using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Application.Images
{
    public class SearchDto
    {
        public List<long> Include {get; set;} = new List<long>();
        public List<long> Exclude {get; set;} = new List<long>();
    }
}