import React from "react";
import { MapContext } from "@react-google-maps/api";
class Spiderfy extends React.Component {

    constructor(props) {
        super(props);
        const oms = require(`npm-overlapping-marker-spiderfier/lib/oms.min`);
        this.oms = new oms.OverlappingMarkerSpiderfier(
            MapContext._currentValue,
            {
                // options
            }
        );
        this.markerNodeMounted = this.markerNodeMounted.bind(this);
    }

    async markerNodeMounted(ref) {
        ref && ref.marker &&
            (() => {
                this.oms.addMarker(ref.marker);
                window.google.maps.event.addListener(
                    ref.marker,
                    "spider_click",
                    e => {
                        if (this.props.onSpiderClick) {
                            this.props.onSpiderClick(e)
                        }
                    }
                );
            })();
    }

    render() {
        return React.Children.map(this.props.children, child =>
            React.cloneElement(child, { ref: this.markerNodeMounted })
        );
    }
}

export default Spiderfy;
