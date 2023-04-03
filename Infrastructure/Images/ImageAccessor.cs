using Application.Interfaces;
using Application.Images;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace Infrastructure.Images
{
    public class ImageAccessor : IPhotoAccessor
    {
        private readonly Cloudinary _cloudinary;

        public ImageAccessor(IOptions<CloudinarySettings> config)
        {
            var account = new Account(
                config.Value.CloudName,
                config.Value.ApiKey,
                config.Value.ApiSecret
            );
            _cloudinary = new Cloudinary(account);
        }

        public async Task<Application.Images.ImageUploadResult> AddPhoto(IFormFile file)
        {
            if(file.Length > 0)
            {
                await using var stream = file.OpenReadStream();
                var uploadParams = new ImageUploadParams
                {
                    File = new FileDescription(file.FileName, stream),
                };

                var uploadResult = await _cloudinary.UploadAsync(uploadParams);

                if(uploadResult.Error != null)
                {
                    throw new Exception(uploadResult.Error.Message);
                }

                return new Application.Images.ImageUploadResult
                {
                    PublicId = uploadResult.PublicId,
                    Url = uploadResult.SecureUrl.ToString()
                };
            }

            return null;
        }

        public async Task<string> DeletePhoto(string publicId)
        {
            var deleteParams = new DeletionParams(publicId);
            var result = await _cloudinary.DestroyAsync(deleteParams);
            return result.Result == "ok" ? result.Result : null;
        }
    }
}