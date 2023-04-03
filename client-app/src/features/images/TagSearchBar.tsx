import React, { Component, useState } from 'react'
import { observer } from "mobx-react-lite";
import { Fragment, useEffect } from "react";
import { Label, List, Search, SearchResultProps, Segment } from "semantic-ui-react";
import { Tag } from "../../app/models/tag";
import { useStore } from "../../app/stores/store";
import TagParam from "./TagParam";
import { includes, result } from 'lodash';
import _ from 'lodash';


interface Props{
    isInclude : boolean;
}

interface SearchResult {
    title: string;
    tag: Tag;
}

export default observer(function TagSearchBar({ isInclude}: Props)
{
    const [searchTerm, setSearchTerm] = useState('');
    const {tagStore, imageStore} = useStore();
    const {addIncludeParam, addExcludeParam, searchParams} = imageStore;
    const {tags} = tagStore;
    const [results, setResults] = useState<SearchResult[]>([]);

    const handleSearchChange = (event: any, { value }: any) => {
        setSearchTerm(value);
        let matchingResults = tags.filter((option) =>
          option.name.toLowerCase().includes(value.toLowerCase())
        );
        matchingResults = _.differenceWith(matchingResults, searchParams.include, (a,b) => a.id === b);
        matchingResults = _.differenceWith(matchingResults, searchParams.exclude, (a,b) => a.id === b);
        setResults(matchingResults.map(t => {
            return {
                title: t.name,
                tag: t
            }
        }));
      };

    const handleResultSelect = (event: any, { result }: any) =>
    {
        const selectedTag = tags.find((t) => t.id === result.tag.id);

        if(selectedTag !== undefined)
        {
            if(isInclude)
            {
                addIncludeParam(selectedTag.id);
            }
            else
            {
                addExcludeParam(selectedTag.id);
            }
        }
        setSearchTerm("");
    }

    return (
        <Search
            onSearchChange={handleSearchChange}
            onResultSelect={handleResultSelect}
            value={searchTerm}
            results={results}
        />

    )
})