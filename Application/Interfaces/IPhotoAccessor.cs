using Application.Images;
using Microsoft.AspNetCore.Http;

namespace Application.Interfaces
{
    public interface IPhotoAccessor
    {
        Task<ImageUploadResult> AddPhoto(IFormFile file);
        Task<string> DeletePhoto(string publicId);
    }
}