using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Metadata.Profiles.Iptc;

namespace Application.Images
{
    public class Add
    {
        public class Command : IRequest<Result<ImageDataDto>>
        {
            public IFormFile File {get; set;}
        }

        public class Handler : IRequestHandler<Command, Result<ImageDataDto>>
        {
            private readonly DataContext _context;
            private readonly IPhotoAccessor _photoAccessor;
            private readonly IUserAccessor _userAccessor;
            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                _context = context;
                _photoAccessor = photoAccessor;
                _userAccessor = userAccessor;
            }

            public async Task<Result<ImageDataDto>> Handle(Command request, CancellationToken cancellationToken)
            {
                var user = await _context.Users.Include(p => p.ImagesData)
                    .FirstOrDefaultAsync(x => x.UserName == _userAccessor.GetUsername());

                if(user == null) return null;

                var imageUploadResult = await _photoAccessor.AddPhoto(request.File);

                var imageInfo = Image.Identify(request.File.OpenReadStream());
                var metadata = imageInfo.Metadata;


                var imgData = new ImageData
                {
                    Id = imageUploadResult.PublicId,
                    Url = imageUploadResult.Url,
                    Extension = imageUploadResult.Url.Split('.').LastOrDefault(),
                    FileName = request.File.FileName,
                    FileSize = request.File.Length,
                    Height = imageInfo.Size.Height,
                    Width = imageInfo.Size.Width,
                    Views = 0,
                    DateAdded = DateTime.Now,
                    Rating = 0,
                    Favorite = false,
                    Metadata = ""
                };
                //TODO fix it
                /*
                if(metadata.IptcProfile?.Values?.Any()??false)
                {
                    foreach(var meta in metadata.IptcProfile.Values)
                    {
                        imgData.Metadata += meta.Tag.ToString() + ":{";
                        foreach(var val in meta.Value)
                        {
                            imgData.Metadata += val.ToString() + "-";
                        }
                        imgData.Metadata += "}";
                    }
                    imgData.Metadata = metadata.IptcProfile.ToString();
                }*/

                user.ImagesData.Add(imgData);

                var result = await _context.SaveChangesAsync() > 0;

                if(result)
                {
                    user.SpaceUsed += imgData.FileSize;
                    await _context.SaveChangesAsync();
                    return Result<ImageDataDto>.Success(new ImageDataDto(imgData));
                } 

                return Result<ImageDataDto>.Failure("Problem adding photo");
            }
        }
    }
}