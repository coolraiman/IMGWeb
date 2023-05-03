import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { SearchDto } from "../dtos/searchDto";
import { NumberDto } from "../dtos/numberDto";
import { ImageData } from "../models/imageData";
import { TagImageDto } from "../dtos/tagImageDto";
import { Tag } from "../models/tag";
import { SortManager } from '../../features/images/sortAlgo';

export default class ImageStore {
    loading : boolean = false;
    searchParams: SearchDto =
    {
        include : [],
        exclude : []
    };
    searchResult : ImageData[] = [];
    loadingSelectedImageInfo : boolean = false;

    dropZoneFiles: any = [];
    uploading: boolean = false;
    uploadedImages: ImageData[] = [];

    sortAlgo: SortManager = new SortManager();

    constructor() {
        makeAutoObservable(this)
    }

    searchImages = async () => {
        try {
            this.loading = true;
            const search = await agent.Images.search(this.searchParams);
            runInAction(() => {
                this.searchResult = search.data;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
    }

    editSearchResult = (imgs : ImageData[]) => {
        this.searchResult = imgs;
    }

    editUploadResult = (imgs : ImageData[]) => {
        this.uploadedImages = imgs;
    }

    sortImages = (index: number, order: boolean, images: ImageData[]) : ImageData[] => {
        return this.sortAlgo.sortImages([...images], index, order);
    }

    addIncludeParam = (id : number) => {
        if(this.searchParams.include.indexOf(id) === -1)
        {
            this.searchParams.include.push(id);
        }
    }

    removeIncludeParam = (id : number) => {
        const index : number = this.searchParams.include.indexOf(id);
        if(index !== -1)
        {
            this.searchParams.include.splice(index,1);
        }
    }

    addExcludeParam = (id : number) => {
        if(this.searchParams.exclude.indexOf(id) === -1)
        {
            this.searchParams.exclude.push(id);
        }
    }

    removeExcludeParam = (id : number) => {
        const index : number = this.searchParams.exclude.indexOf(id);
        if(index !== -1)
        {
            this.searchParams.exclude.splice(index,1);
        }
    }


    updateRatings = async (rating : number, imgId : string) => {

        let ratingDto : NumberDto = {value: rating};
        try {
            this.loadingSelectedImageInfo = true;
            await agent.Images.updateRating(ratingDto, imgId);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingSelectedImageInfo = false);
        }
    }

    updateImageFavorite = async (img : ImageData) => {
        try {
            this.loadingSelectedImageInfo = true;
            await agent.Images.updateFavorite(img.id);
            runInAction(() => img.favorite = !img.favorite);
            } catch (error) {
                console.log(error);
            } finally {
                runInAction(() => this.loadingSelectedImageInfo = false);
            }
    }

    addViewToImage = async (selectedImage: ImageData) => {

        try {
            this.loadingSelectedImageInfo = true;
            await agent.Images.addView(selectedImage.id);
            runInAction(() => selectedImage.views++);
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loadingSelectedImageInfo = false);
        }
    }

    deleteImage = async (toDelete: ImageData) => {
        try
        {
            this.loadingSelectedImageInfo = true;
            await agent.Images.deleteImage(toDelete.id);
        }
        catch (error)
        {
            console.log(error);
        }
        finally{
            runInAction(() => this.loadingSelectedImageInfo = false);
        }
    }

    deleteMultiSelectImageList = async (multiSelect : Map<string, ImageData>) => {
        try
        {
            this.loading = true;
            const imgs = Array.from(multiSelect.values());
            for(let i = 0; i < imgs.length; i++)
            {
                console.log(i);
                await agent.Images.deleteImage(imgs[i].id);
            }
        }
        catch(error)
        {
            console.log("error")
        }
        finally{
            runInAction(() => this.loading = false);
        }

    }

    uploadImages = async (files:Blob[]) => {
        this.uploading = true;
        try {
            for(let i = 0; i < files.length; i++)
            {
                const response = await agent.Images.uploadImage(files[i]);
                const img: ImageData = response.data;
                runInAction(() => {
                    this.uploadedImages.push(img);
                })
            }
        } catch (error) {
            console.log(error);
        }
        finally
        {
            runInAction(() => {
                this.uploading = false;
                this.dropZoneFiles = [];
            });
        }
    }

    resetImageUploads = () => {
        this.uploadedImages = [];
    }

    resetDropZoneFiles = () => {
        this.dropZoneFiles = [];
    }

    setDropZoneFile = (files: any) => {
        this.dropZoneFiles = files;
    }

    addTagToImage = async (img: ImageData, tag: Tag) => {
        this.loadingSelectedImageInfo = true;
        let dto : TagImageDto = {imageId: img.id, tagId: tag.id};
        try {
            await agent.TagImages.addTag(dto);
            runInAction(() => {
                img.tags.push(tag);
            })
        } catch (error) {
            console.log(error);
        }
        finally{
            runInAction(() => {
                this.loadingSelectedImageInfo = false;
            })
        }
    }

    addTagToImages = async (tag: Tag, images: ImageData[]) =>
    {
        console.log("add tag: " + tag.name + " to " + images.length)
        this.loading = true;
        try {
            for(let i = 0; i < images.length; i++)
            {
                if(images[i].tags.indexOf(tag) === -1)
                {
                    const dto : TagImageDto = {imageId: images[i].id, tagId: tag.id};
                    await agent.TagImages.addTag(dto);

                    runInAction(() => {
                        images[i].tags.push(tag);
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally
        {
            runInAction(() => {
                //this.generateMultiSelectTagsMap();
                this.loading = false;
            })
        }
    }

    removeTagFromImage = async (img: ImageData, tag: Tag) => {
        this.loadingSelectedImageInfo = true;
        let dto : TagImageDto = {imageId: img.id, tagId: tag.id};
        try {
            await agent.TagImages.removeTag(dto);
            runInAction(() => {
                img.tags = img.tags.filter(x => x.id !== tag.id);
            })
        } catch (error) {
            console.log(error);
        }
        finally{
            runInAction(() => {
                this.loadingSelectedImageInfo = false;
            })
        }
    }

    removeTagToImages = async (tag: Tag, images: ImageData[]) => {
        this.loading = true;
        try {
            for(let i = 0; i < images.length; i++)
            {
                if(images[i].tags.findIndex(t => t.id === tag.id) !== -1)
                {
                    const dto : TagImageDto = {imageId: images[i].id, tagId: tag.id};
                    await agent.TagImages.removeTag(dto);
                    runInAction(() => {
                        images[i].tags = images[i].tags.filter(x => x.id !== tag.id);
                    })
                }
            }
        } catch (error) {
            console.log(error);
        }
        finally
        {
            runInAction(() => {
                //this.generateMultiSelectTagsMap();
                this.loading = false;
            })
        }
    }

}