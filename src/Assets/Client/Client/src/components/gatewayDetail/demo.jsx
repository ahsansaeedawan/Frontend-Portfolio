    import React, { Component, useContext } from "react";
    import cn from "classnames";
    import Moment from "react-moment";
    import Gallery from "../imageGallery/imageGallery";
    import InfoMessage from "../infoMessage/infoMessage";
    import { fetchGatewayTimeline } from "../../api";
    import { NO_TIMELINE_EVENT } from "../../constants/messages";
    import "./gatewayDetailTimeline.css";
    import { TimelineCall } from "./timelineCall";
    import { UserContext } from "../../context";
    export const TimeLine = ({ timeline }) => {
    const user = useContext(UserContext);
    return (
        <div className="timeline">
        {timeline.map((event) => {
            if (event.eventType === "reportSubmitted") {
            return <TimelineMediaItem key={event._id} event={event} />;
            }
            if (user.organization.videoFeed) {
            if (event.eventType === "videofeed") {
                return <TimelineVideoFeed key={event._id} event={event} />;
            }
            }
            if (event.eventType === "call") {
            return <TimelineCall key={event._id} event={event} />;
            }
            return (
            <div
                key={event._id}
                className={cn("timeline-item event-dot", event.eventType, {
                "event-dot": event.alarmEvent,
                // "not-alarm-event": !event.alarmEvent,
                })}
            >
                <div
                className={cn("event-detail", {
                    //"not-alarm-event": !event.alarmEvent,
                })}
                >
                <div className="event-type-time">
                    <p
                    className={cn("description", "abs-sf-icon", {
                        "e-type-comment": event.eventType === "comment",
                    })}
                    >
                    {event.eventDesc}
                    </p>
                    <i className="sf-icon i-connector line" />
                    <Moment format="DD-MMM-YYYY, hh:mm:ss A" className="time" local>
                    {event.eventUtc}
                    </Moment>
                </div>
                {event.origin && <p className="a-origin">{event.origin.name}</p>}
                {event.eventSubDesc && <p className="a-origin">{event.eventSubDesc}</p>}
                {event.comments && <p className="a-comment">{event.comments}</p>}
                {event.subTitle && (
                    <p className="actioned-by">{event.subTitle}</p>
                )}
                </div>
            </div>
            );
        })}
        </div>
    );
    };
    const TimelineVideoFeed = ({ event }) => {
    return (
        <div className={cn("timeline-item event-dot", "not-alarm-event", event.eventType)}>
        <div className="event-detail event-dot not-alarm-event">
            <div className="event-type-time">
            <p className="a-video-feed abs-sf-icon">
                {event.eventDesc}
                <a
                href={event.link}
                rel="noopener noreferrer"
                target="_blank"
                className="video-feed-link"
                >
                Click here to view
                </a>
            </p>
            <i className="sf-icon i-connector line" />
            <Moment format="DD-MMM-YYYY, hh:mm:ss A" className="time" local>
                {event.eventUtc}
            </Moment>
            </div>
        </div>
        </div>
    );
    };
    const AudioRecordings = ({ recordings }) => {
    if (!recordings) return null;
    return recordings.map((recording, i) => (
        <div key={`recording-${i}`} className="audio-recording">
        <audio autoPlay={false} controls controlsList="nodownload">
            <source src={recording} type="audio/mpeg" />
            Your browser does not support the audio element.
        </audio>
        </div>
    ));
    };
    const TimelineMediaItem = ({ event }) => {
    const renderMedia = () => {
        if (!event.media || !Array.isArray(event.media)) return null;
        const audios = [],
        videos = [],
        images = [],
        renderedMedia = [];
        event.media.forEach((item) => {
        if (item.mediaType === "image") {
            images.push(item.mediaUrl);
        }
        if (item.mediaType === "audio") {
            audios.push(item.mediaUrl);
        }
        if (item.mediaType === "video") {
            videos.push(item.mediaUrl);
        }
        });
        const media = [...images, ...videos];
        const gallery = (
        <Gallery
            key="timeline-media-gallery"
            galleryClasses="timeline-media-gallery"
            files={media}
            thumbnails={media}
        />
        );
        const audioRecordings = (
        <AudioRecordings key="timeline-media-recordings" recordings={audios} />
        );
        renderedMedia.push(gallery);
        renderedMedia.push(audioRecordings);
        return renderedMedia;
    };
    return (
        <div className={cn("timeline-item", "not-alarm-event", event.eventType)}>
        <p className="a-comment abs-sf-icon">{event.actionTaken}</p>
        {renderMedia()}
        <div className="event-detail media-event-detail">
            <div className="event-type-time">
            <p className="description">{event.subTitle && event.subTitle}</p>
            <i class="sf-icon i-connector line"></i>
            <Moment format="DD-MMM-YYYY, hh:mm:ss A" className="time" local>
                {event.eventUtc}
            </Moment>
            </div>
        </div>
        </div>
    );
    };
    export const TimelineLoading = () => (
    <div className="timeline-loading">
        <div className="lds-ring">
        <div />
        <div />
        <div />
        <div />
        </div>
    </div>
    );
    class GatewayDetailTimeline extends Component {
    constructor(props) {
        super(props);
        this.state = {
        timeline: [],
        loading: true,
        };
    }
    pollTimelineApi = (mac) => {
        fetchGatewayTimeline(mac)
        .then(({ data }) => {
            if (data && data.data) {
            const { timeline = null } = data.data;
            if (timeline) {
                this.setState({ timeline });
            }
            }
        })
        .catch(() => { })
        .finally(() => {
            this.setState({ loading: false }, this.pollTimeline);
        });
    };
    pollTimeline = () => {
        clearInterval(this.pollTimer);
        this.pollTimer = setInterval(() => {
        fetchGatewayTimeline(this.props.mac)
            .then(({ data }) => {
            if (data && data.data) {
                const { timeline = null } = data.data;
                if (timeline) {
                this.setState({ timeline });
                }
            }
            })
            .catch(() => { })
            .finally(() => {
            this.setState({ loading: false });
            });
        }, 5000);
    };
    clearTimelinePoll = () => {
        clearInterval(this.pollTimer);
    };
    componentDidMount() {
        this.pollTimelineApi(this.props.mac);
    }
    componentWillUnmount() {
        this.clearTimelinePoll();
    }
    componentWillReceiveProps(nextProps) {
        if (
        this.props.isVisible &&
        nextProps.isVisible &&
        this.props.mac !== nextProps.mac
        ) {
        this.clearTimelinePoll();
        this.setState({ loading: true, timeline: [] });
        this.pollTimelineApi(nextProps.mac);
        }
        // If the detail view is mounted and is not visible, when it becomes visible
        if (!this.props.isVisible && nextProps.isVisible) {
        this.pollTimelineApi(nextProps.mac);
        }
        // Clear timer when details view is not visible.
        if (!nextProps.isVisible) {
        this.setState({ timeline: [] });
        this.clearTimelinePoll();
        }
    }
    render() {
        return (
        <div>
            {this.state.loading && <TimelineLoading />}
            {!this.state.loading && this.state.timeline.length > 0 && (
            <TimeLine timeline={this.state.timeline} />
            )}
            {!this.state.loading && this.state.timeline.length === 0 && (
            <InfoMessage message={NO_TIMELINE_EVENT} />
            )}
        </div>
        );
    }
    }
    GatewayDetailTimeline.propTypes = {};
    export default GatewayDetailTimeline;