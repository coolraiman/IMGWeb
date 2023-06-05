import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Tag } from "../models/tag";

export default class TagStore {
    tags: Tag[] = [];
    searchResult: Tag[] = [];
    tagsLoaded = false;
    selectedTag: Tag | null = null;
    searchParam: string = "";

    constructor() {
        makeAutoObservable(this)
    }

    loadTags = async () => {
        try {
            this.tagsLoaded = false;
            const tags = await agent.Tags.list();
            runInAction(() => {
                this.tags = tags
                this.searchTags();
            });
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.tagsLoaded = true);
        }
    }

    deleteTag = async (id: number) => {
        try {
            this.tagsLoaded = false;
            await agent.Tags.delete(id);
            await this.loadTags();
            //
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.tagsLoaded = true);
        }
    }

    createTag = async (tag : Tag) => {
        try {
            this.tagsLoaded = false;
            await agent.Tags.create(tag);
            await this.loadTags();
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.tagsLoaded = true);
        }
    }

    editTag = async (tag : Tag) => {
        try {
            this.tagsLoaded = false;
            await agent.Tags.update(tag);
            runInAction(() => this.selectedTag = null);
            await this.loadTags();
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.tagsLoaded = true);
        }
    }

    setSelectedTag = (tag : Tag | null) => {
        this.selectedTag = tag;
    }

    setSearchParam = (search : string) => {
        this.searchParam = search;
        this.searchTags();
    }

    searchTags = () => 
    {
        if(this.searchParam === "")
        {
            this.searchResult = this.tags;
        }
        else
        {
            this.searchResult = this.tags.filter(item => item.name.includes(this.searchParam) || item.description.includes(this.searchParam));
        }
    }
}