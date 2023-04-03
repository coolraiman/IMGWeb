using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Domain
{
    public class TagImageData
    {
        public string ImageDataId {get; set;}
        public ImageData ImageData { get; set; }
        public long TagId {get; set;}
        public Tag Tag {get; set;}
    }
}