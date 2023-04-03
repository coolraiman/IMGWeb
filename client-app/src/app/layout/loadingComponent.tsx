import React from "react";
import { Dimmer, Loader } from "semantic-ui-react";

interface Props {
    inverted?: boolean;
    content?: string;
    styles?: object;
}

export default function LoadingComponent({inverted = true, content = 'loading...', styles={}}: Props) {
    return (
        <div style={{...styles}}>
            <Dimmer active={true} inverted={inverted}  >
                <Loader content={content}/>
            </Dimmer>
        </div>
    )
}