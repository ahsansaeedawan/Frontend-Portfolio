import React, { Component, useContext, useState, useEffect } from "react";
import cn from "classnames";
import Moment from "react-moment";
import Gallery from "../imageGallery/imageGallery";
import InfoMessage from "../infoMessage/infoMessage";
import { fetchGatewayTimeline } from "../../api";
import { NO_TIMELINE_EVENT } from "../../constants/messages";
import "./gatewayDetailTimeline.css";
import { TimelineCall } from "./timelineCall";
import { UserContext } from "../../context";
import { fetchS3BucketUrls } from '../../api';
import { LoadingMask } from "../../components/loadingMask";

export const TimeLine = ({ timeline }) => {

  const user = useContext(UserContext);

  const [mediaState, setMediaState] = useState([]);
  const [audioState, setAudioState] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {

    let data = timeline.filter(type => type.eventType === "reportSubmitted");
    let media = data.length ? data[0].media : false;
    async function setTimeLineMediaData(media) {

      setLoading(true);
      const audios = [];
      const videos = [];
      const images = [];

      media.forEach(item => {
        if (item.mediaType === "image") {
          images.push({ url: item.mediaUrl, exe: 'img' });
        }
        if (item.mediaType === "audio") {
          audios.push({ url: item.mediaUrl, exe: 'mp3' });
        }
        if (item.mediaType === "video") {
          videos.push({ url: item.mediaUrl, exe: 'mp4' });
        }
      });

      let data = [...images, ...videos];
      let promiseData = [];
      let promiseAudio = [];
      let s3Urls = data.map(item => fetchS3BucketUrls(item.url));
      await Promise.all(s3Urls).then(res => {
        res.map(media => { promiseData.push(media.data) })
        data = promiseData.map((item, i) => data[i] = { url: item, exe: data[i].exe });
        setMediaState(data);
        setLoading(false);
      }).catch(error => error);

      let s3AudioUrls = audios.map(item => fetchS3BucketUrls(item.url));
      await Promise.all(s3AudioUrls).then(res => {
        res.map(media => { promiseAudio.push({ url: media.data, exe: 'mp3' }) })
        setAudioState(promiseAudio);
        setLoading(false);
      }).catch(error => error);
      return data;
    }
    media ? setTimeLineMediaData(media) : setLoading(false);
  }, [])



  return (
    <>

      {loading && <LoadingMask />}

      <div className="timeline">
        {timeline.map((event) => {
          if (event.eventType === "reportSubmitted") {
            return (
              <>
                <TimelineMediaItem key={event._id} media={mediaState} event={event} audios={audioState} />
              </>
            );
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
    </>
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
        <source src={recording.url} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
    </div>
  ));
};


const TimelineMediaItem = ({ event, media, audios }) => {
  const renderMedia = () => {
    if (!event.media || !Array.isArray(event.media)) return null;
    const renderedMedia = [];

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