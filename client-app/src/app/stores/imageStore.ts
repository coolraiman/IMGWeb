import {MouseEvent} from 'react'
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { SearchDto } from "../dtos/searchDto";
import { NumberDto } from "../dtos/numberDto";
import { ImageData } from "../models/imageData";
import { TagImageDto } from "../dtos/tagImageDto";
import { Tag } from "../models/tag";
import { boolean } from 'yup';
import _ from 'lodash';

export default class ImageStore {
    loading : boolean = false;
    searchParams: SearchDto =
    {
        include : [],
        exclude : []
    };
    searchResult : ImageData[] = [];
    multiSelect: Map<string, ImageData> = new Map();
    multiSelectCombinedTags: Map<number, Tag> = new Map();
    selectedImage : ImageData | null = null;
    selectedIndex : number | null = null;
    loadingSelectedImageInfo : boolean = false;

    dropZoneFiles: any = [];
    uploading: boolean = false;
    uploadingIndex: number = 0;
    uploadedImages: ImageData[] = [];

    constructor() {
        makeAutoObservable(this)
    }

    searchImages = async () => {
        try {
            this.loading = true;
            const search = await agent.Images.search(this.searchParams);
            runInAction(() => {
                console.log(search.data.length)
                this.searchResult = search.data;
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.loading = false);
        }
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

    selectImage = async (img : ImageData) => {
        const index = this.searchResult.findIndex(x => x.id === img.id);
        if(index !== -1)
        {
            this.selectedImage = img;
            this.selectedIndex = index;
            await this.addViewToImage();
        }
    }

    updateRatings = async (rating : number, imgId : string) => {
        if(this.selectedImage !== null)
        {
            let ratingDto : NumberDto = {value: rating};
            try {
                this.loadingSelectedImageInfo = true;
                await agent.Images.updateRating(ratingDto, imgId);
                runInAction(() => {
                    this.selectedImage!.rating = rating;
                });
            } catch (error) {
                console.log(error);
            } finally {
                runInAction(() => this.loadingSelectedImageInfo = false);
            }
        }
    }

    updateSelectedImageFavorite = async () => {
        if(this.selectedImage !== null)
        {
            try {
                this.loadingSelectedImageInfo = true;
                await agent.Images.updateFavorite(this.selectedImage.id);
                runInAction(() => {
                    this.selectedImage!.favorite = !this.selectedImage!.favorite;
                });
            } catch (error) {
                console.log(error);
            } finally {
                runInAction(() => this.loadingSelectedImageInfo = false);
            }
        }
    }

    addViewToImage = async () => {
        if(this.selectedImage !== null)
        {
            try {
                await agent.Images.addView(this.selectedImage.id);
                runInAction(() => {
                    this.selectedImage!.views++;
                });
            } catch (error) {
                console.log(error);
            }
        }
    }

    nextImage = async () => {
        if(this.selectedImage != null && this.selectedIndex != null)
        {
            this.selectedIndex++;
            if(this.selectedIndex >= this.searchResult.length)
            {
                this.selectedIndex = 0;
            }
            try {
                this.loadingSelectedImageInfo = true;
                await this.selectImage(this.searchResult[this.selectedIndex]);
            } catch (error) {
                console.log(error);
            }
            finally{
                runInAction(() => this.loadingSelectedImageInfo = false);
            }
        }
    }

    previousImage = async () => {
        if(this.selectedImage != null && this.selectedIndex != null)
        {
            this.selectedIndex--;
            if(this.selectedIndex <= 0)
            {
                this.selectedIndex = 0;
            }
            try {
                this.loadingSelectedImageInfo = true;
                await this.selectImage(this.searchResult[this.searchResult.length - 1]);
            } catch (error) {
                console.log(error);
            }
            finally
            {
                runInAction(() => this.loadingSelectedImageInfo = false);
            }
        }
    }

    setSelectedImageFromSelectedIndex = async () => {
        if(this.selectedIndex != null)
        {
            if(this.searchResult.length === 0)
            {
                this.selectedImage = null;
                this.selectedIndex = null;
                return;
            }
            else if(this.selectedIndex >= this.searchResult.length)
            {
                this.selectedIndex = this.searchResult.length - 1;
            }

            try {
                this.loadingSelectedImageInfo = true;
                await this.selectImage(this.searchResult[this.selectedIndex]);
            } catch (error) {
                console.log(error);
            }
            finally
            {
                runInAction(() => this.loadingSelectedImageInfo = false);
            }
        }
    }

    removeSelectedImage = () => {
        this.selectedImage = null;
    }

    deleteSelectedImage = async () => {
        if(this.selectedImage != null)
        {
            try
            {
                this.loadingSelectedImageInfo = true;
                await agent.Images.deleteImage(this.selectedImage.id);
                runInAction(() =>
                    this.searchResult = this.searchResult.filter(img => img.id !== this.selectedImage!.id
                ));
                await this.setSelectedImageFromSelectedIndex();
            }
            catch (error)
            {
                console.log(error);
            }
            finally{
                runInAction(() => this.loadingSelectedImageInfo = false);
            }
        }
    }

    uploadImages = async (files:Blob[]) => {
        this.uploading = true;
        this.uploadingIndex = 0;
        try {
            for(let i = 0; i < files.length; i++)
            {
                const response = await agent.Images.uploadImage(files[i]);
                const img: ImageData = response.data;
                runInAction(() => {
                    this.uploadingIndex++;
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
                this.uploadingIndex = 0;
                this.dropZoneFiles = [];
            });
        }
    }

    resetDropZoneFiles = () => {
        this.dropZoneFiles = [];
    }

    setDropZoneFile = (files: any) => {
        this.dropZoneFiles = files;
    }

    addTagToSelectedImage = async (tag: Tag) => {
        this.loadingSelectedImageInfo = true;
        let dto : TagImageDto = {imageId: this.selectedImage!.id, tagId: tag.id};
        try {
            await agent.TagImages.addTag(dto);
            runInAction(() => {
                this.selectedImage!.tags.push(tag);
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
                this.generateMultiSelectTagsMap();
                this.loading = false;
            })
        }
    }

    removeTagToSelectedImage = async (tag: Tag) => {
        this.loadingSelectedImageInfo = true;
        let dto : TagImageDto = {imageId: this.selectedImage!.id, tagId: tag.id};
        try {
            await agent.TagImages.removeTag(dto);
            runInAction(() => {
                this.selectedImage!.tags = this.selectedImage!.tags.filter(x => x.id !== tag.id);
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
                console.log(images.length)
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
                this.generateMultiSelectTagsMap();
                this.loading = false;
            })
        }
    }

    lastClickId : string = "";
    //**********multi select */
    selectManyImage = (e: MouseEvent<HTMLButtonElement>, imgClick: ImageData) => {
        const imgData : ImageData | undefined = this.searchResult.find(x => x.id === imgClick.id);
        if(imgData === undefined)
        {
            return;
        }
        if(this.lastClickId === "")
        {
            this.lastClickId = imgClick.id;
        }

        if(e.shiftKey)
        {
            let startIndex : number = this.searchResult.findIndex(x => x.id === imgClick.id);
            let endIndex : number = this.searchResult.findIndex(x => x.id === this.lastClickId);
            if(startIndex < 0 || endIndex < 0)
            {
                return;
            }
            if(endIndex < startIndex)
            {
                const temp : number = startIndex;
                startIndex = endIndex;
                endIndex = temp;
            }
            for(let i : number = startIndex; i <= endIndex; i++)
            {
                this.multiSelect.set(this.searchResult[i].id,this.searchResult[i]);
            }
        }
        else if(e.ctrlKey)
        {
            if(this.multiSelect.has(imgClick.id))
            {
                this.multiSelect.delete(imgClick.id);
            }
            else
            {
                this.multiSelect.set(imgClick.id, imgClick);
            }
        }
        else
        {
            const has : boolean = this.multiSelect.has(imgClick.id);
            this.multiSelect = new Map();
            if(!has)
            {
                this.multiSelect.set(imgClick.id,imgClick);
            }
        }
        this.lastClickId = imgClick.id;
        this.multiSelectCombinedTags = new Map();
        this.multiSelect.forEach((img) => {
            img.tags.forEach((tag) => {
                this.multiSelectCombinedTags.set(tag.id, tag);
            })
        })

    }

    resetMultiSelect = () => {
        this.multiSelect = new Map();
        this.multiSelectCombinedTags = new Map();
    }
    generateMultiSelectTagsMap = () => {
        this.multiSelectCombinedTags = new Map();
        this.multiSelect.forEach((img) => {
            img.tags.forEach((tag) => {
                this.multiSelectCombinedTags.set(tag.id, tag);
            })
        })
    }

}